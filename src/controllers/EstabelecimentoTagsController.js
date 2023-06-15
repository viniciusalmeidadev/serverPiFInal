const express = require("express");
const knex = require('../database');
const cors = require("cors");
const { Server } = require("socket.io")
const http = require('http')
const multer = require("multer")
const path = require('path');



module.exports = {
    //cadastra uma nova tag para o estabelecimento
    async CadastrarTagParaEstabelecimento (req,res){
        const {posto_id, descricao, tipo} = req.body;


        await knex('cadastrar_tagsposto').insert({
            posto_id, descricao, tipo
        });

        console.log(posto_id, descricao, tipo);

        return res.end()
    },

    //lista tags de um estabelecimento especifico
    async ListaTagsEstabelecimento (req,res){
        const {posto_id} = req.params;
        const tags = await knex('cadastrar_tagsposto').select('*').where('posto_id', posto_id);

        if(!tags){
            return res.json(
                {message: "Nenhuma tag encontrada!"}
            )
        }else{
            return res.json(
                tags
            )
        } 
    },


}