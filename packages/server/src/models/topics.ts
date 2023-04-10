import {
  DataType,
  Column,
  AutoIncrement,
  Model,
  PrimaryKey,
  Table,
  AllowNull,
} from 'sequelize-typescript'
import type { Optional } from 'sequelize'

type TopicAttributes = {
  id: number
  title: string
  authorId: number
  status: boolean
}

type TopicCreationAttributes = Optional<TopicAttributes, 'id' | 'status'>

@Table({
  tableName: 'topics_table',
  timestamps: true,
  updatedAt: false,
})
export class Topic extends Model<TopicAttributes, TopicCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  override id: number

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'author_id',
  })
  authorId: number

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  status: boolean
}
