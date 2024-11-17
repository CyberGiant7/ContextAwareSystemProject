// frontend/src/app/survey/page.tsx
"use client"

import {Button, Card, Form, Row} from "react-bootstrap";
import {FormGroupWithCheckboxes} from "@/components/FormGroupWithCheckboxes";
import {FormEvent, useEffect, useState} from "react";
import {user, user_preferences} from '@/lib/definitions';
// import { useSession} from "next-auth/react";
import {createUserPreferences, getUserPreferences} from "@/queries/user_preferences";
import {useRouter} from "next/navigation";
import {useSessionData} from "@/lib/useSessionData";
import {MDBContainer, MDBRow} from "mdb-react-ui-kit";

export default function Page() {
    // State to store the answers to the survey questions
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});

    // State to store the user information
    const [user, setUser] = useState<user>();

    // Hook to get the session data
    const session = useSessionData();

    // Hook to navigate programmatically
    const router = useRouter();

    // Effect to set the user state when the session is authenticated
    useEffect(() => {
        if (session.status === "authenticated") {
            setUser(session?.data?.user);
        }
    }, [session]);

    /**
     * Handles the form submission event.
     * @param {FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (!user) {
            alert("User not found"); // Alert if the user is not found
            return;
        }

        // Create a user preferences object with the user's email and answers
        let userPreferences = {
            email: user.email,
            ...answers
        } as user_preferences;

        try {
            // Send the user preferences to the server
            let res = await createUserPreferences(userPreferences);
            if (!res.ok) {
                return; // Return if the response is not ok
            }
            alert("Questionario compilato con successo"); // Alert on successful submission
            router.push("/profile"); // Redirect to the profile page
        } catch (error) {
            console.error('Error creating user preferences:', error); // Log any errors
        }
    };


    useEffect(() => {
        // If the user is authenticated, fetch their preferences
        if (!user) {
            // If no user is found, redirect to the survey page and refresh
            router.push("/survey");
            router.refresh();
            return;
        }

        // Fetch user preferences using the user's email
        getUserPreferences(user.email).then((userPreferences) => {
            if (!userPreferences) {
                return;
            }
            // Iterate over the user preferences and update the answers state
            for (let key in userPreferences) {
                if (key === "email") {
                    continue;
                }
                setAnswers((prev) => ({
                    ...prev,
                    [key]: userPreferences[key as keyof user_preferences] as number
                }));
            }
        });

    }, [user]);

    return (
        <section style={{backgroundColor: '#eee', height: 'fit-content'}}>
            <MDBContainer>
                <MDBRow>
                    <h1 className="text-center py-3">Questionario</h1>
                    <p className="text-center">
                        Compila il seguente questionario per avere una visualizzazione personalizzata degli immobili che
                        ti potrebbero interessare.
                    </p>
                </MDBRow>
                <Form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    {surveyQuestions.map((category, catIndex) => (
                        <div className="m-3 col-10" key={catIndex}>
                            <h4 style={{textAlign: "center"}}>{category.category}</h4>
                            <Row style={{flexDirection: "column", alignItems: "center"}}>
                                {category.questions.map(({label, question}, qIndex) => (
                                    <Card className="m-2 col-xl-8" key={qIndex}>
                                        <Card.Body
                                            style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
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
                    <Button className="my-3 col-4" type="submit">Invia</Button>
                </Form>
            </MDBContainer>
        </section>
    );
}


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
    },
    {
        category: "Teatri e Cinema",
        questions: [
            {
                label: "proximity_teatri_cinema",
                question: "Quanto è importante per te avere un teatro o cinema nelle vicinanze? (da 1 a 5)"
            },
            {
                label: "quantity_teatri_cinema",
                question: "Quanto è importante per te avere almeno 2 teatri o cinema nelle vicinanze? (da 1 a 5)"
            }
        ]
    }
];