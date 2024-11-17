import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Determine the database URL based on the environment (production or development)
let dbUrl = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DEVELOPMENT_DATABASE_URL;

// Create a query client for PostgreSQL using the determined database URL
export const queryClient = postgres(dbUrl as string);

// Initialize the database connection using drizzle and the query client
const db = drizzle(queryClient, {schema});

// Export the initialized database connection
export {db};