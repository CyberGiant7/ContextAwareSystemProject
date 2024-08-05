"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {GeoJSON} from 'react-leaflet/GeoJSON'
import {useEffect, useState} from "react";
import {getAllZone} from "@/queries/zone";
import {getAllImmobili} from "@/queries/immobili";
import {immobile, zona_urbanistica} from "@/app/lib/definitions";
import {Icon} from "leaflet";
import MarkerClusterGroup from "next-leaflet-cluster";
import 'next-leaflet-cluster/lib/assets/MarkerCluster.css';
import 'next-leaflet-cluster/lib/assets/MarkerCluster.Default.css';


interface LazyMapProps {
    width: string;
    height: string;
}

const HomeIcon = new Icon({
    iconUrl: "/images/home_icon.svg",
    iconSize: [20, 20], // size of the icon
})

function renderZone(data: zona_urbanistica) {
    // infer the type of data.geo_shape
    return (
        <GeoJSON data={data.geo_shape} key={data.zona_di_prossimita}>
            <Popup>
                <div>
                    <h5>{data.zona_di_prossimita}</h5>
                    <p>
                        <strong>Quartiere: </strong> {data.nome_quartiere}<br/>
                        <strong>Area: </strong> {data.area.toFixed(2)} km<sup>2</sup>
                    </p>
                </div>
            </Popup>
        </GeoJSON>
    )
}

function renderImmobile(immobile: immobile) {
    return (
        // <GeoJSON data={immobile.geo_point} key={immobile.civ_key} >
        <Marker position={[immobile.geo_point.coordinates[1], immobile.geo_point.coordinates[0]]} key={immobile.civ_key}
                icon={HomeIcon}>
            <Popup>
                <div>
                    <h5>{immobile.indirizzo}</h5>
                    <p>
                        <strong>Quartiere: </strong> {immobile.quartiere}<br/>
                        <strong>Zona di prossimità: </strong> {immobile.zona_di_prossimita}<br/>
                        <strong>Superficie: </strong> {immobile.superficie} m<sup>2</sup><br/>
                        <strong>Piano: </strong> {immobile.piano}<br/>
                        <strong>Ascensore: </strong> {immobile.ascensore ? 'Si' : 'No'}<br/>
                        <strong>Stato immobile: </strong> {immobile.stato_immobile}<br/>
                        <strong>Stato finiture esterne: </strong> {immobile.stato_finiture_esterne}<br/>
                        <strong>Età costruzione: </strong> {immobile.eta_costruzione}<br/>
                        <strong>Classe energetica: </strong> {immobile.classe_energetica}<br/>
                        <strong>Prezzo: </strong> {immobile.prezzo} €
                    </p>
                </div>
            </Popup>

        </Marker>
        // </GeoJSON>
    )
}

export default function Map(prop: LazyMapProps) {
    const [data, setData] = useState<zona_urbanistica[]>([]);
    const [immobili, setImmobili] = useState<immobile[]>([]);
    let loaded = false;
    useEffect(() => {
        getAllZone().then((data) => {
            setData(data);
            console.log(data);
        }).catch(console.error);
        if (data && immobili && !loaded) {
            loaded = true;
        }
    }, [loaded]);

    useEffect(() => {
        getAllImmobili().then((immobili) => {
            setImmobili(immobili);
            console.log(immobili);
        }).catch(console.error);
        if (data && immobili && !loaded) {
            loaded = true;
        }
    }, [loaded]);

    return (
        <MapContainer
            preferCanvas={true}
            center={[44.4934936536425, 11.335745752828108]}
            zoom={11}
            scrollWheelZoom={true}
            maxZoom={25}
            style={{width: prop.width, height: prop.height}}>
            {data.map((zone) => renderZone(zone))}
            <MarkerClusterGroup >
                {immobili.map((immobile) => renderImmobile(immobile))}
            </MarkerClusterGroup>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}
