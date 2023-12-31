let express = require('express')
let routes = express.Router()
let authM = require('./middleware/authMiddleware')
let auth = require('./controller/authController')
let task = require('./controller/taskController')

routes.post('/register', auth.register)
routes.post('/login', auth.login)

routes.post('/task', authM.authMid('task_create'), task.create)
routes.get('/task/:id', authM.authMid('task_readOne'), task.read)
routes.get('/task', authM.authMid('task_readAll'), task.readAll)
routes.put('/task/:id', authM.authMid('task_update'), task.update)
routes.post('/task/delete/:id', authM.authMid('task_delete'), task.tDelete)
routes.post('/task/restore/:id', authM.authMid('task_restore'), task.restore)
routes.put('/task/assign/:id', authM.authMid('task_assign'), task.assign)
routes.put('/task/revoke/:id', authM.authMid('task_revoke'), task.revoke)
routes.put('/task/status/:id', authM.authMid('task_status'), task.ustatus)

module.exports = {
    routes
}