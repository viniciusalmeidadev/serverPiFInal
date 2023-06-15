const express = require("express");
const knex = require('../database');
const cors = require("cors");
const { Server } = require("socket.io")
const http = require('http')
const multer = require("multer")
const path = require('path');



module.exports = {

    //lista as categorias que o usuário ainda não cadastrou cadastrou
    async listaCategoriasNaoCadastradas (req,res){
        const {user_id} = req.params
        
        const interessesNaoCadastrados = await knex.raw(`SELECT id_categoria, descricao
        FROM tipo_categorias_noticias
        `)

        const objCategorias = await knex.select(
            'tipo_categorias_noticias.id_categoria',
            )
            .from('tipo_categorias_noticias')
            .innerJoin('categorias_escolhidas_usuario', 'tipo_categorias_noticias.id_categoria','=','categorias_escolhidas_usuario.categoria_id')
            .innerJoin('cadastrar_usuarios','categorias_escolhidas_usuario.user_id','=','cadastrar_usuarios.user_id')
            .where('cadastrar_usuarios.user_id',user_id)

        const categorias = objCategorias.map(objCategoria => objCategoria.id_categoria)

        return res.send({interessesNaoCadastrados, categorias})
    },

    //faz o cadastro de uma categoria que o usuario escolheu 
    async cadastrarCategoria (req,res){
        const {user_id} = req.params

        const categoria_id = req.body.categoria;


        await knex('categorias_escolhidas_usuario').insert({
            user_id,categoria_id
        })


        res.end()
    },

    //Deleta uma ou mais categorias que usuário selecionar 
    async deletarCategoria (req,res){
        const id_categoria_usuario = req.body.categoria

        await knex('categorias_escolhidas_usuario').whereIn('id_categoria_usuario',id_categoria_usuario).del()

        res.send('deletados')
    },

    //cadastrar categorias de forma massiva. Não usar por enquanto!
    async cadastrarCategoriasMassivo (req,res){
        const {user_id} = req.params

        const {categorias} = req.body;


        for(index in categorias){
            var categoria_id = categorias[index]

            await knex('categorias_escolhidas_usuario').insert({
                user_id,categoria_id
            })
        }

        res.end()
    },

    async editarInteresse(req,res){
        const categoria_id = req.body.id_categoria
        const user_id = req.params.user_id

        const categoriaJaCadastrada = await knex
        .select('id_categoria_usuario')
        .from('categorias_escolhidas_usuario')
        .where('user_id',user_id)
        .andWhere('categoria_id', categoria_id)



        if(categoriaJaCadastrada.length > 0 ){
            await knex('categorias_escolhidas_usuario')
            .where('user_id',user_id)
            .andWhere('categoria_id', categoria_id)
            .del()
            console.log('delete', categoriaJaCadastrada)
        }else{
            await knex('categorias_escolhidas_usuario').insert({
                user_id,categoria_id
            })

            console.log('aqui')
        }

        res.end()
    }
}