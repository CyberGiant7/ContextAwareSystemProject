// frontend/src/app/MapView.tsx
import React, {useContext, useEffect} from 'react';
import {Col, Container, Row, Button} from "react-bootstrap";
import dynamic from "next/dynamic";
import {PaginationControl} from "react-bootstrap-pagination-control";
import {immobile} from "@/lib/definitions";
import {ImmobileCardContainer} from "@/components/ImmobileCardContainerComponent";
import {VisibleImmobiliContext} from "@/components/wrapper/DataWrapper";

type MapViewProps = {
    slicedImmobili: immobile[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    element_per_page: number;
};

const MapView: React.FC<MapViewProps> = ({
                                             slicedImmobili,
                                             page,
                                             setPage,
                                             element_per_page
                                         }) => {
    const [LazyMap, setLazyMap] = React.useState<any>(<></>);
    const [visibleImmobili, setVisibleImmobili] = React.useContext(VisibleImmobiliContext);

    useEffect(() => {
        let Mappa = dynamic(() => import("@/components/Map"), {
            ssr: false,
            loading: () => <p>Loading...</p>,
        })

        setLazyMap(<Mappa width="100%" height="100%"/>)
    }, [ setVisibleImmobili]);

    return (
        <Container fluid style={{height: "100%"}}>
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
                    <ImmobileCardContainer immobili={slicedImmobili}/>
                </Col>
                <Col>
                    {LazyMap}
                </Col>
            </Row>
        </Container>
    );
};

export default MapView;