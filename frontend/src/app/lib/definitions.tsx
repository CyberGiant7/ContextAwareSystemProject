import {GeoJSON} from "geojson";

export interface User {
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
}

export interface zone_urbanistiche {
    zona_di_prossimita: string;
    nome_quartiere: string;
    codice_quartiere: string;
    geo_point: GeoJSON;
    geo_shape: GeoJSON;
    area: number;
}