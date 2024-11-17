"use client"
import {Col, FormCheck, FormGroup} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import React from "react";

/**
 * Props for the FormGroupWithCheckboxes component.
 */
interface FormGroupWithCheckboxesProps {
    name: string; // The name attribute for the form group.
    labels: string[]; // Array of labels for the checkboxes.
    answers: { [key: string]: number }; // Object containing the answers.
    setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>; // Function to update the answers.
}

/**
 * FormGroupWithCheckboxes component renders a group of checkboxes with labels.
 *
 * @param {FormGroupWithCheckboxesProps} props - The props for the component.
 */
export function FormGroupWithCheckboxes({name, labels, answers, setAnswers}: FormGroupWithCheckboxesProps) {
    /**
     * Handles the change event for the checkboxes.
     *
     * @param {number} label - The index of the selected label.
     */
    const handleChange = (label: number) => {
        setAnswers(prev => ({...prev, [name]: label}));
    };

    return (
        <FormGroup className={"align-items-center flex-sm-row"} style={{display: "flex", flexDirection: "column"}}>
            <Col style={{width: "fit-content"}}>
                <p>Per nulla importante</p>
            </Col>
            {labels.map((label, index) => (
                <Col key={index} className="d-flex flex-sm-column align-items-center p-3"
                     style={{width: "fit-content"}}>
                    <FormCheckLabel className="control-label" htmlFor={`${name}-${index}`}>{label}</FormCheckLabel>
                    <FormCheck required={true} type="radio" id={`${name}-${index}`} name={name}
                               checked={answers[name] === index}
                               onChange={() => handleChange(index)}/>
                </Col>
            ))}
            <p>Estremamente<br/>importante</p>
        </FormGroup>
    );
}