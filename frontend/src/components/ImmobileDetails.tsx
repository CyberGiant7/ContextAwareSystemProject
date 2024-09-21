// frontend/src/components/ImmobileDetails.tsx
import {Col, Container, Row} from "react-bootstrap";
import Image from 'next/image';
import {MDBCol, MDBContainer, MDBRow, MDBTooltip} from "mdb-react-ui-kit";

interface Detail {
    icon: string;
    label: string;
    value: string | number;
}

export function ImmobileDetails({details}: { details: Detail[] }) {
    return (
        <>
            {details.map(({icon, label, value}) => (
                <MDBCol key={label}>
                    <MDBContainer fluid>
                        <MDBRow style={{flexDirection: "row"}}>
                            <MDBCol style={{paddingRight: "0px"}}>
                                <Image src={`/images/${icon}`} alt={`${label} icon`} width={0} height={0}
                                       sizes="100vw" style={{width: '1.5rem', height: '100%'}}/>
                            </MDBCol>
                            <MDBCol className={"text-truncate"}>
                                <MDBTooltip tag={MDBRow} title={label}>
                                    <span style={{paddingLeft: "0px"}}>
                                        {label}
                                    </span>
                                </MDBTooltip>
                                <MDBTooltip tag={MDBRow} title={value}>
                                    <p
                                        style={{
                                            fontSize: '.9em',
                                            color: 'var(--bs-secondary-color)',
                                            marginBottom: "0rem",
                                            paddingLeft: "0px"
                                        }}
                                    >
                                        {value}
                                    </p>
                                </MDBTooltip>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </MDBCol>
            ))}
        </>
    );
}