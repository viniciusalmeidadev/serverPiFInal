const express = require("express");
const knex = require('../database');
const cors = require("cors");
const { Server } = require("socket.io")
const http = require('http')
const multer = require("multer")
const path = require('path');



module.exports = {
    //Cadastrar uma avaliacao para um estabelecimento especifico
    async CadastrarAvaliacaoEstabelecimento (req,res){
        const {posto_id, user_id, descricao, valor} = req.body;


   
        await knex('cadastrar_recomendacao_posto').insert({
            posto_id, user_id, descricao, valor
        });

        return res.status(201).json({message: "recomendacao publicada com sucesso!"})
    },

    //consulta para montar a tela de ranqueimento. Puxa do BD informações do estabelecimento, notas e tags, listando em ordem decrescente a partir da avaliação do posto
    async ConsultaRecomendacoesPosto (req,res){
        const avaliacao = await knex.select( 
            'cadastrar_postogasolina.posto_id',
            'cadastrar_postogasolina.nome_posto',
            'cadastrar_postogasolina.endereco',
            'cadastrar_postogasolina.tipoEstabelecimento',
            'cadastrar_postogasolina.temFoto',
            'cadastrar_postogasolina.urlImagem',
            'cadastrar_postogasolina.email',
            'cadastrar_postogasolina.longitude',
            'cadastrar_postogasolina.latitude',
            'cadastrar_postogasolina.telefone',
            'cadastrar_postogasolina.cpf_cnpj',
            knex.raw('ROUND(AVG(cadastrar_recomendacao_posto.valor),1) AS avaliacao, count(cadastrar_recomendacao_posto.valor) AS totalAvaliacao')
            )
            .from('cadastrar_recomendacao_posto')
            .rightJoin('cadastrar_postogasolina', 'cadastrar_recomendacao_posto.posto_id', '=', 'cadastrar_postogasolina.posto_id')  
            .groupBy('cadastrar_postogasolina.posto_id')
            .orderBy('avaliacao', 'desc')
        
            const tags = await knex.select(
                'tag_id',
                'tipo',
                'posto_id'
            ).from('cadastrar_tagsposto')
        
            if(!tags){
                return res.json(
                    {message: "Nenhuma recomendação encontrada!"}
                )
            }else{
                return res.json(
                    {
                        avaliacao,
                        tags
                    }
                )
            } 
    },

    //consulta a nota e quantidade de avaliações recebidas por um determinado estabelecimento
    async ConsultaNotaEstabelecimento (req,res){
        const {posto_id} = req.params

        const notaEstabelecimento = await knex.select(
            knex.raw("ROUND(AVG(cadastrar_recomendacao_posto.valor),1) AS avaliacao, count(cadastrar_recomendacao_posto.valor) AS totalAvaliacao")
        ).from('cadastrar_recomendacao_posto')
        .where('cadastrar_recomendacao_posto.posto_id', posto_id)

        console.log('sucesso')

        return res.json(notaEstabelecimento)
    },

    //consulta os comentários feitos pelos usuários em um estabelecimento especifico
    async ConsultaComentariosEstabelecimentos (req,res){
        const {posto_id} = req.params;

        const tags = await knex.select(
            'cadastrar_recomendacao_posto.recomendacao_posto_id',
            'cadastrar_recomendacao_posto.descricao',
            'cadastrar_recomendacao_posto.valor',
            'cadastrar_usuarios.nome',
            'cadastrar_usuarios.user_id',
            'cadastrar_usuarios.urlImagem',
            'cadastrar_usuarios.temFoto'
        )
        .from('cadastrar_recomendacao_posto')
        .innerJoin('cadastrar_usuarios', 'cadastrar_recomendacao_posto.user_id', '=', 'cadastrar_usuarios.user_id')
        .where('cadastrar_recomendacao_posto.posto_id', posto_id)

        if(!tags){
            return res.json(
                {message: "Nenhuma recomendação encontrada!"}
            )
        }else{
            return res.json(
                tags
            )
        } 
    },

    //consulta para trazer os dados de uma avaliação especifica (usada na funcionalidade de editar o comentario)
    async ConsultaComentarioEspecifico(req,res){
        
        
        const posto_id = req.params.posto_id
        const user_id = req.params.user_id

        const comentario = await knex.
        select('*').
        from('cadastrar_recomendacao_posto').
        where('posto_id', posto_id).
        andWhere('user_id', user_id)
        .limit(1)

        console.log(comentario)

        return res.json(comentario)
    },

    //Atualiza o comentário de um usuário em um determinado estabelecimento
    async AtualizaComentarioEstabelecimento (req,res){
        const {user_id, posto_id, valor, descricao} = req.body

        await knex('cadastrar_recomendacao_posto')
        .update({valor: valor, descricao: descricao})
        .where('posto_id', posto_id)
        .andWhere('user_id', user_id)

        return res.status(200).json({message: "Comentário Atualizado"})
    },

    async DeletaComentario (req,res){
        const recomendacao_posto_id = req.body.recomendacao_posto_id;

        await knex('cadastrar_recomendacao_posto').where('recomendacao_posto_id', recomendacao_posto_id).del()

        res.send('deletados')
    }


}