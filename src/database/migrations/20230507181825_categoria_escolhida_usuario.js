/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable('categorias_escolhidas_usuario', table =>{
    table.increments('id_categoria_usuario')
    table.integer('user_id').references('cadastrar_usuarios.user_id').notNullable()
    table.integer('categoria_id').references('tipo_categorias_noticias.id_categoria').notNullable()
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = knex => knex.schema.dropTable('categorias_escolhidas_usuario'); 
