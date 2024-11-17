"use client";
import React, {Suspense, useState} from "react";
import dynamic from "next/dynamic";
import {Col, Container, Row} from "react-bootstrap";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBRange,
    MDBTabs,
    MDBTabsContent,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsPane
} from "mdb-react-ui-kit";
import {Feature, Polygon} from "geojson";
import {useRouter, useSearchParams} from "next/navigation";

const LazyZoneSelectorMap = dynamic(() => import("@/components/mapComponents/CustomZoneMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});


function CustomZonesPage() {
    const [radius, setRadius] = useState(500);
    const [travelTime, setTravelTime] = useState(10);
    const [basicActive, setBasicActive] = useState('raggio');
    const [geojsonData, setGeojsonData] = useState<Feature | undefined>(undefined)
    const router = useRouter();
    const searchParams = useSearchParams()
    const prevUrl = searchParams.get("prevUrl")

    // Handle tab click event
    const handleBasicClick = (value: string) => {
        if (value === basicActive) {
            return;
        }
        setBasicActive(value);
    };

    // Handle confirm button click event
    const handleConfirm = (geoJsonData: Feature) => {
        // Create URL search parameters
        const params = new URLSearchParams();
        // Extract geometry as Polygon
        const geometry: Polygon = geoJsonData.geometry as Polygon;
        // Get coordinates from geometry
        const coordinates = geometry.coordinates;
        // Append coordinates to params
        params.append('vrt', coordinates[0].map((c) => c.join(',')).join(';'));
        // Determine previous URL or default to '/'
        const previousUrl = prevUrl ? prevUrl : '/';
        // Navigate to the previous URL with appended params
        router.push(`${previousUrl}?${params.toString()}`);
    }

    return (
        <div className="App">
            <Container fluid style={{height: "100%", backgroundColor: '#eee'}}>
                <Row style={{height: "100%"}}>
                    <Col md={4}>
                        <h2>Distanza da un punto</h2>

                        <MDBTabs className='mb-3'>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => handleBasicClick('raggio')}
                                             active={basicActive === 'raggio'}>
                                    Per raggio
                                </MDBTabsLink>
                            </MDBTabsItem>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => handleBasicClick('driving-car')}
                                             active={basicActive === 'driving-car'}>
                                    In auto
                                </MDBTabsLink>
                            </MDBTabsItem>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => handleBasicClick('cycling-regular')}
                                             active={basicActive === 'cycling-regular'}>
                                    In bici
                                </MDBTabsLink>
                            </MDBTabsItem>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => handleBasicClick('foot-walking')}
                                             active={basicActive === 'foot-walking'}>
                                    A piedi
                                </MDBTabsLink>
                            </MDBTabsItem>
                        </MDBTabs>

                        <MDBTabsContent>
                            <MDBTabsPane open={basicActive === 'raggio'}>
                                <MDBCard>
                                    <MDBCardBody>
                                        <MDBRange
                                            defaultValue={50}
                                            id='customRange'
                                            label={`Raggio di ricerca: ${radius} m`}
                                            min={100}
                                            max={10000}
                                            step='100'
                                            onChange={(e) => setRadius(Number(e.target.value))}
                                        />
                                    </MDBCardBody>
                                </MDBCard>
                                <MDBBtn style={{width: "100%"}} onClick={() => {
                                    if (geojsonData) handleConfirm(geojsonData)
                                }}>
                                    Conferma
                                </MDBBtn>
                            </MDBTabsPane>
                            <MDBTabsPane
                                open={basicActive === 'driving-car' || basicActive === 'cycling-regular' || basicActive === 'foot-walking'}>
                                <MDBCard>
                                    <MDBCardBody>
                                        <MDBRange
                                            defaultValue={10}
                                            id='customRange'
                                            label={`Tempo di percorrenza: ${travelTime} minuti`}
                                            min={1}
                                            max={45}
                                            step='1'
                                            onChange={(e) => setTravelTime(Number(e.target.value))}
                                        />
                                    </MDBCardBody>
                                </MDBCard>
                                <MDBBtn style={{width: "100%"}} onClick={() => {
                                    if (geojsonData) handleConfirm(geojsonData)
                                }}>
                                    Conferma
                                </MDBBtn>
                            </MDBTabsPane>
                        </MDBTabsContent>
                    </Col>
                    <Col md={8}>
                        <LazyZoneSelectorMap
                            width="100%"
                            height="100%"
                            radius={radius}
                            travelTime={travelTime}
                            vehicle={basicActive}
                            geojsonData={geojsonData}
                            setGeojsonData={setGeojsonData}
                        />
                    </Col>
                </Row>
            </Container>

        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CustomZonesPage/>
        </Suspense>
    )
}



