// frontend/src/components/ImmobileCard.tsx
import {Card, Container, Row} from "react-bootstrap";
import {immobile} from "@/lib/definitions";
import {numberWithCommas, toTitleCase} from "@/lib/utils";
import {ImmobileDetails} from "@/components/ImmobileDetails";
import {SelectedImmobileContext} from "@/components/HomepageComponent";
import {useContext} from "react";

export function ImmobileCard({immobile}: { immobile: immobile }) {
    const details = [
        {icon: "surface.svg", label: "Superficie", value: `${immobile.superficie} mq`},
        {icon: "floor.svg", label: "Piano", value: immobile.piano},
        {icon: "elevator.svg", label: "Ascensore", value: immobile.ascensore ? 'Sì' : 'No'},
        {icon: "energetic_class_icon.svg", label: "Classe energetica", value: immobile.classe_energetica},
        {icon: "energetic_class_icon.svg", label: "Stato immobile", value: immobile.stato_immobile},
        {icon: "energetic_class_icon.svg", label: "Stato finiture esterne", value: immobile.stato_finiture_esterne},
        {icon: "energetic_class_icon.svg", label: "Anno costruzione", value: immobile.eta_costruzione}
    ];

    const [_, setSelectedImmobile] = useContext(SelectedImmobileContext);

    return (
        <Card className="card-horizontal" key={immobile.civ_key} style={{flexDirection: "row"}} onMouseEnter={(e) => {setSelectedImmobile(immobile.civ_key)}}>
            <img
                src="/images/house_placeholder.webp"
                alt="house placeholder"
                width="50%"
                style={{objectFit: "cover"}}
            />
            <Card.Body>
                <Card.Title>€ {numberWithCommas(immobile.prezzo)}</Card.Title>
                <strong>
                    Appartamento in {toTitleCase(immobile.indirizzo)} - {toTitleCase(immobile.zona_di_prossimita)},
                    Bologna
                </strong>
                <Container>
                    <Row md={4}>
                        <ImmobileDetails details={details}/>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}