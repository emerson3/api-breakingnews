import newsService from "../services/news.service.js"
import { ObjectId } from 'mongoose';

const create = async (req, res) => {
    try {
        const { title, banner, text } = req.body;

        if (!title || !banner || !text)
            return res.status(400).send({
                message: "Todos so campos são obrigatórios."
            })
        await newsService.createService({
            title,
            banner,
            text,
            user: req.userId
        }
        )
        res.send(201)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const findAll = async (req, res) => {
    try {

        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit)
            limit = 5;

        if (!offset)
            offset = 0;

        console.log(limit, offset);

        const news = await newsService.findAllService(limit, offset);

        const total = await newsService.countNews();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if (news.length == 0)
            return res.status(400).send({ message: "não há usuários cadastrados." })

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                banner: item.banner,
                text: item.text,
                likes: item.likes,
                comments: item.comments,
                username: item.user.username,
                avatar: item.user.avatar
            }))
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const topNews = async (req, res) => {
    try {
        const news = await newsService.topNewsService()
        if (!news)
            return res.status(401).send({ message: "Não há posts registrados." });

        res.send({
            news: {
                id: news._id,
                title: news.title,
                banner: news.banner,
                text: news.text,
                likes: news.likes,
                comments: news.comments,
                username: news.user.username,
                avatar: news.user.avatar
            }
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }

}

const findById = async (req, res) => {
    try {
        const news = req.news;

        return res.send({
            news: {
                id: news._id,
                title: news.title,
                banner: news.banner,
                text: news.text,
                likes: news.likes,
                comments: news.comments,
                username: news.user.username,
                avatar: news.user.avatar
            }
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await newsService.searchByTitleService(title);

        if (news.length == 0)
            return res.status(400).send({ message: "Não existe uma notícia com este título." })

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                banner: item.banner,
                text: item.text,
                likes: item.likes,
                comments: item.comments,
                username: item.user.username,
                avatar: item.user.avatar
            }))
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const byUser = async (req, res) => {
    try {
        const idUser = req.userId;

        const newsUser = await newsService.byUserService(idUser);

        return res.send({
            results: newsUser.map((item) => ({
                id: item._id,
                title: item.title,
                banner: item.banner,
                text: item.text,
                likes: item.likes,
                comments: item.comments,
                username: item.user.username,
                avatar: item.user.avatar
            }))
        })

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const updateNews = async (req, res) => {
    try {
        const { title, text, banner } = req.body
        const { id } = req.params;

        if (!title && !banner && !text)
            return res.status(400).send({ message: "Um campo preenchido é necessário." })

        const news = await newsService.findByIdService(id);

        if (!news)
            return res.status(400).send({ message: "notícia não encontrada." });

        if (news.user._id != req.userId)
            return res.status(400).send({ message: "Você não é o proprietário desta notícia." });

        await newsService.updateNewsService(id, title, text, banner)
        res.send({ message: "notícia atualizada com sucesso." })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const deleteNews = async (req, res) => {
    const { id } = req.params;


    const news = await newsService.findByIdService(id);

    if (!news)
        return res.status(400).send({ message: "notícia não encontrada." });

    if (news.user._id != req.userId)
        return res.status(400).send({ message: "Você não é o proprietário desta notícia." });

    await newsService.deleteNewsService(id)
    res.send({ message: "notícia deletada com sucesso." })
}

const likeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const newsLiked = await newsService.likeNewsService(id, userId);

        if (!newsLiked) {
            await newsService.deleteLikeNewsService(id, userId);
            return res.send({ message: "Curtida retirada com sucesso." })
        }

        res.send({ message: "Curtida adicionada com sucesso." })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const addCommentNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        console.log(id, userId)
        const { comment } = req.body;

        if (!comment)
            return res.status(400).send({ message: "Digite um comentário." });

        const newsCommented = await newsService.commentNewsService(id, comment, userId);

        res.send({ message: "comentário adicionada com sucesso." })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const deleteCommentNews = async (req, res) => {
    try {
        const { idNews, idComment } = req.params;
        const userId = req.userId;

        const news = await newsService.findByIdService(idNews)

        if (!idComment || !idNews)
            return res.status(400).send({ message: "Comentário ou postagem já apagados ou inválidos." });

        if (news.user._id != userId)
            return res.status(400).send({ message: 'exclusão de comentário não permitida' })

        await newsService.deleteCommentNewsService(idNews, idComment, userId);

        res.send({ message: "comentário removido com sucesso." })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export default { create, findAll, topNews, findById, searchByTitle, byUser, updateNews, deleteNews, likeNews, addCommentNews, deleteCommentNews }