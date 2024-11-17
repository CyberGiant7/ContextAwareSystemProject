import {Card, Container, Row} from "react-bootstrap";
import {immobile} from "@/lib/definitions";
import {numberWithCommas, toTitleCase} from "@/lib/utils";
import {ImmobileDetails} from "@/components/ImmobileDetails";
import {SelectedImmobileContext} from "@/components/wrapper/DataWrapper";
import React, {useContext} from "react";
import Image from "next/image"


interface ImmobileCardProps {
    immobile: immobile;
}

/**
 * ImmobileCard component displays the details of an immobile (property) in a card format.
 *
 * @param {ImmobileCardProps} props - The properties for the ImmobileCard component.
 * @returns {React.JSX.Element} The rendered ImmobileCard component.
 */
export function ImmobileCard({immobile}: ImmobileCardProps): React.JSX.Element {
    const details = [
        {icon: "surface.svg", label: "Superficie", value: `${immobile.superficie} mq`},
        {icon: "floor.svg", label: "Piano", value: immobile.piano},
        {icon: "elevator.svg", label: "Ascensore", value: immobile.ascensore ? 'Sì' : 'No'},
        {icon: "energetic_class_icon.svg", label: "Classe energetica", value: immobile.classe_energetica},
        {icon: "energetic_class_icon.svg", label: "Stato immobile", value: immobile.stato_immobile},
        {icon: "energetic_class_icon.svg", label: "Stato finiture esterne", value: immobile.stato_finiture_esterne},
        {icon: "energetic_class_icon.svg", label: "Anno costruzione", value: immobile.eta_costruzione}
    ];

    const [, setSelectedImmobile] = useContext(SelectedImmobileContext);

    return (
        // Card component to display immobile details
        <Card className="card-horizontal hover-shadow" key={immobile.civ_key}
              style={{flexDirection: "row"}}
              onMouseEnter={(e) => {
                  // Set the selected immobile on mouse enter
                  setSelectedImmobile(immobile.civ_key)
              }}
              onMouseLeave={(e) => {
                  // Clear the selected immobile on mouse leave
                  setSelectedImmobile(null)
              }}>
            <div style={{width: "100%", position: "relative"}}>
                <Image
                    src="/images/house_placeholder.webp"
                    alt="house placeholder"
                    style={{objectFit: "cover"}}
                    fill
                />
            </div>
            <Card.Body>
                <Card.Title>€ {numberWithCommas(immobile.prezzo)}</Card.Title>
                <strong>
                    Appartamento in {toTitleCase(immobile.indirizzo)} - {toTitleCase(immobile.zona_di_prossimita)},
                    Bologna
                </strong>
                <Container>
                    <Row md={3} sm={2}>
                        <ImmobileDetails details={details}/>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}