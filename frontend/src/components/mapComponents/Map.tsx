"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import {LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents} from "react-leaflet";
import {GeoJSON} from 'react-leaflet/GeoJSON'
import React, {useContext, useEffect, useState} from "react";
import {getAllZone} from "@/queries/zone";
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
    teatri_cinema,
    zona_urbanistica
} from "@/lib/definitions";

import {leafletIcons} from "@/lib/LeafletIcons";
import 'next-leaflet-cluster/lib/assets/MarkerCluster.css';
import 'next-leaflet-cluster/lib/assets/MarkerCluster.Default.css';
import L, {DivIcon, Icon} from 'leaflet';
import {getColorFromRank, numberToK, toTitleCase} from "@/lib/utils";
import {ButtonOnMapComponent} from "@/components/ButtonOnMapComponent";
import {
    ImmobiliContext,
    SelectedImmobileContext,
    SelectedZoneContext,
    VisibleImmobiliContext
} from "@/components/wrapper/DataWrapper";
import MarkerClusterGroup from "next-leaflet-cluster";
import {getAllTeatriCinema} from "@/queries/teatri_cinema";
import {Feature, Polygon} from "geojson";
import * as turf from "@turf/turf";


export interface MapProps {
    width: string;
    height: string;
    geojsonData: Feature | undefined;
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


export default function Map(prop: MapProps) {
    // State variables to store various Point of interests
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
    const [teatriCinema, setTeatriCinema] = useState<teatri_cinema[]>([]);

    // State variables for map properties
    const [Zoom, setZoom] = useState(8);
    const [map, setMap] = useState<L.Map>();
    const [visibleImmobiliMarkers, setVisibleImmobiliMarkers] = useState<immobile[]>([]);

    // State variable for GeoJSON data
    const [zoneGeoJson, setZoneGeoJson] = useState<any>(null);

    // Maximum zoom level for displaying markers
    const maxZoomLevelForMarkers = 16;

    // Context variables for selected zone and immobili (real estate properties)
    const selectedZone = useContext(SelectedZoneContext);
    const [immobili, setImmobili] = useContext(ImmobiliContext);
    const [, setVisibleImmobili] = useContext(VisibleImmobiliContext);
    const [selectedImmobile, setSelectedImmobile] = useContext(SelectedImmobileContext);

    useEffect(() => {
        updateVisibleMarkers();
    }, [map, immobili]);


    /**
     * Renders markers for immobili (real estate properties) on the map.
     *
     * @param {immobile} data - The data for the immobile, including geo_point and other properties.
     * @param {string} key - The unique key for the marker.
     * @param {L.Icon} icon - The icon to be used for the marker.
     * @param {number} maxRank - The maximum rank value for determining marker color.
     * @returns {React.JSX.Element} The Marker component with a Popup and Tooltip displaying the properties.
     */
    function renderImmobiliMarkers(data: immobile, key: string, icon: L.Icon, maxRank: number): React.JSX.Element {
        // Create a new icon for the marker
        let newIcon: Icon | DivIcon = new Icon({iconUrl: icon.options.iconUrl, iconSize: [30, 30]});

        // If the data has a rank, create a custom DivIcon with a colored background
        if (data.rank !== undefined) {
            const markerColor = getColorFromRank(data.rank, maxRank);
            newIcon = new DivIcon({
                className: 'custom-div-icon', // Add a custom class
                html: `<div style="background-color:${markerColor}; width:20px; height:20px; border-radius:50%; border: 2px solid white; position:inherit; left: -4px; top: -4px;" class="custom-div-icon"></div>`,
            });
        }

        // If the immobile is not selected, return a Marker component
        if (key != selectedImmobile) {
            return (
                <Marker position={[data.geo_point.coordinates[1], data.geo_point.coordinates[0]]}
                        key={key} icon={newIcon} riseOnHover={true}
                        eventHandlers={{
                            mouseover: () => setSelectedImmobile(key),
                        }}>
                </Marker>
            );
        }

        // If the immobile is selected, return a Marker component with a Popup and Tooltip
        let bigger_icon: Icon | DivIcon = new Icon({iconUrl: icon.options.iconUrl, iconSize: [60, 60]});

        // If the data has a rank, create a custom DivIcon with a colored background
        if (data.rank !== undefined) {
            const markerColor = getColorFromRank(data.rank, maxRank);
            bigger_icon = new DivIcon({
                className: 'custom-div-icon', // Add a custom class
                html: `<div style="background-color:${markerColor}; width:40px; height:40px; border-radius:50%; border: 2px solid white; position:inherit; left: -15px; top: -15px;" class="custom-div-icon"></div>`,
            });
        }

        // Return a Marker component with a Popup and Tooltip for the selected immobile
        return (
            <Marker position={[data.geo_point.coordinates[1], data.geo_point.coordinates[0]]}
                    key={key} icon={bigger_icon}>
                <Popup>
                    <div>
                        <h5>{data.indirizzo}</h5>
                        <p>
                            <strong>Prezzo: </strong> € {numberToK(data.prezzo)}<br/>
                            <strong>Superficie: </strong> {data.superficie} m<sup>2</sup><br/>
                            {data.rank ? <><strong>Rank: </strong> {data.rank}</> : null}
                        </p>
                    </div>
                </Popup>
                <Tooltip direction="top">€ {numberToK(data.prezzo)} </Tooltip>
            </Marker>
        );
    }

    /**
     * Renders a marker on the map.
     *
     * @param {Record<string, any>} data - The data for the marker, including geo_point and other properties.
     * @param {any} key - The unique key for the marker.
     * @param {L.Icon} icon - The icon to be used for the marker.
     * @returns {React.JSX.Element} The Marker component with a Popup displaying the properties.
     */
    function renderMarker(data: Record<string, any>, key: any, icon: L.Icon): React.JSX.Element {
        const {geo_point, ...properties} = data;

        return (
            <Marker position={[geo_point.coordinates[1], geo_point.coordinates[0]]}
                    key={key} icon={icon} riseOnHover={true}
                    eventHandlers={{
                        mouseover: (event) => setSelectedImmobile(key),
                    }}>
                <Popup>
                    <div>
                        {Object.keys(properties).map((key: string) => {
                                if (properties[key]) {
                                    return (
                                        <p key={key}>
                                            <strong>{(toTitleCase(key)).replace(/_/g, ' ')}: </strong> {properties[key].toString()}
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

    // Component to handle map events.
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
            },
        });
        return false;
    };

    /**
     * Updates the visible markers on the map based on the current map bounds.
     * Filters the immobili (real estate properties) to include only those within the map bounds.
     * Updates the state variables for visible immobili markers and visible immobili.
     */
    const updateVisibleMarkers = () => {
        if (!map) return;
        const bounds = map.getBounds();
        const newMarkers: immobile[] = [];
        for (let immobile of immobili) {
            let point: L.LatLngExpression = [immobile.geo_point.coordinates[1], immobile.geo_point.coordinates[0]];
            if (bounds.contains(point)) {
                newMarkers.push(immobile);
            }
        }
        setVisibleImmobiliMarkers(newMarkers);
        setVisibleImmobili(newMarkers);
    };

    useEffect(() => {

        // Fetches all zones and updates the state based on the selected zone.
        getAllZone().then((zone) => {
            console.log("zone selected in map", selectedZone)
            // if no zone is selected, set all zones
            if (selectedZone.length == 0) {
                setZoneUrbanistiche(zone)
            } else {  // filter zones based on selected zone
                setZoneUrbanistiche(zone.filter(z => selectedZone.includes(z.zona_di_prossimita)))
            }
        }).catch(console.error);

        /**
         * Fetches and sets the state for various points of interest (POIs).
         */
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
        getAllTeatriCinema().then(setTeatriCinema).catch(console.error);
    }, []);


    useEffect(() => {
        // Check if geojsonData is defined
        if (prop.geojsonData !== undefined) {
            // Set the GeoJSON data with specific styles
            setZoneGeoJson(<GeoJSON data={prop.geojsonData} style={{
                weight: 2,
                opacity: 1,
                fillOpacity: 0.05
            }}/>);
        } else {
            // Render zones if geojsonData is not defined
            setZoneGeoJson(zoneUrbanistiche.map(renderZone));
        }
    }, [prop.geojsonData, selectedZone, zoneUrbanistiche]);

    useEffect(() => {
        // Filter immobili based on selected geojsonData
        if (prop.geojsonData !== undefined) {
            const geojson = prop.geojsonData;
            const polygon = turf.polygon((geojson.geometry as Polygon).coordinates);

            // Filter immobili that are within the selected polygon
            const newImmobili = immobili.filter((immobile) => {
                const point = turf.point([immobile.geo_point.coordinates[0], immobile.geo_point.coordinates[1]]);
                return turf.booleanPointInPolygon(point, polygon);
            });

            console.log("new immobili", newImmobili);

            // Update immobili state if the filtered list is different
            if (newImmobili.length !== immobili.length)
                setImmobili(newImmobili);
        }
    }, [immobili, prop.geojsonData, setImmobili]);

    return (
        <MapContainer
            id={'map'}
            preferCanvas={true}
            center={[44.4934936536425, 11.335745752828108]}
            zoom={12}
            maxZoom={18}
            scrollWheelZoom={true}
            style={{width: prop.width}}
            ref={(map: L.Map) => {
                if (map) setMap(map)
            }}>
            <MapEvents/>
            <ButtonOnMapComponent position={"bottomcenter"}/>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {zoneGeoJson}
            {visibleImmobiliMarkers[0] && !Object.hasOwn(visibleImmobiliMarkers[0], 'rank') ?
                // If the first visible immobile marker does not have a rank, use MarkerClusterGroup
                <MarkerClusterGroup showCoverageOnHover={true} maxClusterRadius={20} disableClusteringAtZoom={15}>
                    {visibleImmobiliMarkers.map(value => renderImmobiliMarkers(value, value.civ_key, leafletIcons.HomeIcon, 100))}
                </MarkerClusterGroup> :
                // Otherwise, render the markers without clustering
                visibleImmobiliMarkers.map(value => renderImmobiliMarkers(value, value.civ_key, leafletIcons.HomeIcon, 100))
            }
            <LayersControl position="topright">
                <LayersControl.Overlay name="Bar e Ristoranti">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? barRistoranti.map(value => renderMarker(value, value.codice, leafletIcons.RestaurantIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Biblioteche">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? biblioteche.map(value => renderMarker(value, value.codice, leafletIcons.LibraryIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Farmacie">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? farmacie.map(value => renderMarker(value, value.civ_key, leafletIcons.PharmacyIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Fermate Autobus">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? fermateAutobus.map(value => renderMarker(value, value.codice, leafletIcons.BusStopIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Palestre">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? palestre.map(value => renderMarker(value, value.codice, leafletIcons.GymIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Parcheggi">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? parcheggi.map(value => renderMarker(value, value.codice, leafletIcons.ParkingIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Parchi e Giardini">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? parchiEGiardini.map(value => renderMarker(value, value.codice, leafletIcons.ParkIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Scuole">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? scuole.map(value => renderMarker(value, value.civ_key, leafletIcons.SchoolIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Strutture sanitarie">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? struttureSanitarie.map(value => renderMarker(value, value.civ_key, leafletIcons.HospitalIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Supermercati">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? supermercati.map(value => renderMarker(value, value.codice, leafletIcons.SupermarketIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Teatri e cinema">
                    <LayerGroup>
                        {Zoom >= maxZoomLevelForMarkers ? teatriCinema.map(value => renderMarker(value, value.civ_key, leafletIcons.CinemaIcon)) : null}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    );
}