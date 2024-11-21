import conectarAoBanco from '../config/dbConfig.js';

// console.log(process.env.STRING_CONEXAO); // Descomente para ver a string de conexão

// Conecta ao banco de dados usando a string de conexão fornecida no ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Array de posts (simulado, em um projeto real, esses dados viriam do banco de dados)
const posts = [
    // ... seus posts aqui
    { id: 1, descricao: "Uma foto teste", imagem: "https://placecats.com/millie/300/150" },
    { id: 2, descricao: "Gato fazendo yoga", imagem: "https://placecats.com/millie/300/150" },
    { id: 3, descricao: "Gato fazendo panqueca", imagem: "https://placecats.com/millie/300/150"},
];

// Função para buscar um post por ID no array de posts (simulado)
export async function buscarPostPorID(id) {
    const posts = await getTodosPosts();

    return posts.findIndex((post) => {
        return post._id == id;
    });
}

// Função assíncrona para buscar todos os posts do banco de dados
export async function getTodosPosts() {
    const db = conexao.db("imersao-instabytes"); // Seleciona o banco de dados
    const colecao = db.collection("posts"); // Seleciona a coleção de posts

    return colecao.find().toArray(); // Retorna todos os documentos da coleção como um array
}

// Função assíncrona para criar um novo post no banco de dados
export async function criarPost(post) {
    const db = conexao.db("imersao-instabytes"); // Seleciona o banco de dados
    const colecao = db.collection("posts"); // Seleciona a coleção de posts
    const postCriado = await colecao.insertOne(post); // Insere o novo post
    
    return postCriado;
}
