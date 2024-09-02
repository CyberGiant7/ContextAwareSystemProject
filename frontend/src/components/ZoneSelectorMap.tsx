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

export interface MapProps {
    width: string
    selectedZoneUrbanistiche: Record<string, boolean>
    setSelectedZoneUrbanistiche: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}


export default function ZoneSelectorMap(props: MapProps) {
    const [map, setMap] = useState<L.Map>();
    const [zoneUrbanistiche, setZoneUrbanistiche] = useState<zona_urbanistica[]>([]);

    useEffect(() => {
        getAllZone().then(setZoneUrbanistiche).catch(console.error);
    }, []);

    useEffect(() => {
        // set all fillOpacity to 0 for all geojson zone
        zoneUrbanistiche.forEach(zone => {
                if (map) {
                    map.eachLayer(layer => {
                            if (layer instanceof L.GeoJSON) {
                                layer.setStyle({
                                    fillOpacity: 0
                                });
                                if (layer.options.style) {
                                    layer.options.style = {
                                        ...layer.options.style,
                                        fillOpacity: 0
                                    }
                                }
                            }
                        }
                    );
                }
            }
        );

        // create a map of selected zones with default value false
        const initialSelectedZones = zoneUrbanistiche.reduce((acc, zone) => {
            acc[zone.zona_di_prossimita] = false;
            return acc;
        }, {} as Record<string, boolean>);
        props.setSelectedZoneUrbanistiche(initialSelectedZones);
    }, [zoneUrbanistiche]);

    function zonaEventHandlers(data: zona_urbanistica) {
        return {
            click: (e: L.LeafletMouseEvent) => {
                // log key
                console.log(data.zona_di_prossimita);
                console.log(!props.selectedZoneUrbanistiche[data.zona_di_prossimita]);
                e.target.options.style.fillOpacity = !props.selectedZoneUrbanistiche[data.zona_di_prossimita] ? 0.2 : 0

                props.setSelectedZoneUrbanistiche(prev => ({
                    ...prev,
                    [data.zona_di_prossimita]: !prev[data.zona_di_prossimita]
                }));

            },
            mouseover: (e: L.LeafletMouseEvent) => {
                // get the current fillOpacity and increase it by 0.2
                console.log(e.target.options.style.fillOpacity);
                console.log(e);
                e.target.setStyle({
                    fillOpacity: e.target.options.style.fillOpacity + 0.2
                });
                console.log(e.target.options.style.fillOpacity);
            },
            mouseout: (e: L.LeafletMouseEvent) => {
                console.log(e.target.options.style.fillOpacity);
                e.target.setStyle({
                    fillOpacity: e.target.options.style.fillOpacity
                });
            }
        }
    }

    useEffect(() => {
        console.log(props.selectedZoneUrbanistiche);
    }, [props.selectedZoneUrbanistiche]);


    function renderZone(data: zona_urbanistica) {
        // infer the type of data.geo_shape
        return (
            <GeoJSON data={data.geo_shape} key={data.zona_di_prossimita}
                     eventHandlers={zonaEventHandlers(data)}
                     style={{
                         weight: 2,
                         opacity: 1
                     }}>
                <Tooltip sticky>{data.zona_di_prossimita}</Tooltip>
            </GeoJSON>
        )
    }


    return (
        <MapContainer
            id={'map'}
            preferCanvas={true}
            center={[44.4934936536425, 11.335745752828108]}
            zoom={11}
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
            {zoneUrbanistiche.map(renderZone)}
        </MapContainer>
    );
}
