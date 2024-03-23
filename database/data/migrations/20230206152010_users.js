/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function(knex) {
    return knex.schema.createTable("users", table => {
        table.uuid('id').notNullable().unique();
        table.string('username').notNullable();
        table.string('email').notNullable().unique();
        table.string('profile_picture').nullable();
        table.boolean('is_premium').defaultTo(false);
        table.integer('elo_points').defaultTo(0);
        table.string('password').nullable();
        table.string('google_id').nullable();
        table.dateTime('email_verified_at').nullable().defaultTo(null);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTableIfExists('users');
};
