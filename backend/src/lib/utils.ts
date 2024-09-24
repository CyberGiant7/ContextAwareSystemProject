import {geomFromGeoJSON} from "drizzle-postgis/functions";

export const strToGeometryPoint = (geoPoint: string) => {
    const geopoints = geoPoint.split(",").map(Number).reverse();
    return geomFromGeoJSON({"type": "Point", "coordinates": geopoints});
}