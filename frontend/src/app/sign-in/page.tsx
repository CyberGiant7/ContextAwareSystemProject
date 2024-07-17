"use client";
import Login from "@/components/LoginComponent";
import {Container} from "react-bootstrap";

export default function Page() {
    return (
        <Container style={
            {
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",

            }
        }>
            <Login/>
        </Container>
    );
}