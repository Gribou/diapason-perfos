from celery import shared_task
from django.utils import timezone
from constance import config
from urllib3.exceptions import InsecureRequestWarning
import requests
import urllib
import time

from aircrafts.models import ReferenceAircraftType
from .patterns import AIRCRAFT_LIST_PATTERN, STATIC_DATA_PATTERN, DYNAMIC_DATA_PATTERN
from .parsers import parse_aircraft, parse_reference, parse_rocd

MASS_HYPOTHESES_FOR_ROCD = [20, 50, 80]  # % of max mass
DELAY_IF_UNREACHABLE = 30*60  # 30 min
LAST_API_CALL_TIMESTAMP = None
API_CALL_THROTTLE_DELAY_IN_SEC = 0.3

# disable warning message when using verify=False
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


@shared_task(bind=True)
def update_with_4me(self, force=False, verbose=False):
    if config.API_PERF_URL is None or config.API_STATUS_URL is None:
        raise ValueError('API_PERF_URL or API_STATUS_URL is not set')
    session = make_session()
    sha = check_status(session)
    if sha is None:
        if verbose:
            print("will retry later")
        raise self.retry(
            countdown=DELAY_IF_UNREACHABLE, max_retries=5)
    if not force and sha == get_last_version_in_db():
        return "Data is already up to date."
    update_aircraft_list(sha, session, verbose)
    for ref in ReferenceAircraftType.objects.all():
        try:
            update_static(ref, session, verbose)
            update_rocd(ref, session, verbose)
            ref.version = sha
            ref.save()
        except Exception as e:
            print("ERROR : {}".format(e))
    return "OK"


def get_last_version_in_db():
    try:
        return ReferenceAircraftType.objects.order_by('-last_update').first().version
    except Exception as e:
        print(e)
        pass


def api_call_hook(response, *args, **kwargs):
    global LAST_API_CALL_TIMESTAMP
    LAST_API_CALL_TIMESTAMP = timezone.now()
    response.raise_for_status()


def throttle_call():
    # API has a rate limiter so we need to throttle calls
    global LAST_API_CALL_TIMESTAMP
    if LAST_API_CALL_TIMESTAMP is not None:
        delay = API_CALL_THROTTLE_DELAY_IN_SEC - \
            (timezone.now() - LAST_API_CALL_TIMESTAMP).total_seconds()
        if delay > 0:
            time.sleep(delay)


def make_session():
    session = requests.session()
    session.auth = (config.API_USERNAME, config.API_PASSWORD)
    session.proxies = urllib.request.getproxies()
    session.hooks = {
        'response': api_call_hook
    }
    return session


def check_status(session):
    throttle_call()
    r = session.get(config.API_STATUS_URL, verify=False)
    if r.json()['status'] == 'OK':
        return r.json()['sha']


def update_aircraft_list(version, session, verbose=False):
    throttle_call()
    r = session.get(AIRCRAFT_LIST_PATTERN.format(
        root_url=config.API_PERF_URL), verify=False)
    references = []
    for a in r.json():
        parse_aircraft(a, version, verbose)
    return references


def update_static(ref, session, verbose=False):
    throttle_call()
    r = session.get(STATIC_DATA_PATTERN.format(
        root_url=config.API_PERF_URL, icao_code=ref.code), verify=False)
    parse_reference(r.json(), ref, verbose)


def update_rocd(ref, session, verbose=False):
    results = []
    for mass in MASS_HYPOTHESES_FOR_ROCD:
        throttle_call()
        r = session.get(DYNAMIC_DATA_PATTERN.format(
            root_url=config.API_PERF_URL, icao_code=ref.code, mass=mass), verify=False)
        results.append(r.json())
    parse_rocd(results, ref, verbose)
