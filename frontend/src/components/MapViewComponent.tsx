// frontend/src/app/MapView.tsx
import React, {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import dynamic from "next/dynamic";
import {PaginationControl} from "react-bootstrap-pagination-control";
import {immobile} from "@/lib/definitions";
import {ImmobileCardContainer} from "@/components/ImmobileCardContainerComponent";
import {ImmobiliContext, VisibleImmobiliContext} from "@/components/wrapper/DataWrapper";
import {MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBSpinner} from "mdb-react-ui-kit";
import {usePathname, useRouter} from "next/navigation";


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
    const [immobili, setImmobili] = useContext(ImmobiliContext);
    const [radius, setRadius] = React.useState<number>(500);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let Mappa = dynamic(() => import("@/components/mapComponents/Map"), {
            ssr: false,
            loading: () => <p>Loading...</p>,
        })

        setLazyMap(<Mappa width="100%" height="100%"/>)
    }, [setVisibleImmobili]);

    useEffect(() => {
        console.log("radius", radius);
        setImmobili([]);
        router.push(pathname + `?radius=${radius}`);
    }, [radius]);

    useEffect(() => {

    }, [immobili]);


    return (
        <Container fluid style={{height: "100%"}}>
            <Row style={{height: "100%"}}>
                <Col>
                    <p>
                        {visibleImmobili.length} risultati per case in vendita a Bologna
                    </p>

                    <MDBDropdown style={{float: "right", height: "max-content"}}>
                        <MDBDropdownToggle color="primary">
                            Raggio
                        </MDBDropdownToggle>
                        <MDBDropdownMenu>
                            <MDBDropdownItem link aria-current={radius === 500} onClick={() => setRadius(500)}>
                                500 metri
                            </MDBDropdownItem>
                            <MDBDropdownItem link aria-current={radius === 1000} onClick={() => setRadius(1000)}>
                                1000 metri
                            </MDBDropdownItem>
                            <MDBDropdownItem link aria-current={radius === 1500} onClick={() => setRadius(1500)}>
                                1500 metri
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
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
};

export default MapView;