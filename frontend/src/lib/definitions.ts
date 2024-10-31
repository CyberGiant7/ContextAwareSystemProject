import {Point, Polygon} from "geojson";

export interface user {
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
}

export interface zona_urbanistica {
    zona_di_prossimita: string;
    nome_quartiere: string;
    codice_quartiere: string;
    geo_point: Point;
    geo_shape: Polygon;
    area: number;
    rank?: number;
}

export interface bar_ristoranti {
    codice: string;
    tipologia: string;
    inizio_attivita: Date;
    ubicazione: string;
    quartiere: string;
    zona_di_prossimita: string;
    attivita_secondaria?: string;
    geo_point: Point;
}

export interface biblioteche {
    codice: number;
    nome: string;
    zona_di_prossimita: string;
    quartiere: string;
    geo_point: Point;
}

export interface farmacie {
    civ_key: string;
    farmacia: string;
    indirizzo: string;
    zona_di_prossimita: string;
    geo_point: Point;
}

export interface fermate_autobus {
    codice: number;
    denominazione: string;
    numero_linee: number;
    ubicazione: string;
    quartiere: string;
    zona_di_prossimita: string;
    geo_point: Point;
}

export interface immobile {
    civ_key: string;
    indirizzo: string;
    quartiere: string
    zona_di_prossimita: string
    geo_point: Point;
    superficie: number;
    piano: number;
    ascensore: boolean;
    stato_immobile: string;
    stato_finiture_esterne: string;
    eta_costruzione: number;
    classe_energetica: string;
    prezzo: number;
    rank?: number;
}

export interface palestre {
    codice: number;
    nome: string;
    geo_point: Point;
    zona_di_prossimita: string
}

export interface parcheggi {
    codice: number;
    denominazione: string;
    tipologia: string;
    numero_posti: number;
    tariffa: string;
    zona_di_prossimita: string;
    geo_point: Point;
}

export interface parchi_e_giardini {
    codice: number;
    denominazione: string;
    tipologia: string;
    geo_point: Point;
}

export interface scuole {
    civ_key: string;
    nome: string;
    servizio: string;
    gestione: string;
    istituzione_scolastica: string;
    quartiere: string;
    indirizzo: string;
    numero_civico: string;
    geo_point: Point;
}

export interface strutture_sanitarie {
    civ_key: string;
    denominazione_struttura: string;
    tipologia: string;
    titolarita?: string;
    indirizzo: string;
    numero_civico: string;
    quartiere: string;
    zona_di_prossimita: string;
    geo_point: Point;
}

export interface supermercati {
    codice: number;
    nome: string;
    quartiere: string;
    zona_di_prossimita: string;
    geo_point: Point;
}

export interface teatri_cinema {
    civ_key: string;
    geo_point: Point;
    indirizzo: string;
    nome: string;
    fonte: string;
    tipologia: string;
    link: string;
    quartiere: string;
    zona_di_prossimita: string;
}

export interface user_preferences {
    email: string;
    proximity_bar_ristoranti: number;
    proximity_biblioteche: number;
    proximity_farmacie: number;
    proximity_fermate_autobus: number;
    proximity_palestre: number;
    proximity_parcheggi: number;
    proximity_parchi_e_giardini: number;
    proximity_scuole: number;
    proximity_strutture_sanitarie: number;
    proximity_supermercati: number;
    proximity_teatri_cinema: number;
    quantity_bar_ristoranti: number;
    quantity_biblioteche: number;
    quantity_farmacie: number;
    quantity_fermate_autobus: number;
    quantity_palestre: number;
    quantity_parcheggi: number;
    quantity_parchi_e_giardini: number;
    quantity_scuole: number;
    quantity_strutture_sanitarie: number;
    quantity_supermercati: number;
    quantity_teatri_cinema: number;
}

export interface equidistant_points {
    codice: number;
    geo_point: Point;
    rank?: number;
}