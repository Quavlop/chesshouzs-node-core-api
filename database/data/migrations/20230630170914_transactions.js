/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return knex.schema.createTable("transactions", table => {
        table.string('id').notNullable().unique();
        table.string('order_id').notNullable();
        table.timestamp('date').defaultTo(knex.fn.now());    
        table.string('status').nullable();        
        table.string('type').nullable();
        table.string('account_id').nullable();
        table.bigInteger('amount').nullable();
    
        table.foreign('order_id').references('orders.id').onDelete(null);   
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.dropTableIfExists('transactions');  
};
