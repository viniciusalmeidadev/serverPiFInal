const express = require("express");
const knex = require('../database');
const cors = require("cors");
const { Server } = require("socket.io")
const http = require('http')
const multer = require("multer")
const path = require('path');



module.exports = {
    //rota de autenticação no app
    async autenticar (req, res){
        const {email, senhaInserida} = req.body;

        console.log(email, senhaInserida)

        const usuario = await knex('cadastrar_usuarios').select('email').where('email', email).first()

        
        if(!usuario){
            return res.status(400).json({erro: 'Usuário não encontrado'})
        }else{
            const {senha, user_id} = await knex('cadastrar_usuarios').select('senha','user_id').where('email', email).first()

            
            console.log('email:', user_id)

            if(senhaInserida == senha){
                return res.status(201).json({user_id})
            }else{
                return res.status(400).json({erro: 'Senha incorreta'})
            }
        }
    }
}