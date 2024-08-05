import {GeoJSON, Geometry, Point} from "geojson";

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
    geo_point: GeoJSON;
    geo_shape: GeoJSON;
    area: number;
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
}