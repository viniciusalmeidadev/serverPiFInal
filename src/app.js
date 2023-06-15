const express = require("express");
const knex = require('./database');
const cors = require("cors");
const { Server } = require("socket.io")
const http = require('http')
const multer = require("multer")
const path = require('path');

const app = express();
app.use(cors());

app.use(express.json());

const UserController = require('./controllers/UserController')
const UserSessionController = require('./controllers/UserSessionController')
const UserInteresseController = require('./controllers/UserInteresseController')
const EstabelecimentoController = require('./controllers/EstabelecimentosController')
const EstabelecimentoTagsController = require('./controllers/EstabelecimentoTagsController')
const EstabelecimentoAvaliacoesController = require('./controllers/EstabelecimentoAvaliacoesController')
const NoticiaController = require('./controllers/NoticiasController')

//Rota post para cadastro de um novo usuário na aplicação
app.post("/cadastrar-usuario", UserController.cadastrarUsuario)

//rota get para puxar as informações do usuário (puxa os dados pessoais, categorias notícias escolhidas e quantidades de postagens realizadas por tipo de estabelecimento)
app.get("/consultar-usuario/:user_id", UserController.dadosUsuario)

//Rota get para verificar quais interesses (ou categorias de notícias) o usuário ainda não tem cadastrado 
app.get("/consultar-interesses-para-cadastrar/:user_id", UserInteresseController.listaCategoriasNaoCadastradas)

//rota post para cadastrar um novo interesse (categoria de notícia) de um usuário. Esta rota cadastra uma categoria por vez. 
app.post("/cadastrar-categorias-usuario-unit/:user_id", UserInteresseController.cadastrarCategoria)

//rota post para editar categorias cadastradas ou não pelo usuário
app.post("/editar-categoria/:user_id",UserInteresseController.editarInteresse)

//rota post para cadastrar mais de uma categoria por vez. Não usar por enquanto!
app.post("/cadastrar-categorias-usuario/:user_id", UserInteresseController.cadastrarCategoriasMassivo)

//Rota delete para excluir um interesse (categoria de notícia) que o usuário cadastrou
app.delete("/deletar-interesse", UserInteresseController.deletarCategoria)

//rota de autenticação do usuário no app 
app.post("/autenticar", UserSessionController.autenticar)

//rota post para cadastro de um novo estabelecimento
app.post("/cadastrar-posto", EstabelecimentoController.CadastrarEstabelecimento)

//rota get para consultar um estabelecimento especifico
app.get("/consultar-posto/:posto_id", EstabelecimentoController.ConsultaPostoEspecifico)

//rota get para listar todos os estabelecimentos cadastrados no banco de dados ---- rota usada apenas na tela de mapas
app.get("/consultar-postos", EstabelecimentoController.ConsultaTodosEstabelecimentos)

//rota get cadastrar uma tag para um determinado estabelecimento
app.post("/cadastrar-tag", EstabelecimentoTagsController.CadastrarTagParaEstabelecimento)

//rota get para listar as tags de um estabelecimento especifico
app.get("/consultar-tag/:posto_id", EstabelecimentoTagsController.ListaTagsEstabelecimento)

//rota post para cadastrar uma avaliacao sobre um determinado estabelecimento
app.post("/cadastrar-recomendacao-posto", EstabelecimentoAvaliacoesController.CadastrarAvaliacaoEstabelecimento)

//rota get para montar a tela de ranking de estabelecimento. Nela são trazidos infos do estabelecimento, nota e tags. Dados retornados em ordem decrescente. 
app.get("/consultar-recomendacao-posto", EstabelecimentoAvaliacoesController.ConsultaRecomendacoesPosto)

//rota get para puxar a nota de um determinado estabelecimento e a quantidade de avaliações
app.get("/consultar-nota-estabelecimento/:posto_id", EstabelecimentoAvaliacoesController.ConsultaNotaEstabelecimento)

//rota get para consultar os comentários feitos em um estabelecimento
app.get("/consultar-comentarios-posto/:posto_id", EstabelecimentoAvaliacoesController.ConsultaComentariosEstabelecimentos)

//rota get para trazer os dados de uma avaliação especifica (usada na funcionalidade de editar o comentario)
app.get("/consulta-comentario-edicao/:posto_id&:user_id",EstabelecimentoAvaliacoesController.ConsultaComentarioEspecifico)

//rota put para atualizar o comentário de um usuário em um determinado estabelecimento
app.put("/atualizar-recomendacao-posto", EstabelecimentoAvaliacoesController.AtualizaComentarioEstabelecimento)

//rota delete para deletar um comentário em um estabelecimento
app.delete("/deleta-comentario/", EstabelecimentoAvaliacoesController.DeletaComentario)

//rota get para trazer as noticias mais lidas e puxar as notícias baseadas nas categorias escolhidas pelos usuários
app.get('/consultar-noticias/:user_id', NoticiaController.ConsultarNoticias)

//IGNORAR AS TRÊS ROTAS ABAIXO: rotas de WA para facilitar alterações massivas ou testar o websocket
app.post('/del/:user', async(req,res)=>{

    const {user} = req.params

    await knex('cadastrar_recomendacao_posto')
    .where('user_id', user)
    .del()
})

app.get('/a', async(req,res)=>{
    await knex('cadastrar_postogasolina').where('posto_id', 2).update({temFoto: '2'})
})

app.get('/', async (req, res) => {
    const usuario = await knex('alertas_mapa').select('*')
    res.sendFile(__dirname + '/testeWebSocket/index.html');
});





//rota get para puxar a imagem do servidor para o frontend
app.get("/imagem/:nome", async (req,res)=>{
    const {nome} = req.params;

    res.sendFile(path.resolve(`./uploads/${nome}`));
})

//rota post para gravação de imagem no servidor (funciona tanto para upload de imagens de usuários quanto para upload de logo dos estabelecimentos)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage});

app.post('/uploads', upload.single('file'), (req, res)=>{

    return res.json({message: "cadastrado!"})
})


//rota get para puxar os alertas no primeiro carregamento do mapa
app.get('/pegaAlertas', async (req,res)=>{
    const usuario = await knex('alertas_mapa').select('user_id', 'descricao', 'tipo', 'latitude', 'longitude')

    res.json(usuario)
})

//Rota websocket para cadastramento de alertas e listagem de alertas
const serverHttp = http.createServer(app);
const io = new Server(serverHttp);

io.on('connection',  (socket) => {
    

    socket.on('chat message', async (msg) => {

        const {alerta_id,user_id, descricao, tipo, latitude, longitude} = msg

        await knex('alertas_mapa').insert({
        alerta_id,user_id, descricao, tipo, latitude, longitude
        }
    );

        io.emit('chat message', msg);
    });
});

serverHttp.listen(4011, ()=>console.log("server"))