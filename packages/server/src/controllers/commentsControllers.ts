import type { Request, Response } from 'express'
import CommentsService from '../services/CommentsService'

export class CommentsController {
  public static getCommentsByTopic = (req: Request, res: Response) => {
    const { topicId } = req.params
    const { message } = req.query

    if (!topicId) {
      res
        .status(400)
        .json({ message: 'Missing required field `topicId`', req: req.params })
    }

    CommentsService.requestAll({
      topicId: Number(topicId),
      ...(message && { message: message as string }),
    })
      .then(comments => {
        if (!comments) {
          res.status(404).json({ message: 'No comments found' })
        }
        res.json(comments)
      })
      .catch(err => {
        res.status(500).json({ message: err.message })
      })
  }

  public static createComment = (req: Request, res: Response) => {
    const { message, authorId, topic_id } = req.body

    if (!message || !authorId || !topic_id) {
      res
        .status(400)
        .json({
          message:
            'Missing some of required fields `topic_id | authorId | message`',
        })
    }

    CommentsService.create({ message, authorId, topic_id })
      .then(comment => {
        if (!comment) {
          res.status(404).json({ message: 'No comment found' })
        }
        res.json(comment)
      })
      .catch(err => {
        res.status(500).json({ message: err.message })
      })
  }

  public static deleteComment = (req: Request, res: Response) => {
    const { commentId } = req.params

    if (!commentId) {
      res.status(400).json({ message: 'Missing required field `commentId`' })
    }

    CommentsService.delete(Number(commentId))
      .then(comment => {
        if (!comment) {
          res.status(404).json({ message: 'No comment found' })
        }
        res.status(204).json({ message: 'Comment deleted' })
      })
      .catch(err => {
        res.status(500).json({ message: err.message })
      })
  }
}
