// frontend/src/app/survey/page.tsx
"use client"

import {Button, Card, Container, Form, Row} from "react-bootstrap";
import {FormGroupWithCheckboxes} from "@/components/FormGroupWithCheckboxes";
import {useEffect, useState} from "react";
import {auth} from "@/auth";
import {user} from '@/lib/definitions';
import {Session} from "next-auth";
import {SessionContext, SessionProvider, useSession} from "next-auth/react";

const surveyQuestions = [
    {
        category: "Fermate Autobus",
        questions: [
            {
                label: "proximity_fermate_autobus",
                question: "Quanto è importante per te avere una fermata dell'autobus nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_fermate_autobus",
                question: "Quanto è importante per te avere almeno 3 fermate dell'autobus nelle vicinanze? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Supermercati",
        questions: [
            {
                label: "proximity_supermercati",
                question: "Quanto è importante per te avere un supermercato nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_supermercati",
                question: "Quanto è importante per te avere almeno 3 supermercati nelle vicinanze? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Scuole",
        questions: [
            {
                label: "proximity_scuole",
                question: "Quanto è importante per te avere una scuola nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_scuole",
                question: "Quanto è importante per te avere almeno 2 scuole nelle vicinanze? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Parcheggi",
        questions: [
            {
                label: "proximity_parcheggi",
                question: "Quanto è importante per te avere un parcheggio pubblico nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_parcheggi",
                question: "Quanto è importante per te la disponibilità di più parcheggi pubblici nelle vicinanze (almeno 2 diversi)? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Bar e Ristoranti",
        questions: [
            {
                label: "proximity_bar_ristoranti",
                question: "Quanto è importante per te avere bar e ristoranti nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_bar_ristoranti",
                question: "Quanto è importante per te che ci sia una buona varietà di bar e ristoranti (almeno 5 diversi) nelle vicinanze? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Biblioteche",
        questions: [
            {
                label: "proximity_biblioteche",
                question: "Quanto è importante per te avere una biblioteca nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_biblioteche",
                question: "Quanto è importante per te avere una buona varietà di biblioteche (almeno 3 diverse)? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Farmacie",
        questions: [
            {
                label: "proximity_farmacie",
                question: "Quanto è importante per te avere una farmacia nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_farmacie",
                question: "Quanto è importante per te avere almeno 2 farmacie nelle vicinanze? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Palestre",
        questions: [
            {
                label: "proximity_palestre",
                question: "Quanto è importante per te avere una palestra facilmente accessibile? (da 1 a 5)"
            },
            {
                label: "quantity_palestre",
                question: "Quanto è importante per te avere almeno 2 palestre nelle vicinanze? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Parchi e Giardini",
        questions: [
            {
                label: "proximity_parchi_e_giardini",
                question: "Quanto è importante per te avere un parco o giardino pubblico nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_parchi_e_giardini",
                question: "Quanto è importante per te avere più parchi o giardini pubblici (almeno 2) nelle vicinanze? (da 1 a 5)"
            }
        ]
    },
    {
        category: "Strutture Sanitarie",
        questions: [
            {
                label: "proximity_strutture_sanitarie",
                question: "Quanto è importante per te avere una struttura sanitaria (ospedale, clinica) vicina? (da 1 a 5)"
            },
            {
                label: "quantity_strutture_sanitarie",
                question: "Quanto è importante per te avere accesso ad almeno 2 strutture sanitarie (ospedali, cliniche specialistiche, ecc.) nelle vicinanze? (da 1 a 5)"
            }
        ]
    }
];


export default function Page() {
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});


    const session = useSession();
    const user = session.data?.user as user;


    const handleSubmit = (e: any) => {
        e.preventDefault();
        alert(`You chose ${JSON.stringify(answers)}`);
        alert(`User: ${ JSON.stringify(user) }`);
    };

    return (
        <Container>
            <h1>Survey</h1>
            <Form onSubmit={handleSubmit}>
                {surveyQuestions.map((category, catIndex) => (
                    <div className="m-3" key={catIndex}>
                        <h4 style={{textAlign: "center"}}>{category.category}</h4>
                        <Row style={{flexDirection: "column", alignItems: "center"}}>
                            {category.questions.map(({label, question}, qIndex) => (
                                <Card className="m-2 col-xl-8" key={qIndex}>
                                    <Card.Body style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                                        <p style={{width: "100%"}}>{question}</p>
                                        <FormGroupWithCheckboxes
                                            name={`${label}`}
                                            labels={["1", "2", "3", "4", "5"]}
                                            answers={answers}
                                            setAnswers={setAnswers}
                                        />
                                    </Card.Body>
                                </Card>
                            ))}
                        </Row>
                    </div>
                ))}
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    );
}