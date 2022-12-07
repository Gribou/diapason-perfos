from aircrafts.models import AircraftType, ReferenceAircraftType, WAKE_CAT, FlightPhaseEnvelop


def parse_aircraft(data, version, verbose=False):
    code = data['icaoId']
    if code is not None:
        reference, _ = ReferenceAircraftType.objects.get_or_create(
            code=data['synonym'])
        aircraft, _ = AircraftType.objects.get_or_create(
            code=code, defaults={'reference': reference})
        aircraft.reference = reference
        aircraft.manufacturer = data['manufacturer']
        aircraft.fullname = data['model']
        aircraft.version = version
        aircraft.save()
        if verbose:
            print("Aircraft {} updated".format(code))


def parse_reference(data, ref, verbose=False):
    if data['found']['icaoId'] != ref.code:
        print("{} is not a reference aircraft".format(ref.code))
        # TODO raise exception ??
        return
    static = data['staticData']
    ref.engine_type = _parse_engine_type(
        static['acftType']['enginesType'])
    ref.number_of_engines = static['acftType']['enginesCount']
    ref.wing_span = static['ground']['wingSpan']
    ref.length = static['ground']['length']
    ref.wake_cat = _parse_wake_cat(static['acftType']['wake'])
    ref.landing_length = static['ground']['landingLength']
    ref.max_mass = static['mass']['maximum'] * 1000
    ref.max_operating_altitude = static['flightEnvelope']['maxAlt']
    ref.mmo = static['flightEnvelope']['mmo']
    ref.vmo = static['flightEnvelope']['vmo']
    ref.save()
    ref.phases.all().delete()
    _parse_static_flight_phase(
        static['procedures']['climb'], ref, 'CLIMB', verbose)
    _parse_static_flight_phase(
        static['procedures']['cruise'], ref, 'CRUISE', verbose)
    _parse_static_flight_phase(
        static['procedures']['descent'], ref, 'DESCENT', verbose)
    if verbose:
        print("Reference aircraft {} updated".format(ref.code))


def _parse_engine_type(engine_type):
    return engine_type.upper()


def _parse_wake_cat(wake_cat):
    for w, _ in WAKE_CAT:
        if w[0] == wake_cat:
            return w
    if wake_cat == 'J':
        return 'SUPER'


def _get_speeds_key_for_phase(altitude):
    return {
        "LOW": "lowAlt", "MEDIUM": "highAlt", "HIGH": "highAlt"
    }[altitude]


def _parse_static_flight_phase(data, reference, phase, verbose=False):
    for alt in ['LOW', 'MEDIUM', 'HIGH']:
        p = FlightPhaseEnvelop(
            aircraft=reference, phase=phase, altitude_range=alt)
        key = _get_speeds_key_for_phase(alt)
        if alt == "HIGH":
            mach = [m[key]['mach'] for m in data.values()]
            p.min_mach = min(mach)
            p.max_mach = max(mach)
        else:
            speeds = [m[key]['cas'] for m in data.values()]
            p.min_speed = min(speeds)
            p.max_speed = max(speeds)
        p.save()


def parse_rocd(data, ref, verbose=False):
    if data[0]['found']['icaoId'] != ref.code:
        print("{} is not a reference aircraft".format(ref.code))
        # TODO raise exception ??
        return
    ref.transition_altitude = data[0]['dynamicData'][0]['transitionAltitude']
    ref.save()
    # get fresh phases as then could have been changed in update_static
    ref.refresh_from_db()
    # CAS climb
    medium_climb = ref.phases.filter(
        phase='CLIMB', altitude_range="MEDIUM").first()
    if medium_climb:
        _parse_roc_for_phase(medium_climb, _get_roc_below_transition(data))
    # Mach climb
    high_climb = ref.phases.filter(
        phase='CLIMB', altitude_range="HIGH").first()

    if high_climb:
        _parse_roc_for_phase(high_climb, _get_roc_above_transition(data))


def _get_roc_below_transition(data):
    # reduced rate of climb until 80% of ceiling then max rate of climb
    return [
        d['reducedRateOfClimb'] if d['fl'] * 100 <= 0.8 *
        d['maxAltitude'] else d['maxRateOfClimb']
        for mass_data in data for d in mass_data['dynamicData']
        if d['fl'] * 100 < d['transitionAltitude']]


def _get_roc_above_transition(data):
    # reduced rate of climb until 80% of ceiling then max rate of climb
    return [
        d['reducedRateOfClimb'] if d['fl'] * 100 <= 0.8 *
        d['maxAltitude'] else d['maxRateOfClimb']
        for mass_data in data for d in mass_data['dynamicData']
        if d['fl'] * 100 >= d['transitionAltitude']]


def _parse_roc_for_phase(phase, results):
    phase.min_rocd = min(results, default=0)
    phase.max_rocd = max(results, default=0)
    phase.save()
