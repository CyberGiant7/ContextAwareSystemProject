import {pgTable, text} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    email: text('email').notNull().primaryKey(),
    password: text('password').notNull(),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
});
