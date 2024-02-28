import bcrypt from "bcrypt"

import { loginService, generateToken } from "../services/auth.service.js";

const login = async (req, res) => {
    try {

        const userLogin = req.body;

        if (!userLogin.username || !userLogin.password)
            return res.status(404).send({ message: "Todos os campos são obrigatórios." })

        const user = await loginService(userLogin.username);

        if (!user)
            return res.status(404).send({ message: "Usuário ou senha incorreto!" })

        const passwordIsValid = await bcrypt.compare(userLogin.password, user.password)

        if (!passwordIsValid)
            return res.status(404).send({ message: "Usuário ou senha incorreto!" })

        const token = generateToken(user.id);

        return res.send({ token });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

export { login };