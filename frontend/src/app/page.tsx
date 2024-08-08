"use client";
import React, {useEffect, useState} from 'react'
import '@/../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './page.module.css'

import dynamic from "next/dynamic";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ImmobileList} from "@/components/ImmobiliList";

import {getAllImmobili, getAllImmobiliInZone} from "@/queries/immobili";

import {immobile} from "@/lib/definitions";
import {PaginationControl} from "react-bootstrap-pagination-control";

import {useSearchParams} from "next/navigation";
import {MapProps} from "@/components/Map";
import {MapProps as ZoneSelectorMapProps} from "@/components/ZoneSelectorMap";

let LazyMap = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

let LazyZoneSelectorMap = dynamic(() => import("@/components/ZoneSelectorMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});


export default function App() {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1)
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);
    const [slicedImmobili, setSlicedImmobili] = useState(visibleImmobili.slice(0, 5));
    const [activeZoneSelector, setActiveZoneSelector] = useState(false);
    const element_per_page = 10;

    const searchParams = useSearchParams()
    const selected_zone = searchParams.getAll('zona')

    useEffect(() => {
        if (!activeZoneSelector) {

        } else {
            LazyZoneSelectorMap = dynamic(() => import("@/components/ZoneSelectorMap"), {
                ssr: false,
                loading: () => <p>Loading...</p>,
            });
        }
    }, [activeZoneSelector]);

    useEffect(() => {
        if (selected_zone.length > 0) {
            getAllImmobiliInZone(selected_zone).then(setImmobili).catch(console.error);
        } else {
            getAllImmobili().then(setImmobili).catch(console.error);
        }

    }, []);

    useEffect(() => {
        setPage(1);
        if (visibleImmobili.length > element_per_page) {
            setSlicedImmobili(visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page));
        } else {
            setSlicedImmobili(visibleImmobili);
        }
    }, [visibleImmobili]);

    useEffect(() => {
        if (visibleImmobili.length > element_per_page) {
            setSlicedImmobili(visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page));
        } else {
            setSlicedImmobili(visibleImmobili);
        }
    }, [page]);

    return (
        <div className="App">
            <Container fluid style={{height: "100%"}}>
                <Button onClick={() => setActiveZoneSelector(!activeZoneSelector)}>
                    Seleziona zona
                </Button>
                <Row style={{height: "100%"}}>
                    <Col style={{display: activeZoneSelector ? "none" : "block"}}>
                        <p>
                            {visibleImmobili.length} risultati per case in vendita a Bologna
                        </p>
                        <PaginationControl
                            page={page}
                            between={4}
                            total={visibleImmobili.length}
                            limit={element_per_page}
                            changePage={setPage}
                            ellipsis={1}
                        />
                        <ImmobileList immobili={slicedImmobili}/>
                    </Col>
                    <Col className="col-2" style={{display: activeZoneSelector ? "block" : "none"}}>
                        <p>listas</p>
                    </Col>
                    <Col>
                        {activeZoneSelector ? <LazyZoneSelectorMap width="100%"/> :
                            <LazyMap width="100%" height="100%" immobili={immobili}
                                     setVisibleImmobili={setVisibleImmobili}
                                     selectedZone={selected_zone}/>}

                    </Col>
                </Row>
            </Container>
        </div>
    )
}
