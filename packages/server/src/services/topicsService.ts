import type { BaseRESTService } from './baseService'
import { Topic } from '../models/topics'
import { Comment } from '../models/comments'
interface FindRequest {
  title?: string
}

interface CreateRequest {
  title: string
  authorId: number
}

class TopicsService implements BaseRESTService {
  public requestAll = ({ title }: FindRequest) => {
    return Topic.findAll({
      where: {
        status: true,
        ...(title && { title: `%${title}%` }),
      },
    })
  }

  public request = (id: number) => {
    return Topic.findByPk(id, {
      include: [
        {
          model: Comment,
          as: 'comments',
          where: {
            status: true,
          },
        },
      ],
    })
  }

  public create = (data: CreateRequest) => {
    return Topic.create(data)
  }

  public delete = (id: number) => {
    return Comment.update(
      {
        status: false,
      },
      {
        where: {
          id,
        },
      }
    )
  }
}

export default new TopicsService()
