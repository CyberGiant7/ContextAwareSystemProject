// frontend/src/app/MapView.tsx
import React, {useEffect} from 'react';
import {Col, Container, Row, Button} from "react-bootstrap";
import dynamic from "next/dynamic";
import {PaginationControl} from "react-bootstrap-pagination-control";
import {immobile} from "@/lib/definitions";
import {ImmobileList} from "@/components/ImmobiliList";
import {useRouter} from "next/navigation";


type MapViewProps = {
    immobili: immobile[];
    visibleImmobili: immobile[];
    slicedImmobili: immobile[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setActiveZoneSelector: React.Dispatch<React.SetStateAction<boolean>>;
    setVisibleImmobili: React.Dispatch<React.SetStateAction<immobile[]>>;
    selectedZone: string[];
};

const MapView: React.FC<MapViewProps> = ({
                                             immobili,
                                             visibleImmobili,
                                             slicedImmobili,
                                             page,
                                             setPage,
                                             setActiveZoneSelector,
                                             setVisibleImmobili,
                                             selectedZone
                                         }) => {
    const element_per_page = 10;
    const router = useRouter();
    const [LazyMap, setLazyMap] = React.useState<any>(<></>);


    useEffect(() => {
        let Mappa = dynamic(() => import("@/components/Map"), {
            ssr: false,
            loading: () => <p>Loading...</p>,
        })

        setLazyMap(<Mappa width="100%" height="100%" immobili={immobili}
                          setVisibleImmobili={setVisibleImmobili}
                          selectedZone={selectedZone}/>
        )
    }, [immobili, selectedZone, setVisibleImmobili]);

    return (
        <Container fluid style={{height: "100%"}}>
            <Button onClick={() => {
                router.push("/select-zone");
                setActiveZoneSelector(true)
                router.refresh()
            }}>
                Seleziona zona
            </Button>
            <Row style={{height: "100%"}}>
                <Col>
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
                <Col>
                    {LazyMap}
                </Col>
            </Row>
        </Container>
    );
};

export default MapView;