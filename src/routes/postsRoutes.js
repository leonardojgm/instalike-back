import express from 'express';
import { listarPosts, obterMensagemTeste, obterPorIndice, obterPorId, postarNovoPost, uploadImagem } from '../controllers/postsController.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ dest: './uploads', storage });
// linux ou no mac
// const upload = multer({ dest: './uploads' });
const routes = (app) => {
    // Middleware para permitir que o Express entenda dados no formato JSON
    app.use(express.json());

    // Rota raiz, retorna uma mensagem de exemplo
    app.get('/api', obterMensagemTeste);
    
    // Rota para buscar todos os posts do banco de dados
    app.get('/posts', listarPosts);
    
    // Rota para buscar um post por ID
    app.get('/posts/:id', obterPorIndice);
    
    // Rota para buscar um post por ID (usando query params)
    app.get('/post', obterPorId);

    // Rota para criar um novo post
    app.post("/posts", postarNovoPost);

    // Rota para enviar uma imagem
    app.post("/upload", upload.single('imagem'), uploadImagem);
}

export default routes;
