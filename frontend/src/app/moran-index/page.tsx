"use client"
import React, {useEffect, useState} from "react";
import {fermate_autobus, immobile} from "@/lib/definitions";
import {getAllImmobili} from "@/queries/immobili";
import {MDBContainer, MDBRow} from "mdb-react-ui-kit";
import * as turf from "@turf/turf";
import {round} from "@turf/turf";
import {MathJax, MathJaxContext} from "better-react-mathjax";
import {getAllFermateAutobus} from "@/queries/fermate_autobus";

const RANGE = 500;

interface moranIndex {
    moranIndex: number;
    expectedMoranIndex: number;
    stdNorm: number;
    zNorm: number;
}

/**
 * Calculates Moran's I index for a given set of features.
 * @param {any[]} feature - Array of features to calculate Moran's I.
 * @param {string} inputField - The field in the feature to be used for calculation.
 * @returns {number} - The calculated Moran's I index.
 */
function getMoransI(feature: any[], inputField: string): moranIndex {
    const points = feature.map(i => turf.point(i.geo_point.coordinates, {...i}));
    const featureCollection = turf.featureCollection(points);

    return turf.moranIndex(featureCollection, {
        inputField: inputField,
        standardization: false,
        threshold: turf.lengthToDegrees(RANGE, 'meters'),
        binary: true
    });
}

/**
 * Provides a textual interpretation of Moran's I index.
 * @param {number} index - The calculated Moran's I index.
 * @returns {string} - A description of the Moran's I index.
 */
function commentMoransI(index: number): string {
    if (index > 0.5) {
        return "L'indice di Moran è molto vicino a 1, ciò indica che i valori simili sono raggruppati geograficamente.";
    } else if (index < -0.5) {
        return "L'indice di Moran è molto vicino a -1, ciò indica che valori diversi tendono a essere vicini tra loro.";
    } else {
        return "L'indice di Moran è molto vicino a 0, ciò indica che i valori sono distribuiti in modo casuale.";
    }
}


export default function Page() {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [fermateAutobus, setFermateAutobus] = useState<fermate_autobus[]>([]);
    const [moranIndexImmobili, setMoranIndexImmobili] = useState<moranIndex>({
        moranIndex: 0,
        expectedMoranIndex: 0,
        stdNorm: 0,
        zNorm: 0
    });
    const [moranIndexFermateAutobus, setMoranIndexFermateAutobus] = useState<moranIndex>({
        moranIndex: 0,
        expectedMoranIndex: 0,
        stdNorm: 0,
        zNorm: 0
    });

    // Fetch data for immobili and fermate_autobus on component mount
    useEffect(() => {
        getAllImmobili({orderByRank: false}).then(setImmobili).catch(console.error);
        getAllFermateAutobus().then(setFermateAutobus).catch(console.error);
    }, []);

    // Calculate Moran's I index for immobili when immobili data changes
    useEffect(() => {
        setMoranIndexImmobili(getMoransI(immobili, "prezzo"));
    }, [immobili]);

    // Calculate Moran's I index for fermate_autobus when fermate_autobus data changes
    useEffect(() => {
        setMoranIndexFermateAutobus(getMoransI(fermateAutobus, "numero_linee"));
    }, [fermateAutobus]);

    return (
        <MathJaxContext>
            <MDBContainer style={{marginBottom: "2em"}}>
                <MDBRow>
                    <h1 style={{marginTop: "25px"}}>Moran Index</h1>
                </MDBRow>
                <MDBRow>
                    <p>
                        L&apos;indice di Moran (Moran&apos;s I) è una misura statistica utilizzata per rilevare
                        l&apos;autocorrelazione
                        spaziale, ossia il grado in cui una variabile è simile in punti vicini dello spazio geografico.
                        In
                        altre parole, verifica se i valori di una variabile osservata in una regione geografica sono più
                        simili a quelli delle regioni adiacenti rispetto a quanto ci si aspetterebbe in base al caso.
                    </p>
                    <p>
                        L&apos;indice può assumere valori che variano da -1 a 1:
                    </p>
                    <ul>
                        <li>
                            Un valore vicino a 1 indica un&apos;elevata autocorrelazione spaziale positiva, cioè che i
                            valori
                            simili sono raggruppati geograficamente.
                        </li>
                        <li>
                            Un valore vicino a -1 indica una forte autocorrelazione spaziale negativa, cioè che valori
                            diversi tendono a essere vicini tra loro.
                        </li>
                        <li>
                            Un valore vicino a 0 indica l&apos;assenza di autocorrelazione spaziale, ovvero una
                            distribuzione
                            casuale.
                        </li>
                    </ul>
                </MDBRow>
                <MDBRow>
                    <h3>Formula dell&apos;Indice di Moran</h3>
                </MDBRow>
                <MDBRow>
                    <MathJax>{"\\[I = \\frac{N}{W} \\frac{\\sum_{i} \\sum_{j} W_{ij} (X_i - \\bar{X}) (X_j - \\bar{X})}{\\sum_{i} (X_i - \\bar{X})^2}\\]"}</MathJax>
                    <p>
                        Dove:
                    </p>
                    <ul>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\( N \\)"}</MathJax> è il numero delle unità
                            spaziali (ossia, il numero di aree o
                            regioni considerate
                            nello studio);
                        </li>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\( x_i \\)"}</MathJax> rappresenta il valore della
                            variabile di interesse
                            nell&apos;unità spaziale <MathJax style={{display: "contents"}}>{"\\( i \\)"}</MathJax>;
                        </li>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\(\\bar{x}\\)"}</MathJax> è la media dei valori
                            della
                            variabile <MathJax style={{display: "contents"}}>{"\\( x \\)"}</MathJax>;
                        </li>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\( w_{ij} \\)"}</MathJax> rappresenta un elemento
                            della matrice dei pesi spaziali, che definisce la relazione tra l&apos;unità
                            spaziale <MathJax
                            style={{display: "contents"}}>{"\\( i \\)"}</MathJax> e l&apos;unità spaziale <MathJax
                            style={{display: "contents"}}>{"\\( j \\)"}</MathJax>. In altre parole, il
                            peso <MathJax style={{display: "contents"}}>{"\\( w_{ij} \\)"}</MathJax> indica quanto
                            l&apos;unità <MathJax style={{display: "contents"}}>{"\\( j \\)"}</MathJax> influenza
                            l&apos;unità <MathJax style={{display: "contents"}}>{"\\( i \\)"}</MathJax>. In
                            genere, <MathJax style={{display: "contents"}}>{"\\( w_{ii} = 0 \\)"}</MathJax>, poiché
                            un&apos;unità non ha influenza su se stessa;
                        </li>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\( W \\)"}</MathJax> è la somma di tutti gli
                            elementi <MathJax style={{display: "contents"}}>{"\\( w_{ij} \\)"}</MathJax>, ossia:
                            <MathJax>{"\\[W = \\sum_{i = 1}^{N} \\sum_{j = 1}^{N} w_{ij}\\]"}</MathJax>
                        </li>
                    </ul>
                </MDBRow>
                <MDBRow>
                    <h3>Indice di Moran sul prezzo degli immobili</h3>
                </MDBRow>
                <p>
                    È stato calcolato l&apos;indice di Moran sui prezzi degli immobili presenti nel database. Di seguito
                    sono
                    riportati i risultati del calcolo.
                </p>
                <ul>
                    <li>
                        <MathJax style={{display: "contents"}}>{"\\(I\\)"}</MathJax>: il valore dell&apos;indice di
                        Moran
                        calcolato: <MathJax
                        style={{display: "contents"}}>{"\\(" + round(moranIndexImmobili.moranIndex, 4) + "\\)"}</MathJax>
                    </li>
                    <li>
                        <MathJax style={{display: "contents"}}>{"\\(E[I]\\)"}</MathJax>: il valore atteso
                        dell&apos;indice di
                        Moran: <MathJax
                        style={{display: "contents"}}>{"\\(" + round(moranIndexImmobili.expectedMoranIndex, 4) + "\\)"}</MathJax>
                    </li>
                    <li>
                        <MathJax style={{display: "contents"}}>{"\\(Z\\)"}</MathJax>: il valore normalizzato
                        standard: <MathJax
                        style={{display: "contents"}}>{"\\(" + round(moranIndexImmobili.zNorm, 4) + "\\)"}</MathJax>
                    </li>
                    <li>
                        <MathJax style={{display: "contents"}}>{"\\(Z\\)"}</MathJax>: il valore normalizzato
                        standard: <MathJax
                        style={{display: "contents"}}>{"\\(" + round(moranIndexImmobili.stdNorm, 4) + "\\)"}</MathJax>
                    </li>
                </ul>
                <p>
                    {commentMoransI(moranIndexImmobili.moranIndex)}
                </p>
                <MDBRow>
                    <h3>Indice di Moran sul numero di fermate degli autobus</h3>
                </MDBRow>
                <MDBRow>
                    <p>
                        È stato calcolato l&apos;indice di Moran sul numero di linee di autobus presenti nel database.
                        Di
                        seguito
                        sono riportati i risultati del calcolo.
                    </p>
                    <ul>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\(I\\)"}</MathJax>: il valore dell&apos;indice di
                            Moran
                            calcolato: <MathJax
                            style={{display: "contents"}}>{"\\(" + round(moranIndexFermateAutobus.moranIndex, 4) + "\\)"}</MathJax>
                        </li>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\(E[I]\\)"}</MathJax>: il valore atteso
                            dell&apos;indice di
                            Moran: <MathJax
                            style={{display: "contents"}}>{"\\(" + round(moranIndexFermateAutobus.expectedMoranIndex, 4) + "\\)"}</MathJax>
                        </li>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\(Z\\)"}</MathJax>: il valore normalizzato
                            standard: <MathJax
                            style={{display: "contents"}}>{"\\(" + round(moranIndexFermateAutobus.zNorm, 4) + "\\)"}</MathJax>
                        </li>
                        <li>
                            <MathJax style={{display: "contents"}}>{"\\(Z\\)"}</MathJax>: il valore normalizzato
                            standard: <MathJax
                            style={{display: "contents"}}>{"\\(" + round(moranIndexFermateAutobus.stdNorm, 4) + "\\)"}</MathJax>
                        </li>
                    </ul>
                    <p style={{marginBottom: "10em"}}>
                        {commentMoransI(moranIndexFermateAutobus.moranIndex)}
                    </p>
                </MDBRow>
            </MDBContainer>
        </MathJaxContext>
    )
}