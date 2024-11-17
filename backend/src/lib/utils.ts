import {geomFromGeoJSON} from "drizzle-postgis/functions";

/**
 * Converts a string representation of a geographic point to a geometry point.
 *
 * @param {string} geoPoint - The geographic point as a string in the format "latitude,longitude".
 * @returns {object} The geometry point object.
 */
export const strToGeometryPoint = (geoPoint: string) => {
    const geopoints = geoPoint.split(",").map(Number).reverse();
    return geomFromGeoJSON({"type": "Point", "coordinates": geopoints});
}