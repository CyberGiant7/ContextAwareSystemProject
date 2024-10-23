// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import L from 'leaflet';
import {MapContainer, Popup, TileLayer, Tooltip} from "react-leaflet";
import React, {useEffect, useState} from "react";
import {zona_urbanistica} from "@/lib/definitions";
import {getAllZone} from "@/queries/zone";
import {GeoJSON} from "react-leaflet/GeoJSON";
import {getColorFromRank} from "@/lib/utils";

export interface MapProps {
    width: string
    zone: zona_urbanistica[]
    setZone: React.Dispatch<React.SetStateAction<zona_urbanistica[]>>
}

function renderZone(data: zona_urbanistica) {
    let fillOpacity = 0.7;
    let fillColor = 'grey';
    if (data.rank !== undefined) {
        fillColor = getColorFromRank(data.rank, 100);
    }
    return (
        <GeoJSON data={data.geo_shape} key={data.zona_di_prossimita}
            // eventHandlers={zonaEventHandlers(data)}
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

export default function RecommendedZoneMap(props: MapProps) {
    const [map, setMap] = useState<L.Map>();


    return (
        <MapContainer
            id={'map'}
            preferCanvas={true}
            center={[44.4934936536425, 11.335745752828108]}
            zoom={12}
            maxZoom={18}
            scrollWheelZoom={true}
            style={{width: props.width}}
            ref={(map: L.Map) => {
                if (map) setMap(map)
            }}>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.zone.map(renderZone)}
        </MapContainer>
    );
}
