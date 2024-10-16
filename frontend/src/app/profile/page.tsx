import {auth, signOut} from '@/auth';
import {user} from '@/lib/definitions';
import {Button, Form} from "react-bootstrap";
import {MDBContainer, MDBRow} from "mdb-react-ui-kit";

const handleSignOut = async () => {
    'use server';
    await signOut();
}

export default async function Home() {
    // get user data
    const session = await auth()

    if (!session) return null
    if (!session.user) return null

    let user = session.user as user;


    return (
        <section style={{backgroundColor: '#eee', height: '-webkit-fill-available'}}>
            <div className="container py-5">
                <div className="row">
                    <div className="card mb-4">
                        <div className="card-body text-center">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                 alt="avatar"
                                 className="rounded-circle img-fluid" style={{width: '150px'}}/>
                            <h5 className="my-3">{user.first_name + ' ' + user.last_name}</h5>
                            <div className="d-flex justify-content-center mb-2">
                                <a href={"/survey"}>
                                    <button type="button" className="btn btn-primary">
                                        Questionario
                                    </button>
                                </a>
                                <a href={"/recommended-properties"}>
                                    <button type="button" className="btn btn-outline-primary ms-1">
                                        Immobili consigliati
                                    </button>
                                </a>
                                <Form action={handleSignOut}>
                                    <Button type={"submit"} className="btn btn-outline-primary ms-1">
                                        Logout
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Nome</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="mb-0">{user.first_name + ' ' + user.last_name}</p>
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Email</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="mb-0">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}