// frontend/src/components/ImmobileCard.tsx
import {Card, Container, Row} from "react-bootstrap";
import {immobile} from "@/lib/definitions";
import {numberWithCommas, toTitleCase} from "@/lib/utils";
import {ImmobileDetails} from "@/components/ImmobileDetails";
import {SelectedImmobileContext} from "@/components/HomepageComponent";
import {useContext} from "react";
import Image from "next/image"

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
        <Card className="card-horizontal hover-shadow" key={immobile.civ_key}
              style={{flexDirection: "row"}}
              onMouseEnter={(e) => {
                  setSelectedImmobile(immobile.civ_key)
                  // e.currentTarget.style.boxShadow = "0 0 10px #000000!important";
              }}
              onMouseLeave={(e) => {
                  setSelectedImmobile(null)
                  // e.currentTarget.style.boxShadow = "0 0 0px #000000!important";
              }}>
            <div style={{width: "100%", position: "relative"}}>
                <Image
                    src="/images/house_placeholder.webp"
                    alt="house placeholder"
                    style={{objectFit: "cover"}}
                    fill
                    // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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