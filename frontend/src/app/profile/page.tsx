"use client"
import {user} from '@/lib/definitions';
import {Form} from "react-bootstrap";
import {handleSignOut} from '@/lib/actions';
import {useEffect, useState} from "react";
import {useSessionData} from "@/lib/useSessionData";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";


export default function Home() {
    const [user, setUser] = useState<user>();
    const session = useSessionData();

    useEffect(() => {
        if (session.status === "authenticated") {
            setUser(session?.data?.user);
        }
    }, [session]);

    return (
        user &&
        <section style={{backgroundColor: '#eee', height: '-webkit-fill-available'}}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol>
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                     alt="avatar"
                                     className="rounded-circle img-fluid" style={{width: '150px'}}/>
                                <h5 className="my-3">{user.first_name + ' ' + user.last_name}</h5>
                                <div className="d-flex justify-content-center mb-2">
                                    <MDBBtn color="primary" href="/survey">
                                        Questionario
                                    </MDBBtn>
                                    <MDBBtn outline color="primary" className="ms-1" href="/recommended-properties">
                                        Immobili consigliati
                                    </MDBBtn>
                                    <MDBBtn outline color="primary" className="ms-1" href="/recommended-zones">
                                        Zone consigliate
                                    </MDBBtn>
                                    <MDBBtn outline color="primary" className="ms-1" href="/recommended-positions">
                                        Posizioni consigliate
                                    </MDBBtn>
                                    <Form action={handleSignOut}>
                                        <MDBBtn type="submit" outline color="primary" className="ms-1">
                                            Logout
                                        </MDBBtn>
                                    </Form>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <p className="mb-0">Nome</p>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <p className="mb-0">{user.first_name + ' ' + user.last_name}</p>
                                    </MDBCol>
                                </MDBRow>
                                <hr/>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <p className="mb-0">Email</p>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <p className="mb-0">{user.email}</p>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}