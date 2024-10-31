import {
    boolean,
    customType,
    date,
    doublePrecision,
    geometry,
    integer,
    numeric,
    pgTable,
    primaryKey,
    smallint,
    text
} from 'drizzle-orm/pg-core';
import c from 'wkx';


interface PostgisGeometryConfig {
    type: string;
    srid?: number;
}

const postgisGeometry = customType<{ data: string; }>(
    {
        dataType(config) {
            let config_casted = config as PostgisGeometryConfig;
            return config_casted.srid ? `geometry(${config_casted.type}, ${config_casted.srid})` : `geometry(${config_casted.type})`;
        },

        fromDriver(value: any) {
            const buffer = Buffer.from(value, "hex");
            return c.Geometry.parse(buffer).toGeoJSON({shortCrs: true}) as any;
        },
        toDriver(value: any) {
            return c.Geometry.parseGeoJSON(value).toWkb().toString("hex");
        }
    }
);


export const user = pgTable('user', {
    email: text('email').notNull().primaryKey(),
    password: text('password').notNull(),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
});

export const quartieri = pgTable('quartieri', {
    codice_quartiere: numeric('codice_quartiere').notNull().primaryKey(),
    quartiere: text('quartiere').notNull().unique(),
    geo_shape: postgisGeometry('geo_shape', {type: "Polygon", srid: 4326}).notNull(),
});

export const zone_urbanistiche = pgTable('zone_urbanistiche', {
    zona_di_prossimita: text('zona_di_prossimita').primaryKey(),
    nome_quartiere: text('nome_quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    codice_quartiere: numeric('codice_quartiere').notNull(),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
    geo_shape: postgisGeometry('geo_shape', {type: "Polygon"}).notNull(),
    area: doublePrecision('area').notNull()
});

export const indirizzi = pgTable('indirizzi', {
    civ_key: text('civ_key').notNull().primaryKey(),
    indirizzo: text('indirizzo').notNull(),
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});


export const teatri_cinema = pgTable('teatri_cinema', {
    civ_key: text('civ_key').primaryKey().references(() => indirizzi.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
    indirizzo: text('indirizzo').notNull(),
    nome: text('nome').notNull(),
    fonte: text('fonte').notNull(),
    tipologia: text('tipologia').notNull(),
    link: text('link').notNull(),
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
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
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    attivita_secondaria: text('attivita_secondaria'),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});

export const biblioteche = pgTable('biblioteche', {
    codice: integer('codice').primaryKey(),
    nome: text('nome').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: geometry('geo_point', {srid: 4326, type: 'Point'}).notNull()
});

export const farmacie = pgTable('farmacie', {
    civ_key: text('civ_key').primaryKey().references(() => indirizzi.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    farmacia: text('farmacia').notNull(),
    indirizzo: text('indirizzo').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});

export const palestre = pgTable('palestre', {
    codice: integer('codice').primaryKey(),
    nome: text('nome').notNull(),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
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
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});

export const parchi_e_giardini = pgTable('parchi_e_giardini', {
    codice: integer('codice').primaryKey(),
    denominazione: text('denominazione').notNull(),
    tipologia: text('tipologia').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});

export const scuole = pgTable('scuole', {
    civ_key: text('civ_key').primaryKey().references(() => indirizzi.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    nome: text('nome').notNull(),
    servizio: text('servizio').notNull(),
    gestione: text('gestione').notNull(),
    istituzione_scolastica: text('istituzione_scolastica').notNull(),
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    indirizzo: text('indirizzo').notNull(),
    numero_civico: text('numero_civico').notNull(),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});

export const strutture_sanitarie = pgTable('strutture_sanitarie', {
    civ_key: text('civ_key').primaryKey().references(() => indirizzi.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    denominazione_struttura: text('denominazione_struttura').notNull(),
    tipologia: text('tipologia').notNull(),
    titolarita: text('titolarita'),
    indirizzo: text('indirizzo').notNull(),
    numero_civico: text('numero_civico').notNull(),
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});

export const supermercati = pgTable('supermercati', {
    codice: integer('codice').primaryKey(),
    nome: text('nome').notNull(),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
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
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});

export const prezzi_agenzia_entrate = pgTable('prezzi_agenzia_entrate', {
    codice: text('codice').primaryKey(),
    prezzo_min: integer('prezzo_min'),
    prezzo_max: integer('prezzo_max'),
    geo_shape: postgisGeometry('geo_shape', {type: "MultiPolygon", srid: 4326}).notNull(),
});

export const immobili = pgTable('immobili', {
    civ_key: text('civ_key').notNull().primaryKey(),
    indirizzo: text('indirizzo').notNull(),
    quartiere: text('quartiere').references(() => quartieri.quartiere, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    zona_di_prossimita: text('zona_di_prossimita').references(() => zone_urbanistiche.zona_di_prossimita, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
    superficie: integer('superficie').notNull(),
    piano: integer('piano').notNull(),
    ascensore: boolean('ascensore').notNull(),
    stato_immobile: text('stato_immobile').notNull(),
    stato_finiture_esterne: text('stato_finiture_esterne').notNull(),
    eta_costruzione: smallint('eta_costruzione').notNull(),
    classe_energetica: text('classe_energetica').notNull(),
    prezzo: integer('prezzo').notNull(),
});

export const user_preferences = pgTable('user_preferences', {
    email: text('email').notNull().references(() => user.email, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    proximity_bar_ristoranti: smallint('proximity_bar_ristoranti').notNull(),
    proximity_biblioteche: smallint('proximity_biblioteche').notNull(),
    proximity_farmacie: smallint('proximity_farmacie').notNull(),
    proximity_fermate_autobus: smallint('proximity_fermate_autobus').notNull(),
    proximity_palestre: smallint('proximity_palestre').notNull(),
    proximity_parcheggi: smallint('proximity_parcheggi').notNull(),
    proximity_parchi_e_giardini: smallint('proximity_parchi_e_giardini').notNull(),
    proximity_scuole: smallint('proximity_scuole').notNull(),
    proximity_strutture_sanitarie: smallint('proximity_strutture_sanitarie').notNull(),
    proximity_supermercati: smallint('proximity_supermercati').notNull(),
    proximity_teatri_cinema: smallint('proximity_teatri_cinema').notNull(),
    quantity_bar_ristoranti: smallint('quantity_bar_ristoranti').notNull(),
    quantity_biblioteche: smallint('quantity_biblioteche').notNull(),
    quantity_farmacie: smallint('quantity_farmacie').notNull(),
    quantity_fermate_autobus: smallint('quantity_fermate_autobus').notNull(),
    quantity_palestre: smallint('quantity_palestre').notNull(),
    quantity_parcheggi: smallint('quantity_parcheggi').notNull(),
    quantity_parchi_e_giardini: smallint('quantity_parchi_e_giardini').notNull(),
    quantity_scuole: smallint('quantity_scuole').notNull(),
    quantity_strutture_sanitarie: smallint('quantity_strutture_sanitarie').notNull(),
    quantity_supermercati: smallint('quantity_supermercati').notNull(),
    quantity_teatri_cinema: smallint('quantity_teatri_cinema').notNull()
});

export const distance_from_immobili_to_bar_ristoranti = pgTable('distance_from_immobili_to_bar_ristoranti', {
        immobili: text('immobili').notNull().references(() => immobili.civ_key, {
            onDelete: 'cascade',
            onUpdate: 'cascade'
        }),
        bar_ristoranti: integer('bar_ristoranti').notNull().references(() => bar_ristoranti.codice, {
            onDelete: 'cascade',
            onUpdate: 'cascade'
        }),
        distance: doublePrecision('distance').notNull(),
    }, (table) => {
        return {
            pk: primaryKey({columns: [table.immobili, table.bar_ristoranti]}),
        }
    }
);

export const distance_from_immobili_to_biblioteche = pgTable('distance_from_immobili_to_biblioteche', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    biblioteche: integer('biblioteche').notNull().references(() => biblioteche.codice, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.biblioteche]}),
    }
});

export const distance_from_immobili_to_farmacie = pgTable('distance_from_immobili_to_farmacie', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    farmacie: text('farmacie').notNull().references(() => farmacie.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.farmacie]}),
    }
});

export const distance_from_immobili_to_fermate_autobus = pgTable('distance_from_immobili_to_fermate_autobus', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    fermate_autobus: integer('fermate_autobus').notNull().references(() => fermate_autobus.codice, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.fermate_autobus]}),
    }

});

export const distance_from_immobili_to_palestre = pgTable('distance_from_immobili_to_palestre', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    palestre: integer('palestre').notNull().references(() => palestre.codice, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.palestre]}),
    }
});

export const distance_from_immobili_to_parcheggi = pgTable('distance_from_immobili_to_parcheggi', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    parcheggi: integer('parcheggi').notNull().references(() => parcheggi.codice, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.parcheggi]}),
    }
});

export const distance_from_immobili_to_parchi_e_giardini = pgTable('distance_from_immobili_to_parchi_e_giardini', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    parchi_e_giardini: integer('parchi_e_giardini').notNull().references(() => parchi_e_giardini.codice, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.parchi_e_giardini]}),
    }
});

export const distance_from_immobili_to_scuole = pgTable('distance_from_immobili_to_scuole', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    scuole: text('scuole').notNull().references(() => scuole.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.scuole]}),
    }
});

export const distance_from_immobili_to_strutture_sanitarie = pgTable('distance_from_immobili_to_strutture_sanitarie', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    strutture_sanitarie: text('strutture_sanitarie').notNull().references(() => strutture_sanitarie.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.strutture_sanitarie]}),
    }
});

export const distance_from_immobili_to_supermercati = pgTable('distance_from_immobili_to_supermercati', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    supermercati: integer('supermercati').notNull().references(() => supermercati.codice, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.supermercati]}),
    }
});

export const distance_from_immobili_to_teatri_cinema = pgTable('distance_from_immobili_to_teatri_cinema', {
    immobili: text('immobili').notNull().references(() => immobili.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    teatri_cinema: text('teatri_cinema').notNull().references(() => teatri_cinema.civ_key, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    distance: doublePrecision('distance').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.immobili, table.teatri_cinema]}),
    }
});

export const equidistant_points = pgTable('equidistant_points', {
    codice: integer('codice').primaryKey(),
    geo_point: postgisGeometry('geo_point', {type: "Point", srid: 4326}).notNull(),
});







