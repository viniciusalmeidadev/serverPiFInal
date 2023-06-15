/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable('tipo_categorias_noticias', table =>{
    table.increments('id_categoria')
    table.text('decricao').notNullable()
    table.text('biblioteca')
    table.text('icone')
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = knex => knex.schema.dropTable('tipo_categorias_noticias'); 
