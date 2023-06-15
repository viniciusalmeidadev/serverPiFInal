/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable('noticias', table =>{
    table.increments('noticia_id')
    table.text('titulo').notNullable()
    table.text('conteudo')
    table.text('urlBanner')
    table.text('temFoto')
    table.text('visualizacoes')
    table.text('likes')
    table.integer('publicante_id').references('publicante_noticia.publicante_id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = knex => knex.schema.dropTable('noticias'); 
