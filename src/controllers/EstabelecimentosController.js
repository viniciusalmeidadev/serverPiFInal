const express = require("express");
const knex = require('../database');
const cors = require("cors");
const { Server } = require("socket.io")
const http = require('http')
const multer = require("multer")
const path = require('path');



module.exports = {
    //cadastra um novo estabelecimento 
    async CadastrarEstabelecimento (req,res){
        const {tipoEstabelecimento,nome_posto, email, senha, cpf_cnpj, telefone, endereco, urlImagem,temFoto, latitude,longitude} = req.body;

        await knex('cadastrar_postogasolina').insert({
            nome_posto, 
            email, 
            senha, 
            cpf_cnpj, 
            telefone,
            endereco,
            latitude,
            longitude,
            urlImagem,
            temFoto,
            tipoEstabelecimento
        });

        return res.json({message: 'restaurante criado!'})
    },

    //consulta os dados de um estabelecimento especifico
    async ConsultaPostoEspecifico (req,res){
        const {posto_id} = req.params;
        const posto = await knex('cadastrar_postogasolina').select('*').where('posto_id', posto_id).first();

        if(!posto){
            return res.json(
                {message: "Nenhum posto encontrado!"}
            )
        }else{
            return res.json(
                posto
            )
        } 
    },

    //consulta todos os estabelecimentos cadastrados no banco de dados ---- rota usada apenas na tela de mapas
    async ConsultaTodosEstabelecimentos (req,res){
        posto = await knex('cadastrar_postogasolina').select('urlImagem','posto_id','latitude','longitude','nome_posto','tipoEstabelecimento','temFoto', 'cpf_cnpj','telefone','endereco','email').whereIn('posto_id', [1,2,6,8,10,11,13,15,16,23])  

        if(!posto){
            return res.json(
                {message: "Nenhum posto encontrado!"}
            )
        }else{
            return res.json(
                posto
            )
        }
    }
}