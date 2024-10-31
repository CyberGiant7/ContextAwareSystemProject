"use client";
import React, {useContext, useEffect, useState} from 'react';

import {
    ImmobiliContext,
    SelectedZoneContext,
    SortedByContext,
    VisibleImmobiliContext
} from "@/components/wrapper/DataWrapper";
import {immobile} from "@/lib/definitions";
import {Col, Container, Row} from "react-bootstrap";
import {MDBSpinner} from "mdb-react-ui-kit";
import {PaginationControl} from "react-bootstrap-pagination-control";
import {ImmobileCardContainer} from "@/components/ImmobileCardContainerComponent";
import dynamic from "next/dynamic";


export default function App() {
    const [immobili, setImmobili] = useContext(ImmobiliContext);
    const [selectedZone, setSelectedZone] = useContext(SelectedZoneContext);
    const [visibleImmobili, setVisibleImmobili] = useContext(VisibleImmobiliContext);
    const [sortedBy, setSortedBy] = useContext(SortedByContext);

    const [slicedImmobili, setSlicedImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1);
    const [mapView, setMapView] = useState<JSX.Element>();

    useEffect(() => {
        setSortedBy("default");
    }, []);

    let element_per_page = 10;
    useEffect(() => {
        setPage(1);
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [visibleImmobili]);

    useEffect(() => {
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [page]);

    const [LazyMap, setLazyMap] = React.useState<any>(<></>);

    useEffect(() => {
        let Mappa = dynamic(() => import("@/components/mapComponents/Map"), {
            ssr: false,
            loading: () => <p>Loading...</p>,
        })

        setLazyMap(<Mappa width="100%" height="100%"/>)
    }, [setVisibleImmobili]);


    useEffect(() => {
        setMapView(
            <Container fluid style={{height: "100%"}}>
                <Row style={{height: "100%"}}>
                    <Col>
                        <p>
                            {visibleImmobili.length} risultati per case in vendita a Bologna
                        </p>
                        {immobili.length == 0 ?
                            <MDBSpinner color="primary"/> :
                            <>
                                <PaginationControl
                                    page={page}
                                    between={4}
                                    total={visibleImmobili.length}
                                    limit={element_per_page}
                                    changePage={setPage}
                                    ellipsis={1}
                                />
                                <ImmobileCardContainer immobili={slicedImmobili}/>
                                <PaginationControl
                                    page={page}
                                    between={4}
                                    total={visibleImmobili.length}
                                    limit={element_per_page}
                                    changePage={setPage}
                                    ellipsis={1}
                                />
                            </>
                        }
                    </Col>
                    <Col>
                        {LazyMap}
                    </Col>
                </Row>
            </Container>
        );
    }, [immobili, page, selectedZone, slicedImmobili]);

    return (
        <div className="App">
            {mapView}
        </div>
    );
}