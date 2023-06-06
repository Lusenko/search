import * as L from 'leaflet';

export function getMarkerCoord(value: L.Marker): [string,string] {
  const coord = String(value.getLatLng()).split(',');

  const lat = coord[0].split('(');
  const lng = coord[1].split(')');

  return [lat[1], lng[0]];
}
