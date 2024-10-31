"use client"
import React, { useContext, useEffect, useState, Suspense } from 'react';
import {
    ImmobiliContext,
    SelectedZoneContext,
    SortedByContext,
    VisibleImmobiliContext
} from "@/components/wrapper/DataWrapper";
import { immobile } from "@/lib/definitions";
import { Col, Container, Row } from "react-bootstrap";
import { MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBSpinner } from "mdb-react-ui-kit";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { ImmobileCardContainer } from "@/components/ImmobileCardContainerComponent";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

function RecommendedPropertiesPage() {
    const [immobili, setImmobili] = useContext(ImmobiliContext);
    const selectedZone = useContext(SelectedZoneContext);
    const [visibleImmobili, setVisibleImmobili] = useContext(VisibleImmobiliContext);
    const [sortedBy, setSortedBy] = useContext(SortedByContext);
    const [LazyMap, setLazyMap] = React.useState<any>(<></>);
    const [radius, setRadius] = React.useState<number>(500);
    const [rankingMethod, setRankingMethod] = React.useState<number>(1);
    const [slicedImmobili, setSlicedImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1);
    const [mapView, setMapView] = useState<JSX.Element>();
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const searchParamRadius = searchParams.get("radius");


    useEffect(() => {
        if (searchParamRadius) {
            setRadius(parseInt(searchParamRadius as string));
        }
    }, [searchParams]);

    useEffect(() => {
        setSortedBy("rank");
    }, []);

    let element_per_page = 10;
    useEffect(() => {
        setPage(1);
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [visibleImmobili]);

    useEffect(() => {
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [page]);

    useEffect(() => {
        let Mappa = dynamic(() => import("@/components/mapComponents/Map"), {
            ssr: false,
            loading: () => <p>Loading...</p>,
        });

        setLazyMap(<Mappa width="100%" height="100%" />);
    }, [setVisibleImmobili]);

    useEffect(() => {
        console.log("radius", radius);
        setImmobili([]);
        router.push(pathname + `?radius=${radius}&rank_mode=${rankingMethod}${selectedZone.length > 0 ? '&' + selectedZone.map((z) => `zona=${z}`).join("&"): ''}`);
    }, [radius, rankingMethod, selectedZone]);

    useEffect(() => {
        setMapView(
            <Container fluid style={{ height: "100%" }}>
                <Row style={{ height: "100%" }}>
                    <Col>
                        <p>
                            {visibleImmobili.length} risultati per case in vendita a Bologna
                        </p>
                        <MDBDropdown style={{ float: "right", height: "max-content", margin:"0.2em" }}>
                            <MDBDropdownToggle color="primary" >
                                Metodo di ranking
                            </MDBDropdownToggle>
                            <MDBDropdownMenu>
                                <MDBDropdownItem link disabled={rankingMethod === 1} aria-current={rankingMethod === 1} onClick={() => setRankingMethod(1)}>
                                    Metodo 1
                                </MDBDropdownItem>
                                <MDBDropdownItem link disabled={rankingMethod === 2} aria-current={rankingMethod === 2} onClick={() => setRankingMethod(2)}>
                                    Metodo 2
                                </MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>

                        <MDBDropdown style={{ float: "right", height: "max-content", margin:"0.2em"}}>
                            <MDBDropdownToggle color="primary">
                                Raggio
                            </MDBDropdownToggle>
                            <MDBDropdownMenu>
                                <MDBDropdownItem link disabled={radius === 500} aria-current={radius === 500} onClick={() => setRadius(500)}>
                                    500 metri
                                </MDBDropdownItem>
                                <MDBDropdownItem link disabled={radius === 1000} aria-current={radius === 1000} onClick={() => setRadius(1000)}>
                                    1000 metri
                                </MDBDropdownItem>
                                <MDBDropdownItem link disabled={radius === 1500} aria-current={radius === 1500} onClick={() => setRadius(1500)}>
                                    1500 metri
                                </MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        {immobili.length == 0 ?
                            <MDBSpinner color="primary" /> :
                            <>
                                <PaginationControl
                                    page={page}
                                    between={4}
                                    total={visibleImmobili.length}
                                    limit={element_per_page}
                                    changePage={setPage}
                                    ellipsis={1}
                                />
                                <ImmobileCardContainer immobili={slicedImmobili} />
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
            <RecommendedPropertiesPage />
        </Suspense>
    );
}