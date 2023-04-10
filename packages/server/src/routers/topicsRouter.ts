import { Router } from 'express'
import { TopicsController } from '../controllers/topicsController'

export const topicsRouter = (router: Router) => {
  const topicsRouter = Router()

  topicsRouter
    .get('/', TopicsController.getTopics)
    .get('/:topicId/', TopicsController.getTopic)
    .post('/', TopicsController.createTopic)
    .post('/:topicId/delete/', TopicsController.deleteTopic)

  router.use('/topics', topicsRouter)
}
