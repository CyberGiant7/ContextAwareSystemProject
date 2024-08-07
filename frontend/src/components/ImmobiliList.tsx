import {Card} from "react-bootstrap";
import {immobile} from "@/lib/definitions";
import Pagination from 'react-bootstrap/Pagination';
import {useEffect, useState} from "react";
import { PaginationControl } from 'react-bootstrap-pagination-control';

export function ImmobileList(props: { immobili: immobile[] }) {
    return (
        <div>
            {props.immobili.map((immobile) => {
                return (
                    <Card key={immobile.civ_key}>
                        <Card.Title>{immobile.prezzo} </Card.Title>
                        <Card.Body>
                            <Card.Text><strong>Indirizzo</strong>: {immobile.indirizzo}</Card.Text>
                            <Card.Text><strong>Quartiere</strong>: {immobile.quartiere}</Card.Text>
                            <Card.Text><strong>Zona di prossimità</strong>: {immobile.zona_di_prossimita}</Card.Text>
                            <Card.Text><strong>Superficie</strong>: {immobile.superficie} mq</Card.Text>
                            <Card.Text><strong>Piano</strong>: {immobile.piano}</Card.Text>
                            <Card.Text><strong>Ascensore</strong>: {immobile.ascensore ? 'Si' : 'No'}</Card.Text>
                            <Card.Text><strong>Stato immobile</strong>: {immobile.stato_immobile}</Card.Text>
                            <Card.Text><strong>Stato finiture esterne</strong>: {immobile.stato_finiture_esterne}
                            </Card.Text>
                            <Card.Text><strong>Età costruzione</strong>: {immobile.eta_costruzione}</Card.Text>
                            <Card.Text><strong>Classe energetica</strong>: {immobile.classe_energetica}</Card.Text>

                        </Card.Body>
                    </Card>
                )
            })}
        </div>
    )
}