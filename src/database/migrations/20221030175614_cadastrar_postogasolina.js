/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = knex => knex.schema.createTable('cadastrar_postogasolina', table =>{
    table.increments('posto_id')
    table.text('nome_posto').notNullable()
    table.text('email').notNullable()
    table.text('senha').notNullable()
    table.text('cpf_cnpj').notNullable()
    table.text('telefone').notNullable()
    table.text('endereco').notNullable()
    table.text('lat-long').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable('cadastrar_postogasolina'); 