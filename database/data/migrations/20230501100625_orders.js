/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return knex.schema.createTable("orders", table => {
        table.string('id').notNullable().unique();
        table.uuid('user_id').notNullable();
        table.timestamp('issued_on').defaultTo(knex.fn.now());    
        table.string('description').nullable();
    
        table.foreign('user_id').references('users.id').onDelete(null);   
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.dropTableIfExists('orders');  
};
