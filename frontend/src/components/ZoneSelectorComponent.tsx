// frontend/src/components/ZoneSelectorComponent.tsx
"use client";
import React, {useState} from 'react';
import {Col, Container, Row, Button, Card} from "react-bootstrap";
import dynamic from "next/dynamic";
import ZoneList from "@/components/ZoneList";
import {zona_urbanistica} from "@/lib/definitions";
import {useRouter} from 'next/navigation'
import {MDBBtn, MDBCard, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";

const LazyZoneSelectorMap = dynamic(() => import("@/components/ZoneSelectorMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

type ZoneSelectorViewProps = {
    zone: zona_urbanistica[];
    setActiveZoneSelector: React.Dispatch<React.SetStateAction<boolean>>;
};

const ZoneSelectorView: React.FC<ZoneSelectorViewProps> = ({zone, setActiveZoneSelector}) => {
    const [selectedZoneUrbanistiche, setSelectedZoneUrbanistiche] = useState<Record<string, boolean>>({});

    // const router = useRouter()
    return (
        <MDBContainer fluid style={{height: "100%"}}>
            <MDBRow>
                <MDBCol style={{height: "100%"}} md="auto">
                    <MDBRow>
                        <ZoneList zone={zone} selectedZoneUrbanistiche={selectedZoneUrbanistiche}
                                  setSelectedZoneUrbanistiche={setSelectedZoneUrbanistiche}></ZoneList>
                    </MDBRow>
                    <MDBRow>
                        <MDBBtn color="primary" onClick={() => setActiveZoneSelector(false)}>Conferma</MDBBtn>
                    </MDBRow>
                </MDBCol>
                <MDBCol style={{height: "100%"}}>
                    <LazyZoneSelectorMap width="100%" selectedZoneUrbanistiche={selectedZoneUrbanistiche}
                                         setSelectedZoneUrbanistiche={setSelectedZoneUrbanistiche}/>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default ZoneSelectorView;