import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user", (table) => {
      table.string("email").unique().notNullable().primary;
      table.string("name").notNullable();
      table.string("password").notNullable();
    });
  }
  
  export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user");
  }