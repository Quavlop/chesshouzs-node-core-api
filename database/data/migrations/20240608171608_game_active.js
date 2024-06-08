/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function(knex) {
    return knex.schema.createTable("game_active", table => {
        table.uuid('id').notNullable().unique().defaultTo(knex.fn.uuid());
        table.uuid('white_player_id').notNullable();
        table.uuid('black_player_id').notNullable();
        table.uuid('game_type_variant_id').notNullable();
        table.string('moves_cache_ref').nullable(); // redis hash
        table.string('moves').nullable();
        table.boolean('is_done').defaultTo(false);
        table.uuid('winner_player_id').nullable(); // if draw then "-", else winner_id

        table.timestamp('start_time').defaultTo(knex.fn.now());
        table.timestamp('end_time').defaultTo(null);    

        table.foreign('white_player_id').references('users.id').onDelete(null);
        table.foreign('black_player_id').references('users.id').onDelete(null);
        table.foreign('game_type_variant_id').references('game_type_variant.id').onDelete(null);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.dropTableIfExists('game_active');
};
