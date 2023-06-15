const express = require("express");
const knex = require('../database');
const cors = require("cors");
const { Server } = require("socket.io")
const http = require('http')
const multer = require("multer")
const path = require('path');



module.exports = {
    
    //pega dados de um usuário específico
    async dadosUsuario (req, res){
        const {user_id} = req.params;
        const usuario = await knex.select(
        'cadastrar_usuarios.user_id',
        'cadastrar_usuarios.nome',
        'cadastrar_usuarios.email',
        'cadastrar_usuarios.sexo',
        'cadastrar_usuarios.cpf_cnpj',
        'cadastrar_usuarios.tipo_usuario',
        'cadastrar_usuarios.urlImagem',
        'cadastrar_usuarios.temFoto',
        'cadastrar_usuarios.telefone',
        'cadastrar_usuarios.dataNascimento',
        'cadastrar_usuarios.created_at',
        knex.raw('SUM(CASE WHEN cadastrar_postogasolina.tipoEstabelecimento = 1 THEN 1 ELSE 0 END) AS recondacoes_posto'),
        knex.raw('SUM(CASE WHEN cadastrar_postogasolina.tipoEstabelecimento = 2 THEN 1 ELSE 0 END) AS recondacoes_restaurantes'),
        knex.raw('SUM(CASE WHEN cadastrar_postogasolina.tipoEstabelecimento = 3 THEN 1 ELSE 0 END) AS recondacoes_hoteis'))
        .from('cadastrar_usuarios')  
        .leftJoin('cadastrar_recomendacao_posto', 'cadastrar_usuarios.user_id','=','cadastrar_recomendacao_posto.user_id')
        .leftJoin('cadastrar_postogasolina', 'cadastrar_recomendacao_posto.posto_id', '=', 'cadastrar_postogasolina.posto_id')
        .where('cadastrar_usuarios.user_id',user_id)    
        .groupBy('cadastrar_usuarios.nome')

        const categorias = await knex.select(
        'tipo_categorias_noticias.descricao',
        'tipo_categorias_noticias.icone',
        'tipo_categorias_noticias.id_categoria',
        'categorias_escolhidas_usuario.id_categoria_usuario'
        )
        .from('tipo_categorias_noticias')
        .innerJoin('categorias_escolhidas_usuario', 'tipo_categorias_noticias.id_categoria','=','categorias_escolhidas_usuario.categoria_id')
        .innerJoin('cadastrar_usuarios','categorias_escolhidas_usuario.user_id','=','cadastrar_usuarios.user_id')
        .where('cadastrar_usuarios.user_id',user_id)


        if(!usuario){
            return res.json(
                {message: "Nenhum usuário encontrado!"}
            )
        }else{
            return res.json(
                {usuario,categorias}
            )
        } 
    },

    //cadastra um novo usuário
    async cadastrarUsuario (req, res){
        const {nome, email, senha, tipo_usuario, sexo, cpf_cnpj, telefone, urlImagem, temFoto, dataNascimento} = req.body;


  

        //Gera um id único para o usuário
        let i = 0
        var user_id = null
        while(i == 0){
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
              
            user_id = getRandomInt(10000,100000000)

            var verificaIdJaExiste = await knex.from('cadastrar_usuarios').select('user_id').where('user_id',user_id)

            if(verificaIdJaExiste.length == 0){
                i = 1
            }
        }


        const cadastrar_usuarios = {
            user_id,
            nome, 
            email, 
            senha, 
            tipo_usuario, 
            sexo, 
            cpf_cnpj, 
            telefone,
            urlImagem,
            temFoto,
            dataNascimento
        }
        
        await knex('cadastrar_usuarios').insert(cadastrar_usuarios)

        return res.status(201).json({user_id})
    }

    

}