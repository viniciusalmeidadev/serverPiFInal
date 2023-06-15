/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable('publicante_noticia', table =>{
    table.increments('publicante_id')
    table.text('nome').notNullable()
    table.text('urlImagem')
    table.text('temFoto')
    table.text('descricao')
    table.text('site')
    table.text('numero_contato')
    table.text('email_contato')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = knex => knex.schema.dropTable('publicante_noticia'); 