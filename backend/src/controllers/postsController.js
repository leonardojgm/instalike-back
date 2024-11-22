import { getTodosPosts, buscarPostPorID, criarPost, atualizarPost } from '../models/postsModel.js';
import fs from 'fs';
import gerarDescricaoComGemini from '../services/geminiService.js';

// Função para listar todos os posts (usa async/await para esperar a operação)
export async function listarPosts(req, res) {
  const posts = await getTodosPosts(); // Espera a promise de getTodosPosts ser resolvida
  
  res.status(200).json(posts); // Retorna a lista de posts no formato JSON
}

// Função para obter uma mensagem de teste (simples, sem async/await)
export async function obterMensagemTeste(req, res) {
  res.status(200).send('A Torre Eiffel ilumindada à noite, com milhares de luzes cintilando, criando um espetáculo mágico em Paris.');
}

// Função para obter um post por índice (usa async/await para esperar operações)
export async function obterPorIndice(req, res) {
  const index = await buscarPostPorID(req.params.id); // Espera a promise de buscarPostPorID ser resolvida
  
  // Descomente para ver o valor do index retornado
  // console.log(index);

  const posts = await getTodosPosts(); // Espera a promise de getTodosPosts ser resolvida

  res.status(200).json(posts[index]); // Retorna o post encontrado pelo índice
}

// Função para obter um post por ID usando query params (usa async/await e filter)
export async function obterPorId(req, res) {
  const posts = await getTodosPosts(); // Espera a promise de getTodosPosts ser resolvida  
  const postEncontrado = posts.find(post => post._id == req.query.id); // Filtra o post pelo ID

  res.status(200).json(postEncontrado); // Retorna o post encontrado
}

// Função para criar um novo post (usa async/await e tratamento de erros)
export async function postarNovoPost(req, res) {
  const novoPost = req.body; // Extrai o novo post do corpo da requisição
  
  try {
    const postCriado = await criarPost(novoPost); // Espera a promise de criarPost ser resolvida

    res.status(201).json(postCriado); // Retorna o post criado com status 201 (Created)
  } catch (error) {
    console.error(error.message); // Registra o erro no console
    res.status(500).json({ "Erro": "Falha na requisição" }); // Retorna erro genérico 500
  }
}

// Função para realizar upload de imagem (usa async/await, fs e tratamento de erros)
export async function uploadImagem(req, res) {
  const novoPost = {
    Descricao: "", // Precisa ser preenchido pelo usuário
    imgUrl: req.file.originalname, // Nome original da imagem enviada
    alt: "" // Precisa ser preenchido pelo usuário (texto alternativo)
  };
  
  try {
    const postCriado = await criarPost(novoPost); // Espera a promise de criarPost ser resolvida
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`; // Define o novo nome da imagem
    
    fs.renameSync(req.file.path, imagemAtualizada); // Move a imagem para a pasta uploads

    res.status(201).json(postCriado); // Retorna o post criado com status 201 (Created)
  } catch (error) {  
    console.error(error.message); // Registra o erro no console
    res.status(500).json({ "Erro": "Falha na requisição" }); // Retorna erro genérico 500
  }
}

export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;
  
  try {
    const imgBuffer = fs.readFileSync(`./uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postAtualizado = await atualizarPost(id, post);

    res.status(201).json(postAtualizado);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}