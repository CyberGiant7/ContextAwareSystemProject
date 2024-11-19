"use client";
import React, {Suspense, useContext, useEffect, useState} from 'react';

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
import {useSearchParams} from "next/navigation";
import {Feature} from "geojson";


function Homepage() {
    // Contexts to manage state
    const [immobili,] = useContext(ImmobiliContext);
    const [selectedZone,] = useContext(SelectedZoneContext);
    const [visibleImmobili, setVisibleImmobili] = useContext(VisibleImmobiliContext);
    const [, setSortedBy] = useContext(SortedByContext);

    // State to store GeoJSON data
    const [geojsonData, setGeojsonData] = useState<Feature | undefined>(undefined);

    // State to manage pagination and map view
    const [slicedImmobili, setSlicedImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1);
    const [mapView, setMapView] = useState<JSX.Element>();
    const [LazyMap, setLazyMap] = React.useState<any>(<></>);

    // Hook to get search parameters
    const searchParams = useSearchParams();

    // Effect to set GeoJSON data based on search parameters

    useEffect(() => {
        // Get coordinates from search parameters
        const coordinates = searchParams.get('vrt')?.split(';').map((c) => c.split(',').map((c) => parseFloat(c)));

        // If coordinates are undefined, return early
        if (coordinates === undefined) {
            return;
        }

        // Set GeoJSON data with the retrieved coordinates
        setGeojsonData({
            type: "Feature",
            properties: {},
            geometry: {
                type: "Polygon",
                coordinates: [coordinates]
            }
        });
    }, [searchParams]);

    // Effect to set default sorting
    useEffect(() => {
        setSortedBy("default");
    }, []);

    // Effect to manage pagination
    let element_per_page = 10;
    useEffect(() => {
        setPage(1);
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [visibleImmobili]);

    useEffect(() => {
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [page]);

    // Effect to dynamically import and set the map component
    useEffect(() => {
        let Mappa = dynamic(() => import("@/components/mapComponents/Map"), {
            ssr: false,
            loading: () => <p>Loading...</p>,
        });

        setLazyMap(<Mappa width="100%" height="100%" geojsonData={geojsonData}/>);
    }, [setVisibleImmobili, geojsonData]);


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

export default function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Homepage/>
        </Suspense>
    );
}

