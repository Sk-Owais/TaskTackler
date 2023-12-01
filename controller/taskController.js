let taskModel = require('../model/taskModel')

async function create(req, res) {
    let task = await taskModel.create(req.body, req.userData).catch((error) => { return { error } })
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: task.data })
}
async function update(req, res) {
    let task = await taskModel.update(req.params.id, req.body, req.userData).catch((error) => { return { error } })
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: task.data })
}
async function read(req, res) {
    let task = await taskModel.readOne(req.params.id).catch((error) => { return { error } })
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: task.data })
}
async function tDelete(req, res) {
    let task = await taskModel.tDelete(req.params.id, true).catch((error) => { return { error } })
    console.log("🚀 ~ file: taskController.js:37 ~ readAll ~ task:", task)
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ msg: "Task Deleted" })
}
async function restore(req, res) {
    let task = await taskModel.tDelete(req.params.id, false).catch((error) => { return { error } })
    console.log("🚀 ~ file: taskController.js:37 ~ readAll ~ task:", task)
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: task.data, msg: "Task Restored" })
}
async function readAll(req, res) {
    let task = await taskModel.readAll(req.userData.permissions).catch((error) => { return { error } })
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: task.data })
}
async function assign(req, res) {
    let task = await taskModel.assign(req.params.id, req.body, req.userData).catch((error) => { return { error } })
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: "Assigned Succefully" })
}
async function revoke(req, res) {
    let task = await taskModel.revoke(req.params.id, req.userData).catch((error) => { return { error } })
    console.log("🚀 ~ file: taskController.js:63 ~ revoke ~ task:", task)
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: "Task Revoked" })
}
async function ustatus(req, res) {
    let task = await taskModel.ustatus(req.params.id, req.body, req.userData).catch((error) => { return { error } })
    console.log("🚀 ~ file: taskController.js:54 ~ ustatus ~ task:", task)
    if (!task || (task && task.error)) {
        let error = (task && task.error) ? task.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: "Status Changed" })
}
module.exports = {
    create,
    update,
    read,
    tDelete,
    readAll,
    assign,
    ustatus,
    restore,
    revoke
}