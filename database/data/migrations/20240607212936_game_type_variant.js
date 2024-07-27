/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function(knex) {
    return knex.schema.createTable("game_type_variant", table => {
        table.uuid('id').primary().notNullable().unique().defaultTo(knex.fn.uuid());
        table.uuid('game_type_id').notNullable();
        table.integer('duration').notNullable();
        table.integer('increment').notNullable().defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());        

        table.foreign('game_type_id').references('game_type.id').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.dropTableIfExists('game_type_variant');
};
