//Bounds from Tile
//Given a zoom, x, and y for a map tile, returns the tile's bounding box in WGS84
//Javascript implementation of code found at http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection/
//Reminder: this code puts the origin at the top left, not the bottom left

//input object is the z/x/y notation for a map tile

const mapboxToken =
  "pk.eyJ1IjoicnlhbmpkdWZmeSIsImEiOiJja2V5Z2s3a3IwMXFtMnJsZXNkZWJua2NlIn0.XTbixJu__DE2mzV15eH5sg";

function boundsFromTile(z, x, y) {
  const bounds = tileBounds(z, x, y);
  const mins = metersToLatLng(bounds[0]);
  const maxs = metersToLatLng(bounds[1]);

  return {
    minLat: mins[1],
    maxLat: maxs[1],
    minLng: mins[0],
    maxLng: maxs[0],
  };
}

function metersToLatLng(coord) {
  const lng = (coord[0] / ((2 * Math.PI * 6378137) / 2.0)) * 180.0;

  let lat = (coord[1] / ((2 * Math.PI * 6378137) / 2.0)) * 180.0;
  lat =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((lat * Math.PI) / 180.0)) - Math.PI / 2.0);

  return [lng, lat];
}

function tileBounds(z, x, y) {
  const mins = pixelsToMeters(z, x * 256, (y + 1) * 256);
  const maxs = pixelsToMeters(z, (x + 1) * 256, y * 256);

  return [mins, maxs];
}

function pixelsToMeters(z, x, y) {
  const res = (2 * Math.PI * 6378137) / 256 / Math.pow(2, z);
  const mx = x * res - (2 * Math.PI * 6378137) / 2.0;
  let my = y * res - (2 * Math.PI * 6378137) / 2.0;
  my = -my;

  return [mx, my];
}

export { boundsFromTile, mapboxToken };
