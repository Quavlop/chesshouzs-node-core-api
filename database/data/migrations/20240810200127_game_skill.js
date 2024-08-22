/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return knex.schema.createTable('game_skill', table => {
        table.uuid('id').primary().notNullable().unique().defaultTo(knex.fn.uuid());
        table.string('name').notNullable();
        table.text('description').notNullable();
        table.boolean('for_self').notNullable();
        table.boolean('for_enemy').notNullable();
        table.integer('radius_x').notNullable();
        table.integer('radius_y').notNullable();
        table.boolean('auto_trigger').notNullable();
        table.integer('duration').notNullable();
        table.integer('usage_count').notNullable();
        table.integer('row_limit').nullable();
        table.integer('col_limit').nullable();
        table.string('type').nullable(); // buff / debuff
        table.boolean('permanent').nullable().defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.dropTableIfExists('game_skill');
};
