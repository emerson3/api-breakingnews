import user from '../models/user.js'
const createService = (body) => user.create(body);

const findAllService = () => user.find();

const findByIdService = (id) => user.findById(id)

const updateService = (
    id,
    name,
    username,
    email,
    password,
    avatar,
    background
) =>
    user.findOneAndUpdate(
        { _id: id },
        { name, username, email, password, avatar, background }
    )

export default {
    createService,
    findAllService,
    findByIdService,
    updateService
}