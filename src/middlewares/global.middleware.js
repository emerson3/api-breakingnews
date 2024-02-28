import newsService from '../services/news.service.js';
import userService from '../services/user.service.js';
import mongoose from 'mongoose';

const validId = (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send({ message: "Id inválido." });

    next();
}

const validUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await userService.findByIdService(id);

    if (!user)
        return res.status(400).send({ message: "Usuário não encontrado." })

    req.id = id;
    req.user = user;
    next();
}

const validNews = async (req, res, next) => {
    const id = req.params.id;
    const news = await newsService.findByIdService(id);

    if(!news)
        return res.status(400).send({message: "Notícia não encontrada."});

    req.news = news;
    next();
}

export default { validId, validUser, validNews }