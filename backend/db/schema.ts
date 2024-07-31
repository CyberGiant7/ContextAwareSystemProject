import {customType, date, doublePrecision, geometry, integer, numeric, pgTable, text} from 'drizzle-orm/pg-core';
import {sql} from "drizzle-orm";
import c from 'wkx';


const customPolygon = customType<{ data: string; }>(
    {
        dataType() {
            return 'geometry(Polygon)';
        },
        fromDriver(value: any) {
            let t = Buffer.from(value, "hex");
            return c.Geometry.parse(t).toGeoJSON({shortCrs: !0}) as any;
        }
    },
);

const customMultiPolygon = customType<{ data: string; }>(
    {
        dataType() {
            return 'geometry(MultiPolygon)';
        },
        fromDriver(value: any) {
            let t = Buffer.from(value, "hex");
            return c.Geometry.parse(t).toGeoJSON({shortCrs: !0}) as any;
        }
    },
);

export const user = pgTable('user', {
    email: text('email').notNull().primaryKey(),
    password: text('password').notNull(),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
});

export const zone_urbanistiche = pgTable('zone_urbanistiche', {
    zona_di_prossimita: text('zona_di_prossimita').primaryKey(),
    nome_quartiere: text('nome_quartiere').notNull(),
    codice_quartiere: numeric('codice_quartiere').notNull(),
    geo_point: geometry('geo_point').notNull(),
    geo_shape: customPolygon('geo_shape').notNull(),
    area: doublePrecision('area').notNull()
});


export const teatri_cinema = pgTable('teatri_cinema', {
    civ_key: text('civ_key').notNull().primaryKey(),
    geo_point: geometry('geo_point').notNull(),
    indirizzo: text('indirizzo').notNull(),
    nome: text('nome').notNull(),
    fonte: text('fonte').notNull(),
    tipologia: text('tipologia').notNull(),
    link: text('link').notNull(),
    quartiere: text('quartiere').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
});


export const bar_ristoranti = pgTable('bar_ristoranti', {
    codice: integer('codice').primaryKey(),
    tipologia: text('tipologia').notNull(),
    inizio_attivita: date('inizio_attivita').notNull(),
    ubicazione: text('ubicazione').notNull(),
    quartiere: text('quartiere').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    attivita_secondaria: text('attivita_secondaria'),
    geo_point: geometry('geo_point').notNull(),
});

export const biblioteche = pgTable('biblioteche', {
    biblioteca: text('biblioteca').primaryKey(),
    tipologia: text('tipologia').notNull(),
    indirizzo: text('indirizzo').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    quartiere: text('quartiere').notNull(),
    rete_wi_fi: text('rete_wi_fi').notNull(),
    telefono: text('telefono').notNull(),
    email: text('email').notNull(),
    pagina_web: text('pagina_web').notNull(),
    descrizione: text('descrizione').notNull(),
    superficie_totale_mq: integer('superficie_totale_mq').notNull(),
    superficie_accessibile_al_pubblico: integer('superficie_accessibile_al_pubblico').notNull(),
    numero_postazioni_lettura: integer('numero_postazioni_lettura'),
    accessibilita: text('accessibilita').notNull(),
    servizi_igienici: text('servizi_igienici').notNull(),
    aria_condizionata: text('aria_condizionata').notNull(),
    servizio_fotocopie: text('servizio_fotocopie').notNull(),
    area_bambini: text('area_bambini').notNull(),
    geo_point: geometry('geo_point').notNull()
});

export const farmacie = pgTable('farmacie', {
    civ_key: text('civ_key').notNull().primaryKey(),
    farmacia: text('farmacia').notNull(),
    indirizzo: text('indirizzo').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: geometry('geo_point').notNull(),
});

export const palestre = pgTable('palestre', {
    codice: integer('codice').primaryKey(),
    nome: text('nome').notNull(),
    geo_point: geometry('geo_point').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
});

export const parcheggi = pgTable('parcheggi', {
    codice: integer('codice').primaryKey(),
    denominazione: text('denominazione').notNull(),
    tipologia: text('tipologia').notNull(),
    numero_posti: integer('numero_posti').notNull(),
    tariffa: text('tariffa').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: geometry('geo_point').notNull(),
});

export const parchi_e_giardini = pgTable('parchi_e_giardini', {
    codice: integer('codice').primaryKey(),
    denominazione: text('denominazione').notNull(),
    tipologia: text('tipologia').notNull(),
    geo_point: geometry('geo_point').notNull(),
});

export const scuole = pgTable('scuole', {
    civ_key: text('civ_key').notNull().primaryKey(),
    nome: text('nome').notNull(),
    servizio: text('servizio').notNull(),
    gestione: text('gestione').notNull(),
    istituzione_scolastica: text('istituzione_scolastica').notNull(),
    quartiere: text('quartiere').notNull(),
    indirizzo: text('indirizzo').notNull(),
    numero_civico: text('numero_civico').notNull(),
    geo_point: geometry('geo_point').notNull(),
});

export const strutture_sanitarie = pgTable('strutture_sanitarie', {
    civ_key: text('civ_key').primaryKey(),
    denominazione_struttura: text('denominazione_struttura').notNull(),
    tipologia: text('tipologia').notNull(),
    titolarita: text('titolarita'),
    indirizzo: text('indirizzo').notNull(),
    numero_civico: text('numero_civico').notNull(),
    quartiere: text('quartiere').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: geometry('geo_point').notNull(),
});

export const supermercati = pgTable('supermercati', {
    codice: integer('codice').primaryKey(),
    nome: text('nome').notNull(),
    geo_point: geometry('geo_point').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
});

export const fermate_autobus = pgTable('fermate_autobus', {
    codice: integer('codice').primaryKey(),
    denominazione: text('denominazione').notNull(),
    numero_linee: integer('numero_linee').notNull(),
    ubicazione: text('ubicazione').notNull(),
    quartiere: text('quartiere').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: geometry('geo_point').notNull(),
});

export const prezzi_agenzia_entrate = pgTable('prezzi_agenzia_entrate', {
    codice: text('codice').primaryKey(),
    prezzo_min: integer('prezzo_min'),
    prezzo_max: integer('prezzo_max'),
    geo_shape: customMultiPolygon('geo_shape').notNull(),
});
