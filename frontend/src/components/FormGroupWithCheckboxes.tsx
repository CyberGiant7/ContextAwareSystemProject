// frontend/src/components/FormGroupWithCheckboxes.tsx
"use client"
import {FormGroup, Col, FormCheck} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import React from "react";

interface FormGroupWithCheckboxesProps {
    name: string;
    labels: string[];
    answers: { [key: string]: number };
    setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

export function FormGroupWithCheckboxes({name, labels, answers, setAnswers}: FormGroupWithCheckboxesProps) {
    const handleChange = (label: number) => {
        setAnswers(prev => ({...prev, [name]: label}));
    };

    return (
        <FormGroup className={"align-items-center flex-sm-row"} style={{display: "flex", flexDirection:"column"}}>
            <Col style={{width: "fit-content"}}>
                <p>Per nulla importante</p>
            </Col>
            {labels.map((label, index) => (
                <Col key={index} className="d-flex flex-sm-column align-items-center p-3" style={{width: "fit-content"}}>
                    <FormCheckLabel className="control-label" htmlFor={`${name}-${index}`}>{label}</FormCheckLabel>
                    <FormCheck type="radio" id={`${name}-${index}`} name={name} checked={answers[name] === index}
                               onChange={() => handleChange(index)}/>
                </Col>
            ))}
            <p>Estremamente<br/>importante</p>
        </FormGroup>
    );
}