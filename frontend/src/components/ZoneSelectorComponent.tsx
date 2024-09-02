// frontend/src/components/ZoneSelectorComponent.tsx
"use client";
import React, {useState} from 'react';
import {Col, Container, Row, Button} from "react-bootstrap";
import dynamic from "next/dynamic";
import ZoneList from "@/components/ZoneList";
import {zona_urbanistica} from "@/lib/definitions";
import { useRouter } from 'next/navigation'

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

    const router = useRouter()
    return (
        <Container fluid style={{height: "100%"}}>
            <Button onClick={() => {
                let url = "/?" + Object.keys(selectedZoneUrbanistiche).filter(key => selectedZoneUrbanistiche[key]).map(key => "zona=" + key).join("&");
                router.push(url);
            }}>
                Seleziona zona
            </Button>
            <Row style={{height: "100%"}}>
                <Col md="auto">
                    <ZoneList zone={zone} selectedZoneUrbanistiche={selectedZoneUrbanistiche} setSelectedZoneUrbanistiche={setSelectedZoneUrbanistiche}></ZoneList>
                </Col>
                <Col>
                    <LazyZoneSelectorMap width="100%" selectedZoneUrbanistiche={selectedZoneUrbanistiche} setSelectedZoneUrbanistiche={setSelectedZoneUrbanistiche}/>
                </Col>
            </Row>
        </Container>
    );
};

export default ZoneSelectorView;