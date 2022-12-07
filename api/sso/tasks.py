from celery import shared_task
from constance import config

from .keycloak import get_openid_client
from .models import get_sso_config


def refresh_realm_config(sso_config):
    openid_client = get_openid_client()
    sso_config.well_known_oidc = openid_client.well_known()
    sso_config.public_key = "-----BEGIN PUBLIC KEY-----\n{}\n-----END PUBLIC KEY-----".format(
        openid_client.public_key())
    sso_config.save()


@shared_task
def refresh_keycloak():
    # refresh keycloak config and user permissions from keycloak server
    if config.KEYCLOAK_ENABLED:
        sso_config = get_sso_config()
        refresh_realm_config(sso_config)
        return "OK"
    else:
        return "Keycloak is disabled"
