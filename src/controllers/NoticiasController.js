const express = require("express");
const knex = require('../database');
const cors = require("cors");
const { Server } = require("socket.io")
const http = require('http')
const multer = require("multer")
const path = require('path');



module.exports = {
    //esta rota traz as notícias mais lidas e as noticias baseadas nas categorias escolhidas pelos usuários
    async ConsultarNoticias (req,res){
        const {user_id} = req.params

    const id_categoria = await knex.raw(`SELECT id_categoria, descricao
    FROM tipo_categorias_noticias
    WHERE id_categoria IN (
      SELECT categoria_id
      FROM categorias_escolhidas_usuario
      WHERE user_id = ${user_id}
    );`)


    var id = [];

    for(ids in id_categoria){
        id.push(id_categoria[ids].id_categoria)
    }



    const noticiasMaisLidas = await knex.select(
        'noticias.noticia_id',
        'noticias.conteudo',
        'noticias.titulo',
        'noticias.temBanner',
        'noticias.urlBanner',
        'noticias.visualizacoes',
        'noticias.likes',
        'noticias.updated_at',
        'publicante_noticia.publicante_id',
        'publicante_noticia.nome',
        'publicante_noticia.urlImagem',
        'publicante_noticia.temFoto',
       )
       .from('noticias')
       .innerJoin('publicante_noticia', 'noticias.publicante_id', '=', 'publicante_noticia.publicante_id')
       .orderBy('noticias.visualizacoes', 'desc')

       
    const noticiasSemFiltrar = await knex.select(
        'noticias.noticia_id',
        'noticias.titulo',
        'noticias.conteudo',
        'noticias.temBanner',
        'noticias.urlBanner',
        'noticias.visualizacoes',
        'noticias.likes',
        'noticias.updated_at',
        'publicante_noticia.publicante_id',
        'publicante_noticia.nome',
        'publicante_noticia.urlImagem',
        'publicante_noticia.temFoto',
        'tipo_categorias_noticias.id_categoria',
        'tipo_categorias_noticias.descricao',
    )
    .from('noticias')
    .innerJoin('publicante_noticia', 'noticias.publicante_id', '=', 'publicante_noticia.publicante_id')
    .innerJoin('categorias_noticia', 'noticias.noticia_id', '=','categorias_noticia.noticia_id')
    .rightJoin('tipo_categorias_noticias', 'categorias_noticia.id_categoria', '=', 'tipo_categorias_noticias.id_categoria')
    .whereIn('categorias_noticia.id_categoria', id)


    const noticiasPorCategoria = {};

    noticiasSemFiltrar.forEach(noticias => {
        if (!noticiasPorCategoria[noticias.id_categoria]) {
        noticiasPorCategoria[noticias.id_categoria] = {
            id: noticias.id_categoria,
            descricao: noticias.descricao,
            noticias: []
        };
        }
        noticiasPorCategoria[noticias.id_categoria].noticias.push({
        noticia_id: noticias.noticia_id,
        conteudo:noticias.conteudo,
        titulo: noticias.titulo,
        urlBanner: noticias.urlBanner,
        temBanner:noticias.temBanner,
        visualizacoes:noticias.visualizacoes,
        likes:noticias.likes,
        dataPostagem:noticias.updated_at,
        publicanteId:noticias.publicante_id,
        nomePublicante:noticias.nome,
        urlImagem:noticias.urlImagem,
        temImagem:noticias.temImagem
        });
    });


    
    const noticiasEmJSON = [];
    for (const categoriaId in noticiasPorCategoria) {
    const categoria = noticiasPorCategoria[categoriaId];
    noticiasEmJSON.push({
        id: categoria.id,
        nome: categoria.descricao,
        noticias: categoria.noticias
    });
    }

    res.json({noticiasEmJSON,noticiasMaisLidas,id_categoria})
    }
}