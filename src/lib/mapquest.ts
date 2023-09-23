export function getDirections(
  from: string,
  to: string,
): Promise<DirectionResponse> {
  const url = new URL("https://www.mapquestapi.com/directions/v2/route");
  const options = {
    key: process.env.MAPQUEST_KEY,
    from,
    to,
    outFormat: "json",
    ambiguities: "ignore",
    routeType: "fastest",
    doReverseGeocode: "false",
    enhancedNarrative: "false",
    avoidTimedConditions: "false",
  };
  Object.entries(options).forEach(([key, value]) => {
    if (!value) return;
    url.searchParams.append(key, value);
  });
  return fetch(url, {
    cache: "force-cache",
  }).then((res) => res.json());
}

interface DirectionResponse {
  route: Route;
  info: Info;
}

interface Info {
  statuscode: number;
  copyright: Copyright;
  messages: any[];
}

interface Copyright {
  text: string;
  imageUrl: string;
  imageAltText: string;
}

interface Route {
  sessionId: string;
  realTime: number;
  distance: number;
  time: number;
  formattedTime: string;
  hasHighway: boolean;
  hasTollRoad: boolean;
  hasBridge: boolean;
  hasSeasonalClosure: boolean;
  hasTunnel: boolean;
  hasFerry: boolean;
  hasUnpaved: boolean;
  hasTimedRestriction: boolean;
  hasCountryCross: boolean;
  legs: Leg[];
  options: Options;
  boundingBox: BoundingBox;
  name: string;
  maxRoutes: string;
  locations: Location[];
  locationSequence: number[];
}

interface BoundingBox {
  ul: Lr;
  lr: Lr;
}

interface Lr {
  lat: number;
  lng: number;
}

interface Leg {
  index: number;
  hasTollRoad: boolean;
  hasHighway: boolean;
  hasBridge: boolean;
  hasUnpaved: boolean;
  hasTunnel: boolean;
  hasSeasonalClosure: boolean;
  hasFerry: boolean;
  hasCountryCross: boolean;
  hasTimedRestriction: boolean;
  distance: number;
  time: number;
  formattedTime: string;
  origIndex: number;
  origNarrative: string;
  destIndex: number;
  destNarrative: string;
  maneuvers: Maneuver[];
}

interface Maneuver {
  index: number;
  distance: number;
  narrative: string;
  time: number;
  direction: number;
  directionName: string;
  signs: any[];
  maneuverNotes: any[];
  formattedTime: string;
  transportMode: TransportMode;
  startPoint: Lr;
  turnType: number;
  attributes: number;
  iconUrl: string;
  streets: string[];
  mapUrl?: string;
}

export enum TransportMode {
  Car = "car",
}

interface Location {
  street: string;
  adminArea6: string;
  adminArea6Type: string;
  adminArea5: string;
  adminArea5Type: string;
  adminArea4: string;
  adminArea4Type: string;
  adminArea3: string;
  adminArea3Type: string;
  adminArea1: string;
  adminArea1Type: string;
  postalCode: string;
  geocodeQualityCode: string;
  geocodeQuality: string;
  dragPoint: boolean;
  sideOfStreet: string;
  linkId: string;
  unknownInput: string;
  type: string;
  latLng: Lr;
  displayLatLng: Lr;
  mapUrl: string;
}

interface Options {
  routeType: string;
  enhancedNarrative: boolean;
  doReverseGeocode: boolean;
  narrativeType: string;
  walkingSpeed: number;
  highwayEfficiency: number;
  avoids: boolean;
  generalize: number;
  shapeFormat: string;
  unit: string;
  locale: string;
  useTraffic: boolean;
  timeType: number;
  dateType: number;
  manMaps: boolean;
  sideOfStreetDisplay: boolean;
}
