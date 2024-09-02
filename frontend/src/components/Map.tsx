"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import {LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {GeoJSON} from 'react-leaflet/GeoJSON'
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {getAllZone} from "@/queries/zone";
import {getAllImmobiliInZone} from "@/queries/immobili";
import {getAllBarRistoranti} from "@/queries/bar_ristoranti";
import {getAllBiblioteche} from "@/queries/biblioteche";
import {getAllFarmacie} from "@/queries/farmacie";
import {getAllFermateAutobus} from "@/queries/fermate_autobus";
import {getAllPalestre} from "@/queries/palestre";
import {getAllParcheggi} from "@/queries/parcheggi";
import {getAllParchiEGiardini} from "@/queries/parchi_e_giardini";
import {getAllScuole} from "@/queries/scuole";
import {getAllStruttureSanitarie} from "@/queries/strutture_sanitarie";
import {getAllSupermercati} from "@/queries/supermercati";
import {
    bar_ristoranti,
    biblioteche,
    farmacie,
    fermate_autobus,
    immobile,
    palestre,
    parcheggi,
    parchi_e_giardini,
    scuole,
    strutture_sanitarie,
    supermercati,
    zona_urbanistica
} from "@/lib/definitions";

import {icons} from "@/components/Icons";
import MarkerClusterGroup from "next-leaflet-cluster";
import 'next-leaflet-cluster/lib/assets/MarkerCluster.css';
import 'next-leaflet-cluster/lib/assets/MarkerCluster.Default.css';
import L from 'leaflet';


export interface MapProps {
    width: string;
    height: string;
    immobili: immobile[];
    setVisibleImmobili: Dispatch<SetStateAction<immobile[]>>
    selectedZone: string[]
}

function renderZone(data: zona_urbanistica) {
    // infer the type of data.geo_shape
    return (
        <GeoJSON data={data.geo_shape} key={data.zona_di_prossimita} style={{
            weight: 2,
            opacity: 1,
            fillOpacity: 0.05
        }}>
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

function renderMarker(data: Record<string, any>, key: any, icon: L.Icon) {
    const {geo_point, ...properties} = data;

    return (
        <Marker position={[geo_point.coordinates[1], geo_point.coordinates[0]]}
                key={key} icon={icon}>
            <Popup>
                <div>
                    {Object.keys(properties).map((key: string) => {
                            if (properties[key]) {
                                return (
                                    <p key={key}>
                                        <strong>{(key.charAt(0).toUpperCase() + key.slice(1)).replace(/_/g, ' ')}: </strong> {properties[key].toString()}
                                    </p>
                                )
                            } else {
                                return null;
                            }
                        }
                    )}
                </div>
            </Popup>
        </Marker>
    );
}


export default function Map(prop: MapProps) {
    const [zoneUrbanistiche, setZoneUrbanistiche] = useState<zona_urbanistica[]>([]);
    const [barRistoranti, setBarRistoranti] = useState<bar_ristoranti[]>([]);
    const [biblioteche, setBiblioteche] = useState<biblioteche[]>([]);
    const [farmacie, setFarmacie] = useState<farmacie[]>([]);
    const [fermateAutobus, setFermateAutobus] = useState<fermate_autobus[]>([]);
    const [palestre, setPalestre] = useState<palestre[]>([]);
    const [parcheggi, setParcheggi] = useState<parcheggi[]>([]);
    const [parchiEGiardini, setParchiEGiardini] = useState<parchi_e_giardini[]>([]);
    const [scuole, setScuole] = useState<scuole[]>([]);
    const [struttureSanitarie, setStruttureSanitarie] = useState<strutture_sanitarie[]>([]);
    const [supermercati, setSupermercati] = useState<supermercati[]>([]);
    const [Zoom, setZoom] = useState(9);
    const [map, setMap] = useState<L.Map>();
    const [visibleImmobiliMarkers, setVisibleImmobiliMarkers] = useState<immobile[]>([]);

    let maxZoomLevelForMarkers = 16;

    useEffect(() => {
        updateVisibleMarkers();
    }, []);

    const MapEvents = () => {
        useMapEvents({
            dragend() { // drag event (when map is dragged)
                updateVisibleMarkers();
            },
            zoomend() { // zoom event (when zoom animation ended)
                updateVisibleMarkers();
                if (!map) return;
                const zoom = map.getZoom(); // get current Zoom of map
                setZoom(zoom);
                console.log(zoom);
            },
        });
        return false;
    };

    const updateVisibleMarkers = () => {
        if (!map) return;
        const bounds = map.getBounds();
        const newMarkers: immobile[] = [];
        for (let immobile of prop.immobili) {
            // console.log(immobile)
            let point: L.LatLngExpression = [immobile.geo_point.coordinates[1], immobile.geo_point.coordinates[0]]
            if (bounds.contains(point)) {
                newMarkers.push(immobile);
            }
        }
        console.log(
            '!!! map bounds:',
            map.getBounds(),
            ' visible markers: ',
            newMarkers
        );
        setVisibleImmobiliMarkers(newMarkers);
        prop.setVisibleImmobili(newMarkers);
    };

    useEffect(() => {
        getAllZone().then((zone) => {
            console.log("selected in map", prop.selectedZone)
            if (prop.selectedZone.length == 0) {
                setZoneUrbanistiche(zone)
            } else {
                setZoneUrbanistiche(zone.filter(z => prop.selectedZone.includes(z.zona_di_prossimita)))
            }

        }).catch(console.error);

        getAllBarRistoranti().then(setBarRistoranti).catch(console.error);
        getAllBiblioteche().then(setBiblioteche).catch(console.error);
        getAllFarmacie().then(setFarmacie).catch(console.error);
        getAllFermateAutobus().then(setFermateAutobus).catch(console.error);
        getAllPalestre().then(setPalestre).catch(console.error);
        getAllParcheggi().then(setParcheggi).catch(console.error);
        getAllParchiEGiardini().then(setParchiEGiardini).catch(console.error);
        getAllScuole().then(setScuole).catch(console.error);
        getAllStruttureSanitarie().then(setStruttureSanitarie).catch(console.error);
        getAllSupermercati().then(setSupermercati).catch(console.error);
    }, []);


    return (
        <MapContainer
            id={'map'}
            preferCanvas={true}
            center={[44.4934936536425, 11.335745752828108]}
            zoom={11}
            maxZoom={18}
            scrollWheelZoom={true}
            style={{width: prop.width}}
            ref={(map: L.Map) => {
                if (map) setMap(map)
            }}
        >
            <MapEvents/>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {zoneUrbanistiche.map(renderZone)}
            <MarkerClusterGroup showCoverageOnHover={false} maxClusterRadius={20}>
                {visibleImmobiliMarkers.map(value => renderMarker(value, value.civ_key, icons.HomeIcon))}
            </MarkerClusterGroup>
            <LayersControl position="topright">
                <LayersControl.Overlay name="Bar e Ristoranti">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? barRistoranti.map(value => renderMarker(value, value.codice, icons.RestaurantIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Biblioteche">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? biblioteche.map(value => renderMarker(value, value.codice, icons.LibraryIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Farmacie">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? farmacie.map(value => renderMarker(value, value.civ_key, icons.PharmacyIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Fermate Autobus">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? fermateAutobus.map(value => renderMarker(value, value.codice, icons.BusStopIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Palestre">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? palestre.map(value => renderMarker(value, value.codice, icons.GymIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Parcheggi">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? parcheggi.map(value => renderMarker(value, value.codice, icons.ParkingIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Parchi e Giardini">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? parchiEGiardini.map(value => renderMarker(value, value.codice, icons.ParkIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Scuole">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? scuole.map(value => renderMarker(value, value.civ_key, icons.SchoolIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Strutture sanitarie">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? struttureSanitarie.map(value => renderMarker(value, value.civ_key, icons.HospitalIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Supermercati">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? supermercati.map(value => renderMarker(value, value.codice, icons.SupermarketIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    );
}