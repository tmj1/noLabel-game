import type { Request, Response } from 'express'
import TopicsService from '../services/topicsService'
import type { Topic } from '../models/topics'

export class TopicsController {
  public static getTopics = async (req: Request, res: Response) => {
    const { title } = req.query
    const topics = await TopicsService.requestAll({
      ...(title && { title: title as string }),
    })

    res.json(topics)
  }
  public static getTopic = (req: Request, res: Response) => {
    const { topicId } = req.params

    if (!topicId) {
      res.status(400).json({ message: 'Missing required field `topicId`' })
    }

    TopicsService.request(Number(topicId))
      .then(topic => {
        if (!topic) {
          res.status(404).json({ message: 'Topic with given id not found' })
        }

        res.json(topic)
      })
      .catch(err => {
        res.status(500).json({ message: err.message })
      })
  }

  public static createTopic = (req: Request, res: Response) => {
    const { title, authorId } = req.body

    if (!title || !authorId) {
      res
        .status(400)
        .json({ message: 'Missing some of required fields `title | authorId`' })
    }

    TopicsService.create({ title, authorId })
      .then(topic => {
        if (!topic) {
          res.status(404).json({ message: 'No topic found' })
        }
        res.json(topic)
      })
      .catch(err => {
        res.status(500).json({ message: err.message })
      })
  }

  public static deleteTopic = (req: Request, res: Response) => {
    const { topicId } = req.params

    if (!topicId) {
      res.status(400).json({ message: 'Missing required field `topicId`' })
    }

    TopicsService.delete(Number(topicId))
      .then(topic => {
        if (!topic) {
          res.status(404).json({ message: 'No topic found' })
        }
        res.status(204).json({ message: 'Topic deleted' })
      })
      .catch(err => {
        res.status(500).json({ message: err.message })
      })
  }
}
