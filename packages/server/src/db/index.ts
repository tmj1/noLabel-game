import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { Topic } from '../models/topics'
import { Comment } from '../models/comments'
import dbConfig from './db.config'
import * as process from 'process'

const sequelizeOptions: SequelizeOptions = {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  dialect: dbConfig.dialect,
}

const sequelize = new Sequelize(sequelizeOptions)
sequelize.addModels([Topic, Comment])

export async function dbConnect() {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
