import userService from '../services/user.service.js';
import mongoose from 'mongoose';

const create = async (req, res) => {
    try {
        const user = req.body;

        if (!user.email || !user.name || !user.username || !user.password || !user.avatar || !user.background)
            return res.status(400).send({ message: "Todos os campos são obrigatórios!" });

        const createUser = await userService.createService(user)

        if (!createUser)
            res.status(400).send({ message: "Erro ao criar usuário." })

        res.status(201).send(createUser);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const findAll = async (req, res) => {
    try {
        const users = await userService.findAllService();

        if (users.length == 0)
            return res.status(400).send({ message: "não há usuários cadastrados." })

        res.send(users)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const findById = async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const updateById = async (req, res) => {
    try {
        const user = req.body;
        const idUser = req.params.id;

        if (!user.email && !user.name && !user.username && !user.password && !user.avatar && !user.background)
            return res.status(400).send({ message: "Ao menos um campo é necessário para editar!" });

        await userService.updateService(
            idUser,
            user.name,
            user.username,
            user.email,
            user.password,
            user.avatar,
            user.background
        )

        res.send({ message: "Usuário atualizado com sucesso!" })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export default { create, findAll, findById, updateById };