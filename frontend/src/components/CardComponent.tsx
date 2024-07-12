import React from 'react';
import {Card, ListGroup} from 'react-bootstrap';

interface Card {
    email: string;
    password: string;
}

const CardComponent: React.FC<{ card: Card }> = ({card}) => {
    return (
        <Card className="mx-3">
            <Card.Title>User</Card.Title>
            <Card.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item>{card.email}</ListGroup.Item>
                    <ListGroup.Item>{card.password}</ListGroup.Item>
                </ListGroup>
            </Card.Body>

        </Card>
    );
};

export default CardComponent;