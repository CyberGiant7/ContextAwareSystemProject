"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// END: Preserve spaces to avoid auto-sorting
import {LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import React, {useState} from "react";
import {equidistant_points} from "@/lib/definitions";
import {HeatmapLayerFactory} from "@vgrid/react-leaflet-heatmap-layer"
import L, {DivIcon} from "leaflet";
import {getColorFromRank} from "@/lib/utils";

interface MapProps {
    width: string
    height: string
    equidistantPoints: equidistant_points[]
}

const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()

/**
 * Map component to render a leaflet map with heatmap and markers.
 * @param {MapProps} prop - The properties for the map component.
 * @param {string} prop.width - The width of the map.
 * @param {string} prop.height - The height of the map.
 * @param {equidistant_points[]} prop.equidistantPoints - Array of points to be displayed on the map.
 * @returns {React.JSX.Element} The rendered map component.
 */
export default function Map(prop: MapProps): React.JSX.Element {
    const [currentZoom, setCurrentZoom] = useState(12);
    const [map, setMap] = useState<L.Map>();

    /**
     * Component to handle map events.
     * @returns {boolean} False to indicate no additional rendering.
     */
    const MapEvents = () => {
        useMapEvents({
            zoomend() { // zoom event (when zoom animation ended)
                if (!map) return;
                setCurrentZoom(map.getZoom());
            },
        });
        return false;
    };

    return (
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
            <LayersControl position="topright">
                <LayersControl.Overlay name="Marker colorati">
                    <LayerGroup>
                        <ColoredMarkers equidistantPoints={prop.equidistantPoints}/>
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Heatmap" checked>
                    <LayerGroup>
                        <HeatmapLayer
                            points={prop.equidistantPoints.map((point: equidistant_points) => [point.geo_point.coordinates[0], point.geo_point.coordinates[1], point.rank ? point.rank : 0])}
                            longitudeExtractor={(point: [number, number, number]) => point[0]}
                            latitudeExtractor={(point: [number, number, number]) => point[1]}
                            intensityExtractor={(point: [number, number, number]) => point[2]}
                            radius={getRadiusBlur(currentZoom).radius}
                            blur={getRadiusBlur(currentZoom).blur}
                            max={100}
                            useLocalExtrema={false}
                            opacity={0.5}
                        />
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    )
}

interface ColoredMarkersProps {
    equidistantPoints: equidistant_points[];
}

/**
 * Component to render colored markers on the map.
 * @param {ColoredMarkersProps} props - The properties for the colored markers component.
 * @param {equidistant_points[]} props.equidistantPoints - Array of points to be displayed as colored markers.
 * @returns {React.JSX.Element} The rendered colored markers component.
 */
const ColoredMarkers: React.FC<ColoredMarkersProps> = ({ equidistantPoints }: ColoredMarkersProps): React.JSX.Element => {
    return (
        <>
            {equidistantPoints.map((point: equidistant_points) => {
                if (!point.rank) return null;
                const markerColor = getColorFromRank(point.rank, 100);
                const icon = new DivIcon({
                    className: 'custom-div-icon', // Add a custom class
                    html: `<div style="background-color:${markerColor}; width:20px; height:20px; border-radius:50%; border: 2px solid white; position:inherit; left: -4px; top: -4px;" class="custom-div-icon"></div>`,
                });
                return (
                    <Marker position={[point.geo_point.coordinates[1], point.geo_point.coordinates[0]]}
                            key={point.codice}
                            icon={icon}>
                        <Popup>
                            {point.rank}
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};


/**
 * Function to calculate the radius and blur for the heatmap based on the current zoom level.
 * @param {number} currentZoom - The current zoom level of the map.
 * @returns {{radius: number, blur: number}} The radius and blur values.
 */
function getRadiusBlur(currentZoom: number): { radius: number; blur: number; } {
    const radius = Math.pow(2, currentZoom - 9);
    const blur = radius;
    return {radius, blur};
}