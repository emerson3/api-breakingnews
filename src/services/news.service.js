import News from "../models/news.js"

const createService = (body) => News.create(body);

const findAllService = (limit, offset) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const countNews = () => News.countDocuments();

const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

const findByIdService = (id) => News.findById(id).populate("user");

const searchByTitleService = (title) => News.find({
    title: { $regex: `${title || ""}`, $options: "i" }
}).sort({ _id: -1 }).populate("user");

const byUserService = (id) => News.find({ user: id }).sort({ _id: -1 }).populate("user");

const updateNewsService = (id, title, text, banner) => News.findOneAndUpdate(
    { _id: id },
    {
        title,
        text,
        banner
    }
);

const deleteNewsService = (id) => News.findByIdAndDelete({ _id: id });

const likeNewsService = (idNews, userId) => News.findOneAndUpdate(
    { _id: idNews, "likes.userId": { $nin: [userId] } },
    { $push: { likes: { userId, created: new Date() } } }
);

const commentNewsService = (idNews, comment, userId) => {
    let idComment = Math.floor(Date.now() * Math.random()).toString(36);
    return News.findOneAndUpdate(
        { _id: idNews },
        { $push: { comments: { idComment, userId, comment, createdAt: new Date() } } }
    )
}

const deleteLikeNewsService = (idNews, userId) => News.findOneAndUpdate(
    { _id: idNews },
    { $pull: { likes: { userId } } }
)

const deleteCommentNewsService = (idNews, idComment, userId) => {
    try {
        console.log(idNews, idComment, userId + "AAAAAAAAAAAAAAA")
        return News.findOneAndUpdate(
            { _id: idNews },
            { $pull: { comments: { idComment, userId } } }
        )
    } catch (error) {
        console.log(error)
    }
}
export default {
    createService,
    findAllService,
    countNews,
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
    updateNewsService,
    deleteNewsService,
    likeNewsService,
    deleteLikeNewsService,
    commentNewsService,
    deleteCommentNewsService
}