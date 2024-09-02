// frontend/src/components/ImmobileDetails.tsx
import { Col, Container, Row } from "react-bootstrap";
import Image from 'next/image';

interface Detail {
    icon: string;
    label: string;
    value: string | number;
}

export function ImmobileDetails({ details }: { details: Detail[] }) {
    return (
        <>
            {details.map(({ icon, label, value }) => (
                <Col key={label}>
                    <Container fluid>
                        <Row>
                            <Col style={{ paddingRight: "0px" }}>
                                <Image src={`/images/${icon}`} alt={`${label} icon`} width={0} height={0} sizes="100vw" style={{ width: '2.5rem', height: '100%' }} />
                            </Col>
                            <Col>
                                <Row>
                                    <span style={{ paddingLeft: "0px" }}>{label}</span>
                                </Row>
                                <Row>
                                    <p style={{ fontSize: '.9em', color: 'var(--bs-secondary-color)', marginBottom: "0rem", paddingLeft: "0px" }}>{value}</p>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            ))}
        </>
    );
}