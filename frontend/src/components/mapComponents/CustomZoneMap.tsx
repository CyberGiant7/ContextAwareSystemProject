"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {leafletIcons} from "@/lib/LeafletIcons";

import L from "leaflet";
import {GeoJSON} from "react-leaflet/GeoJSON";
import * as turf from "@turf/turf";
import {Feature, FeatureCollection} from "geojson";

interface MapProps {
    width: string
    height: string
    radius: number
    travelTime: number
    vehicle: string
    geojsonData: Feature | undefined
    setGeojsonData: React.Dispatch<React.SetStateAction<Feature | undefined>>
}


export default function Map(prop: MapProps) {
    const [currentZoom, setCurrentZoom] = useState(12);
    const [map, setMap] = useState<L.Map>();
    const [position, setPosition] = useState({lat: 44.4934936536425, lng: 11.335745752828108})
    const markerRef = useRef<L.Marker>(null)

    const geoJsonLayer = useRef<L.GeoJSON>(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    let coordinate = marker.getLatLng()
                    setPosition(coordinate)
                }
            },
        }),
        [],
    )


    useEffect(() => {
        if (!map) return;
        if (prop.vehicle === 'raggio') {
            prop.setGeojsonData(turf.circle([position.lng, position.lat], prop.radius, {steps: 64, units: "meters"}));
        } else {
            getIsochrones(position, prop.travelTime, prop.vehicle)
                .then((res) => prop.setGeojsonData(res?.features[0]))
                .catch(console.error);
        }
    }, [map, position, prop.radius, prop.travelTime, prop.vehicle])


    useEffect(() => {
        console.log(prop.geojsonData);
        if (geoJsonLayer.current) {
            if (prop.geojsonData) {
                geoJsonLayer.current.clearLayers().addData(prop.geojsonData);
            } else {
                geoJsonLayer.current.clearLayers();
            }
        }
    }, [prop.geojsonData]);


    const MapEvents = () => {
        useMapEvents({
            zoomend() { // zoom event (when zoom animation ended)
                if (!map) return;
                setCurrentZoom(map.getZoom());
            },

            click(e) {
                setPosition(e.latlng);
                if (markerRef.current) {
                    markerRef.current.setLatLng(e.latlng);
                }
            },
        });
        return false;
    };


    return (
        <>
            <MapContainer
                id={'map'}
                preferCanvas={true}
                center={[44.4934936536425, 11.335745752828108]}
                zoom={12}
                maxZoom={18}
                scrollWheelZoom={true}
                style={{width: prop.width, height: prop.height}}
                ref={(map: L.Map) => {
                    if (map) setMap(map)
                }}>
                <MapEvents/>
                <TileLayer
                    attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    draggable={true}
                    eventHandlers={eventHandlers}
                    position={position}
                    icon={leafletIcons.MarkerIcon}
                    ref={markerRef}>
                </Marker>
                {prop.geojsonData !== undefined ?
                    <GeoJSON data={prop.geojsonData} ref={geoJsonLayer}/> : null}
            </MapContainer>
        </>
    )
}

async function getIsochrones(position: { lat: number, lng: number }, travelTime: number, vehicle: string) : Promise<FeatureCollection | undefined> {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;
    try {
        const response = await fetch(
            `https://api.openrouteservice.org/v2/isochrones/${vehicle}`,  // Modifica "foot-walking" a seconda del mezzo
            {
                method: 'POST',
                headers: {
                    'authorization': apiKey as string,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                // Aggiungi i parametri URL
                body: JSON.stringify({
                    locations: [[position.lng, position.lat]],
                    range: [travelTime * 60],  // Converti il limite di tempo in secondi
                    range_type: 'time',
                    interval: travelTime * 60  // Intervallo di tempo per l'isochrone
                })

            }
        );
        return await response.json();
    } catch (error) {
        console.error('Errore nel calcolo dell\'isochrone:', error);
    }
}
