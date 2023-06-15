/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable('alertas_mapa', table =>{
    table.increments('alerta_id')
    table.integer('user_id').references('cadastrar_usuarios.user_id').notNullable()
    table.text('descricao').notNullable()
    table.text('tipo').notNullable()
    table.text('latitude').notNullable()
    table.text('longitude').notNullable()
    table.integer('conf_alerta')
    table.integer('desat_alerta')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = knex => knex.schema.dropTable('alertas_mapa'); 
