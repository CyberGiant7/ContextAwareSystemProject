"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import {LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents} from "react-leaflet";
import {GeoJSON} from 'react-leaflet/GeoJSON'
import {useContext, useEffect, useState} from "react";
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
    zona_urbanistica
} from "@/lib/definitions";

import {leafletIcons} from "@/components/LeafletIcons";
import 'next-leaflet-cluster/lib/assets/MarkerCluster.css';
import 'next-leaflet-cluster/lib/assets/MarkerCluster.Default.css';
import L, {DivIcon, Icon} from 'leaflet';
import {getColorFromRank, numberToK, toTitleCase} from "@/lib/utils";
import {
    ImmobiliContext,
    SelectedImmobileContext,
    SelectedZoneContext,
    VisibleImmobiliContext
} from "@/components/HomepageComponent";
import {ButtonOnMapComponent} from "@/components/ButtonOnMapComponent";

import * as turf from "@turf/turf";
import MarkerClusterGroup from "next-leaflet-cluster";
import _distanceweight from "@turf/distance-weight";
import {pNormDistance} from "@turf/distance-weight";

export interface MapProps {
    width: string;
    height: string;
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
    const [Zoom, setZoom] = useState(8);
    const [map, setMap] = useState<L.Map>();
    const [visibleImmobiliMarkers, setVisibleImmobiliMarkers] = useState<immobile[]>([]);

    const [zoneGeoJson, setZoneGeoJson] = useState<any>(null);
    const [maxRank, setMaxRank] = useState<number>(0);

    let maxZoomLevelForMarkers = 16;

    const selectedZone = useContext(SelectedZoneContext);
    const immobili = useContext(ImmobiliContext);
    const [_, setVisibleImmobili] = useContext(VisibleImmobiliContext);
    const [selectedImmobile, setSelectedImmobile] = useContext(SelectedImmobileContext);

    useEffect(() => {
        updateVisibleMarkers();
    }, [map, immobili]);

    function renderImmobiliMarkers(data: immobile, key: string, icon: L.Icon, maxRank: number) {

        // let newIcon = new DivIcon({iconUrl: icon.options.iconUrl, iconSize: [30, 30]});
        // newIcon.options.html = `<div class="leaflet-div-icon2" style="background: #0d6efd"/>`;
        let newIcon = new Icon({iconUrl: icon.options.iconUrl, iconSize: [30, 30]});
        let newIcon2
        if (data.rank !== undefined) {
            const markerColor = getColorFromRank(data.rank, maxRank);
            newIcon2 = new DivIcon({
                className: 'custom-div-icon', // Add a custom class
                html: `<div style="background-color:${markerColor}; width:20px; height:20px; border-radius:50%; border: 2px solid white; position:inherit; left: -15px; top: -15px;" class="custom-div-icon"></div>`,
            });
        } else {

        }

        if (key == selectedImmobile) {
            let bigger_icon = new Icon({iconUrl: icon.options.iconUrl, iconSize: [60, 60]});
            let bigger_icon2;
            if (data.rank !== undefined) {
                const markerColor = getColorFromRank(data.rank, maxRank);
                bigger_icon2 = new DivIcon({
                    className: 'custom-div-icon', // Add a custom class
                    html: `<div style="background-color:${markerColor}; width:40px; height:40px; border-radius:50%; border: 2px solid white; position:inherit; left: -24px; top: -32px;" class="custom-div-icon"></div>`,
                });
            }
            return (
                <Marker position={[data.geo_point.coordinates[1], data.geo_point.coordinates[0]]}
                        key={key} icon={bigger_icon2 ? bigger_icon2 : bigger_icon}>
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
        return (
            <Marker position={[data.geo_point.coordinates[1], data.geo_point.coordinates[0]]}
                    key={key} icon={newIcon2 ? newIcon2 : newIcon} riseOnHover={true}
                    eventHandlers={{
                        mouseover: (event) => setSelectedImmobile(key),
                    }}>
            </Marker>
        );
    }

    function renderMarker(data: Record<string, any>, key: any, icon: L.Icon) {
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
                // console.log(zoom);
            },
        });
        return false;
    };

    const updateVisibleMarkers = () => {
        if (!map) return;
        const bounds = map.getBounds();
        const newMarkers: immobile[] = [];
        for (let immobile of immobili) {
            // console.log(immobile)
            let point: L.LatLngExpression = [immobile.geo_point.coordinates[1], immobile.geo_point.coordinates[0]]
            if (bounds.contains(point)) {
                newMarkers.push(immobile);
            }
        }
        // console.log(
        //     '!!! map bounds:',
        //     map.getBounds(),
        //     ' visible markers: ',
        //     newMarkers
        // );
        setVisibleImmobiliMarkers(newMarkers);
        setVisibleImmobili(newMarkers);
    };

    useEffect(() => {
        getAllZone().then((zone) => {
            console.log("selected in map", selectedZone)
            if (selectedZone.length == 0) {
                setZoneUrbanistiche(zone)
            } else {
                setZoneUrbanistiche(zone.filter(z => selectedZone.includes(z.zona_di_prossimita)))
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

    useEffect(() => {
        setZoneGeoJson(zoneUrbanistiche.map(renderZone));
    }, [selectedZone, zoneUrbanistiche]);

    useEffect(() => {
        setMaxRank(Math.max(...immobili.map(i => i.rank ? i.rank : 0)));
        console.log(maxRank);
        getMoransI();
    }, [immobili]);


    // const getClusterColors = (number_of_cluster:number) => {
    //     // generate random color
    //     let colors = [];
    //     for (var i = 0; i < number_of_cluster; i++) {
    //         colors.push(`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
    //     }
    //     return colors;
    // }
    //
    // const getCluster = () => {
    //     const numberOfClusters = 2;
    //     var clustered = turf.clustersKmeans(turf.featureCollection(immobili.map(i => turf.point(i.geo_point.coordinates))), {numberOfClusters: numberOfClusters});
    //     console.log(clustered);
    //     const colors = getClusterColors(numberOfClusters);
    //     // console.log(colors);
    //     return clustered.features.map((feature, index) => {
    //         return (
    //             <Marker key={index} position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
    //                     icon={new DivIcon({
    //                         className: 'custom-div-icon', // Add a custom class
    //                         html: `<div style="background-color:${colors[feature.properties.cluster ? feature.properties.cluster : 0]}; width:20px; height:20px; border-radius:50%; border: 2px solid white; position:inherit; left: -15px; top: -15px;" class="custom-div-icon"></div>`,
    //                     })}>
    //                 <Popup>
    //                     <div>
    //                         <h5>Cluster {feature.properties.cluster}</h5>
    //                         <p>
    //                             <strong>Numero di immobili: </strong> {clustered.features.length} <br/>
    //                         </p>
    //                     </div>
    //                 </Popup>
    //             </Marker>
    //         )
    //     }, []);
    // }

    // moran's I
    const getMoransI = () => {
        // calculate the spatial weight matrix
        const immobili_points = immobili.map(i => turf.point(i.geo_point.coordinates, {...i}));
        // console.log(immobili_points);
        const immobili_fc = turf.featureCollection(immobili_points);

        // const weight = turf.distanceWeight(immobili_fc, {
        //     alpha: -1,
        //     binary: false,
        //     p: 2,
        //     standardization: false,
        //     threshold: turf.lengthToDegrees(1000, 'meters'),
        // });
        // const weight2 = turf.distanceWeight(immobili_fc, {
        //     alpha: -1,
        //     binary: false,
        //     p: 2,
        //     standardization: false,
        //     threshold: turf.lengthToDegrees(500, 'meters'),
        // });

        //check if weight matrix are different
        // for (let i = 0; i < weight.length; i++) {
        //     for (let j = 0; j < weight[i].length; j++) {
        //         if (weight[i][j] !== weight2[i][j]) {
        //             console.log("different" + i + " " + j);
        //         }
        //     }
        // }
        // // Create a distance matrix between each point using pNormDistance
        // let distanceMatrix = [];
        // for (let i = 0; i < immobili_fc.features.length; i++) {
        //     let row = [];
        //     for (let j = 0; j < immobili_fc.features.length; j++) {
        //         row.push(turf.radiansToLength(turf.degreesToRadians(pNormDistance(immobili_fc.features[i], immobili_fc.features[j], 2)),"meters"));
        //     }
        //     distanceMatrix.push(row);
        // }
        // console.log(distanceMatrix);


        console.log(immobili_fc);
        const index = turf.moranIndex(immobili_fc, {
            inputField: "prezzo",
            threshold: turf.lengthToDegrees(1000, 'meters')
        });
        console.log("100m in degree:"+turf.lengthToDegrees(1000, 'meters'))
        console.log(index);

        const index2 = turf.moranIndex(immobili_fc, {
            inputField: "prezzo",
            threshold: turf.lengthToDegrees(10000, 'meters')
        });
        console.log("10000m in degree:"+turf.lengthToDegrees(10000, 'meters'))
        console.log(index2);
    }


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
            {/*show cluster marker colored based on cluster*/}
            {/*{getCluster()}*/}
            {Zoom <= 13 ?
                <MarkerClusterGroup showCoverageOnHover={false} maxClusterRadius={20}>
                    {visibleImmobiliMarkers.map(value => renderImmobiliMarkers(value, value.civ_key, leafletIcons.HomeIcon, maxRank))}
                </MarkerClusterGroup> :
                visibleImmobiliMarkers.map(value => renderImmobiliMarkers(value, value.civ_key, leafletIcons.HomeIcon, maxRank))
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
            </LayersControl>
        </MapContainer>
    );
}