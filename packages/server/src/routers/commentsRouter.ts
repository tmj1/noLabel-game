import { Router } from 'express'
import { CommentsController } from '../controllers/commentsControllers'

export const commentsRouter = (router: Router) => {
  const commentsRouter = Router()

  commentsRouter
    .get('/:topicId/comments/', CommentsController.getCommentsByTopic)
    .post('/:topicId/comments/', CommentsController.createComment)
    .post('/comments/:commentId/delete/', CommentsController.deleteComment)

  router.use('/topics', commentsRouter)
}
