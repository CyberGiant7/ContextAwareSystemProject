// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import {MapContainer, TileLayer, Tooltip} from "react-leaflet";
import React from "react";
import {zona_urbanistica} from "@/lib/definitions";
import {GeoJSON} from "react-leaflet/GeoJSON";
import {getColorFromRank} from "@/lib/utils";

export interface MapProps {
    width: string
    zone: zona_urbanistica[]
    setZone: React.Dispatch<React.SetStateAction<zona_urbanistica[]>>
}

/**
 * Renders a GeoJSON zone on the map with a tooltip.
 *
 * @param {zona_urbanistica} data - The data for the zone to be rendered.
 * @returns {React.JSX.Element} The GeoJSON element with the specified style and tooltip.
 */
function renderZone(data: zona_urbanistica): React.JSX.Element {
    let fillOpacity = 0.7;
    let fillColor = 'grey';
    if (data.rank !== undefined) {
        fillColor = getColorFromRank(data.rank, 100);
    }
    return (
        <GeoJSON data={data.geo_shape} key={data.zona_di_prossimita}
                 style={{
                     weight: 2,
                     opacity: 1,
                     fillOpacity: fillOpacity,
                     fillColor: fillColor,
                     color: 'white'
                 }}>
            <Tooltip sticky>{data.zona_di_prossimita}<br/>Affinità: {(data.rank)?.toFixed(2)}%</Tooltip>
        </GeoJSON>
    )
}

/**
 * RecommendedZoneMap component renders a map with recommended zones.
 *
 * @param {MapProps} props - The properties for the map component.
 * @param {string} props.width - The width of the map.
 * @param {zona_urbanistica[]} props.zone - The array of zones to be displayed on the map.
 * @param {React.Dispatch<React.SetStateAction<zona_urbanistica[]>>} props.setZone - The function to update the zones.
 * @returns {React.JSX.Element} The map component with the recommended zones.
 */
export default function RecommendedZoneMap(props: MapProps): React.JSX.Element {
    return (
        <MapContainer
            id={'map'}
            preferCanvas={true}
            center={[44.4934936536425, 11.335745752828108]}
            zoom={12}
            maxZoom={18}
            scrollWheelZoom={true}
            style={{width: props.width}}>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.zone.map(renderZone)}
        </MapContainer>
    );
}
