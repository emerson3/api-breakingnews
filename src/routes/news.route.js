import { Router } from 'express';
import newsController from '../controllers/news.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import middlewares from "../middlewares/global.middleware.js"

const route = Router();


route.post("/", authMiddleware, newsController.create)
route.get("/", newsController.findAll)
route.get("/top", newsController.topNews)
route.get("/search", newsController.searchByTitle)
route.get("/byUser", authMiddleware, newsController.byUser)
route.get("/:id", middlewares.validId, middlewares.validNews, newsController.findById)
route.patch("/:id", authMiddleware, newsController.updateNews)
route.delete("/:id", authMiddleware, newsController.deleteNews)
route.patch("/like/:id", authMiddleware, newsController.likeNews)
route.patch("/comment/:id", authMiddleware, newsController.addCommentNews)
route.patch("/comment/:idNews/:idComment", authMiddleware, newsController.deleteCommentNews)
export default route;