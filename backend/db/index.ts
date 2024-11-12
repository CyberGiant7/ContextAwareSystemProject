
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let dbUrl = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DEVELOPMENT_DATABASE_URL;

// for query purposes
export const queryClient = postgres(dbUrl as string);
const db = drizzle(queryClient, {schema});

export {db};