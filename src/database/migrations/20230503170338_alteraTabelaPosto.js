/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.raw(`

    alter table cadastrar_postogasolina add column urlImagem varchar;
    
    `)
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable('cadastrar_postogasolina'); 
