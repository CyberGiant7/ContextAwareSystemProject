// frontend/src/components/ZoneSelectorComponent.tsx
"use client";
import React, {useEffect, useState} from 'react';
import {Col, Container, Row, Button, Card} from "react-bootstrap";
import dynamic from "next/dynamic";
import ZoneList from "@/components/ZoneList";
import {zona_urbanistica} from "@/lib/definitions";


import {MDBBtn, MDBCard, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {getAllZone} from "@/queries/zone";

const LazyZoneSelectorMap = dynamic(() => import("@/components/mapComponents/ZoneSelectorMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

type ZoneSelectorViewProps = {
    zone: zona_urbanistica[]
    setZone: React.Dispatch<React.SetStateAction<zona_urbanistica[]>>
};


const ZoneSelectorView: React.FC<ZoneSelectorViewProps> = ({zone, setZone}) => {
    const [selectedZoneUrbanistiche, setSelectedZoneUrbanistiche] = useState<Record<string, boolean>>({});

    const router = useRouter()
    const searchParams = useSearchParams()
    const prevUrl = searchParams.get("prevUrl")


    const handleSubmit = () => {
        const selectedZones = Object.keys(selectedZoneUrbanistiche)
            .filter(key => selectedZoneUrbanistiche[key]);

        // Costruisci la query string con le zone selezionate
        const searchParams = selectedZones.map(zone => `zona=${zone}`).join("&");

        // Ottieni l'URL della pagina precedente o usa un fallback
        const previousUrl = prevUrl ? prevUrl : '/';

        // Fai il redirect alla pagina precedente con i parametri selezionati
        router.push(`${previousUrl}?${searchParams}`);
    };

    return (
        <MDBContainer fluid style={{height: "100%", display: "flex", flexDirection: "row", padding: '0px'}}>
            <MDBCol lg="auto" style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "300px",
                maxWidth: "fit-content",
                backgroundColor: '#eee'
            }}>
                <MDBRow className="m-2">
                    <h2>Zone su mappa</h2>
                </MDBRow>
                <MDBRow className="m-2 card" style={{flex: 1, overflowY: "scroll", maxHeight: "calc(100vh - 100px)"}}>
                    <ZoneList
                        zone={zone}
                        selectedZoneUrbanistiche={selectedZoneUrbanistiche}
                        setSelectedZoneUrbanistiche={setSelectedZoneUrbanistiche}
                    />
                </MDBRow>
                <MDBRow className="m-2">
                    <MDBBtn color="primary" onClick={handleSubmit}>Conferma</MDBBtn>
                </MDBRow>
            </MDBCol>

            <MDBCol style={{flex: 1, height: "100%"}}>
                <LazyZoneSelectorMap
                    width="100%"
                    selectedZoneUrbanistiche={selectedZoneUrbanistiche}
                    setSelectedZoneUrbanistiche={setSelectedZoneUrbanistiche}
                    zone={zone}
                    setZone={setZone}
                />
            </MDBCol>
        </MDBContainer>

    );
};

export default ZoneSelectorView;