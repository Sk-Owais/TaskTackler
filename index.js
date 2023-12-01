let express = require('express')
let app = express()
let { routes } = require('./routes')
let config = require('config')
let port = config.get('port')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})