import Server from './src/server'

const starter = new Server()
  .start()
  .then(port => console.log(`Running on port ${port}`))
  .catch(error => {
    console.log(error)
  })

export default starter
