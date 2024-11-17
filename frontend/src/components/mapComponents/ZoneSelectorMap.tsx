// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import L from 'leaflet';
import {MapContainer, TileLayer, Tooltip} from "react-leaflet";
import React, {useEffect} from "react";
import {zona_urbanistica} from "@/lib/definitions";
import {GeoJSON} from "react-leaflet/GeoJSON";

export interface MapProps {
    width: string
    selectedZoneUrbanistiche: Record<string, boolean>
    setSelectedZoneUrbanistiche: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    zone: zona_urbanistica[]
    setZone: React.Dispatch<React.SetStateAction<zona_urbanistica[]>>
}


/**
 * ZoneSelectorMap component renders a map with selectable zones.
 *
 * @param {MapProps} props - The properties for the component.
 * @param {string} props.width - The width of the map.
 * @param {Record<string, boolean>} props.selectedZoneUrbanistiche - The selected zones.
 * @param {React.Dispatch<React.SetStateAction<Record<string, boolean>>>} props.setSelectedZoneUrbanistiche - Function to set selected zones.
 * @param {zona_urbanistica[]} props.zone - The list of zones.
 * @param {React.Dispatch<React.SetStateAction<zona_urbanistica[]>>} props.setZone - Function to set zones.
 * @returns {React.JSX.Element} The rendered map component.
 */
export default function ZoneSelectorMap(props: MapProps): React.JSX.Element {
    useEffect(() => {
        // create a map of selected zones with default value false
        const initialSelectedZones = props.zone.reduce((acc, zone) => {
            acc[zone.zona_di_prossimita] = false;
            return acc;
        }, {} as Record<string, boolean>);
        props.setSelectedZoneUrbanistiche(initialSelectedZones);
    }, [props.zone]);


    /**
     * Generates event handlers for a given zone.
     *
     * @param {zona_urbanistica} data - The zone data.
     * @returns {L.LeafletEventHandlerFnMap} The event handlers for the zone.
     */
    function zonaEventHandlers(data: zona_urbanistica): L.LeafletEventHandlerFnMap {
        return {
            // Event handler for click event
            click: (e: L.LeafletMouseEvent) => {
                // Toggle fillOpacity based on the selected state of the zone
                e.target.options.style.fillOpacity = !props.selectedZoneUrbanistiche[data.zona_di_prossimita] ? 0.2 : 0;
                // Update the selected state of the zone
                props.setSelectedZoneUrbanistiche(prev => ({
                    ...prev,
                    [data.zona_di_prossimita]: !prev[data.zona_di_prossimita]
                }));
            },
            // Event handler for mouseover event
            mouseover: (e: L.LeafletMouseEvent) => {
                // Increase the fillOpacity by 0.2
                e.target.setStyle({
                    fillOpacity: e.target.options.style.fillOpacity + 0.2
                });
            },
            // Event handler for mouseout event
            mouseout: (e: L.LeafletMouseEvent) => {
                // Reset the fillOpacity to its original value
                e.target.setStyle({
                    fillOpacity: e.target.options.style.fillOpacity
                });
            }
        }
    }

    useEffect(() => {
        console.log(props.selectedZoneUrbanistiche);
    }, [props.selectedZoneUrbanistiche]);


    /**
     * Renders a zone on the map.
     *
     * @param {zona_urbanistica} data - The zone data.
     * @returns {React.JSX.Element} The rendered GeoJSON component for the zone.
     */
    function renderZone(data: zona_urbanistica): React.JSX.Element {
        // Initialize fillOpacity to 0
        let fillOpacity = 0;

        // Set fillOpacity to 0.2 if the zone is selected
        if (props.selectedZoneUrbanistiche[data.zona_di_prossimita]) {
            fillOpacity = 0.2;
        }

        return (
            <GeoJSON data={data.geo_shape} key={data.zona_di_prossimita}
                     eventHandlers={zonaEventHandlers(data)}
                     style={{
                         weight: 2,
                         opacity: 1,
                         fillOpacity: fillOpacity
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