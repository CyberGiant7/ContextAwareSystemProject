"use client";
import React, {useEffect, useState} from 'react'
import '@/../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './page.module.css'

import dynamic from "next/dynamic";
import {Col, Container, Row} from "react-bootstrap";
import {ImmobileList} from "@/components/ImmobiliList";
import {getAllZone} from "@/queries/zone";
import {getAllImmobili} from "@/queries/immobili";
import {getAllBarRistoranti} from "@/queries/bar_ristoranti";
import {getAllBiblioteche} from "@/queries/biblioteche";
import {getAllFarmacie} from "@/queries/farmacie";
import {getAllFermateAutobus} from "@/queries/fermate_autobus";
import {getAllPalestre} from "@/queries/palestre";
import {getAllParcheggi} from "@/queries/parcheggi";
import {getAllParchiEGiardini} from "@/queries/parchi_e_giardini";
import {getAllScuole} from "@/queries/scuole";
import {getAllStruttureSanitarie} from "@/queries/strutture_sanitarie";
import {getAllSupermercati} from "@/queries/supermercati";
import {immobile} from "@/lib/definitions";
import {PaginationControl} from "react-bootstrap-pagination-control";

const LazyMap = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function App() {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1)
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);
    const [slicedImmobili, setSlicedImmobili] = useState(visibleImmobili.slice(0, 5));
    const element_per_page = 10;


    useEffect(() => {
        getAllImmobili().then(setImmobili).catch(console.error);
    }, []);

    useEffect(() => {
        if (visibleImmobili.length > element_per_page) {
            setSlicedImmobili(visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page));
        } else {
            setSlicedImmobili(visibleImmobili);
        }
    }, [page, visibleImmobili]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>App</h1>
            </header>
            <Container fluid style={{height: "-webkit-fill-available"}}>
                <Row>
                    <Col>
                        <PaginationControl
                            page={page}
                            between={4}
                            total={visibleImmobili.length}
                            limit={element_per_page}
                            changePage={(page) => {
                                setPage(page)
                            }}
                            ellipsis={1}
                        />
                        <ImmobileList immobili={slicedImmobili}/>
                    </Col>
                    <Col>
                        <LazyMap width="100%" height="100vh" immobili={immobili} setVisibleImmobili={setVisibleImmobili}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

