/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = knex => knex.schema.createTable('cadastrar_recomendacao_posto', table =>{
    table.increments('recomendacao_posto_id')
    table.integer('posto_id').references('cadastrar_postogasolina.posto_id').notNullable()
    table.integer('user_id').references('cadastrar_usuarios.user_id').notNullable()
    table.text('descricao').notNullable()
    table.double('valor').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable('cadastrar_recomendacao_posto'); 