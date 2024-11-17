import Image from 'next/image';
import {MDBCol, MDBContainer, MDBRow, MDBTooltip} from "mdb-react-ui-kit";
import React from "react";

/**
 * Interface representing the details of an immobile.
 */
interface Detail {
    icon: string;
    label: string;
    value: string | number;
}

/**
 * Component to display the details of an immobile.
 *
 * @param {Object} props - The component props.
 * @param {Detail[]} props.details - The array of details to display.
 * @returns {React.JSX.Element} The rendered component.
 */
export function ImmobileDetails({details}: { details: Detail[] }): React.JSX.Element {
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