/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = knex => knex.schema.createTable('cadastrar_usuarios', table =>{
    table.increments('user_id')
    table.text('nome').notNullable()
    table.text('email').notNullable()
    table.text('senha').notNullable()
    table.text('tipo_usuario').notNullable()
    table.text('sexo')
    table.text('urlImagem')
    table.text('temFoto')
    table.text('cpf_cnpj').notNullable()
    table.text('telefone').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable('cadastrar_usuarios'); 
