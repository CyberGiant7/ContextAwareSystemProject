"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";

// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// import "leaflet-defaulticon-compatibility";
// END: Preserve spaces to avoid auto-sorting
import {MapContainer, Popup, TileLayer} from "react-leaflet";
import {GeoJSON} from 'react-leaflet/GeoJSON'
import {useEffect, useState} from "react";
import {getAllZone} from "@/queries/zone";
import {zone_urbanistiche} from "@/app/lib/definitions";


interface LazyMapProps {
    width: string;
    height: string;
}

function renderZone(data: zone_urbanistiche) {
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

export default function Map(prop: LazyMapProps) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const [data, setData] = useState<zone_urbanistiche[]>([]);


    useEffect(() => {
        getAllZone().then((data) => {
            setData(data);
            console.log(data);
        }).catch(console.error);
    }, []);

    return (
        <MapContainer
            preferCanvas={true}
            center={[44.4934936536425, 11.335745752828108]}
            zoom={11}
            scrollWheelZoom={true}
            style={{width: prop.width, height: prop.height}}>
            {data.map((zone) => renderZone(zone))}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}
