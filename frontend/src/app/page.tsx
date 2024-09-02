"use client";
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
import '@/../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './page.module.css'

import dynamic from "next/dynamic";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ImmobileList} from "@/components/ImmobiliList";

import {getAllImmobili, getAllImmobiliInZone} from "@/queries/immobili";
import {getAllZone} from "@/queries/zone";

import {immobile, zona_urbanistica} from "@/lib/definitions";
import {PaginationControl} from "react-bootstrap-pagination-control";
import ZoneList from "@/components/ZoneList";

import {useSearchParams} from "next/navigation";
import {MapProps} from "@/components/Map";
import {MapProps as ZoneSelectorMapProps} from "@/components/ZoneSelectorMap";

// let LazyMap: React.ComponentType<MapProps> = () => {
//     return <p>Loading...</p>
// };
let LazyMap: React.ComponentType<MapProps> = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

let LazyZoneSelectorMap = dynamic(() => import("@/components/ZoneSelectorMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

type SearchParams = {
    zona?: string | string[];
};

type Props = {
    searchParams: SearchParams;
};

export default function App({searchParams}: Props) {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1)
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);
    const [slicedImmobili, setSlicedImmobili] = useState(visibleImmobili.slice(0, 5));
    const [activeZoneSelector, setActiveZoneSelector] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string[]>([]);
    const [zone, setZone] = useState<zona_urbanistica[]>([]);
    const element_per_page = 10;

    console.log("search params:", searchParams)

    useEffect(() => {
        getAllZone().then(setZone).catch(console.error);
    }, []);

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
        let selected_zone_param = searchParams['zona'] as string | string[] | undefined;
        let local_selected_zone: string[] = [];
        console.log("selected_zone:", selected_zone_param)
        if (selected_zone_param instanceof Array) {
            local_selected_zone = selected_zone_param;
            setSelectedZone(selected_zone_param)
        } else if (typeof selected_zone_param === "string") {
            local_selected_zone = [selected_zone_param];
            setSelectedZone([selected_zone_param])
        }
        console.log("selected zone:", selectedZone)
        if (local_selected_zone.length > 0) {
            getAllImmobiliInZone(local_selected_zone).then(setImmobili).catch(console.error);
        } else {
            getAllImmobili().then(setImmobili).catch(console.error);
        }
    }, [searchParams]);


    useEffect(() => {

    }, [immobili]);

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
                    <Col className="col-3" style={{display: activeZoneSelector ? "block" : "none"}}>
                        <ZoneList zone={zone}></ZoneList>
                    </Col>
                    <Col>
                        {activeZoneSelector ? <LazyZoneSelectorMap width="100%"/> :
                            <LazyMap width="100%" height="100%" immobili={immobili}
                                     setVisibleImmobili={setVisibleImmobili}
                                     selectedZone={selectedZone}/>}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
