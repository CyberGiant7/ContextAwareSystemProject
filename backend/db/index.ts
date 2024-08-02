
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

// for query purposes
export const queryClient = postgres(process.env.DATABASE_URL as string);
const db = drizzle(queryClient, {schema});

export {db};