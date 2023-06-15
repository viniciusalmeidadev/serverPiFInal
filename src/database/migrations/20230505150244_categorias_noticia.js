/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable('categorias_noticia', table =>{
    table.increments('categoria_id')
    table.integer('noticia_id').references('noticia.noticia_id').notNullable()
    table.integer('id_categoria').references('tipo_categorias_noticias.id_categoria').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = knex => knex.schema.dropTable('categorias_noticia'); 