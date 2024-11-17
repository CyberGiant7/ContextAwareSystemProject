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
    // State to keep track of the map instance
    const [map, setMap] = useState<L.Map>();

    // State to keep track of the marker position
    const [position, setPosition] = useState({lat: 44.4934936536425, lng: 11.335745752828108})

    // Reference to the marker instance
    const markerRef = useRef<L.Marker>(null)

    // Reference to the GeoJSON layer
    const geoJsonLayer = useRef<L.GeoJSON>(null);

    // Memoized event handlers for the marker
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


    // Effect to update GeoJSON data based on the selected vehicle and position
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

    // Effect to update the GeoJSON layer when geojsonData changes
    useEffect(() => {
        console.log(prop.geojsonData);
        if (!geoJsonLayer.current) {
            return;
        }
        if (!prop.geojsonData) {
            geoJsonLayer.current.clearLayers();
            return;
        }
        geoJsonLayer.current.clearLayers().addData(prop.geojsonData);

    }, [prop.geojsonData]);


    // Component to handle map events
    const MapEvents = () => {
        useMapEvents({
            // Event handler for map click event
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

/**
 * Fetches isochrones based on the given position, travel time, and vehicle type.
 *
 * @param {Object} position - The latitude and longitude of the position.
 * @param {number} position.lat - The latitude of the position.
 * @param {number} position.lng - The longitude of the position.
 * @param {number} travelTime - The travel time in minutes.
 * @param {string} vehicle - The type of vehicle (e.g., car, bike).
 * @returns {Promise<FeatureCollection | undefined>} A promise that resolves to a FeatureCollection or undefined if an error occurs.
 */
async function getIsochrones(position: {
    lat: number,
    lng: number
}, travelTime: number, vehicle: string): Promise<FeatureCollection | undefined> {
    try {
        const response = await fetch(
            `api/isochrones`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    position: position,
                    vehicle: vehicle,
                    travelTime: travelTime
                })
            }
        );
        return await response.json();
    } catch (error) {
        console.error('Errore nel calcolo dell\'isochrone:', error);
    }
}