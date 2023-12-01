let { Task } = require('../schema/taskSchema')
let { User } = require('../schema/userSchema')
let joi = require('joi')

async function checkCreate(data) {
    let schema = joi.object({
        taskname: joi.string().required(),
        description: joi.string().required(),
        status: joi.string()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function create(params, userData) {
    let valid = await checkCreate(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let taskData = {
        taskname: params.taskname,
        description: params.description,
        createdBy: userData.id,
        updatedBy: userData.id

    }
    let data = await Task.create(taskData).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: data.error }
    }
    return { data }
}
async function checkUpdate(data) {
    let schema = joi.object({
        id: joi.number().integer().min(1),
        taskname: joi.string(),
        description: joi.string(),
        status: joi.string()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function update(id, params, userData) {
    let valid = await checkUpdate(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = {
        taskname: params.taskname,
        description: params.description,
        status: params.status,
        updatedBY: userData.id
    }
    let updata = await Task.update(data, { where: { id } }).catch((error) => { return { error } })
    if (!updata || (updata && updata.error)) {
        return { error: updata.error }
    }
    return { data }
}
async function check(data) {
    let schema = joi.object({
        id: joi.number().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function readAll(permissions) {
    if (!permissions.product_restore) {
        where = { is_deleted: false }
    }
    let data = await Task.findAll({ where }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: data.error }
    }
    return { data }
}

async function readOne(id) {
    let valid = await check({ id }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Task.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: data.error }
    }
    return { data }
}
async function tDelete(id, decision) {
    let valid = await check({ id }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findTask = await Task.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!findTask || (findTask && findTask.error)) {
        return { error: findTask.error }
    }
    if (findTask.is_deleted == decision) {
        return { error: "task already delete " }
    }
    let data = await Task.update({ is_deleted: decision }, { where: { id } }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: data.error }
    }
    if (data <= 0) {
        return { error: 'task not found' }
    }
    return { data: findTask }
}
async function checkAssign(data) {
    let schema = joi.object({
        id: joi.number().required(),
        assignTo: joi.number().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function assign(id, params, userData) {
    params.id = id
    let valid = await checkAssign(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findTask = await Task.findOne({ where: { id: params.id } }).catch((error) => { return { error } })
    if (!findTask || (findTask && findTask.error)) {
        return { error: 'Task not found' }
    }
    if (findTask.createdBy != userData.id) {
        return { error: 'Task is not created by user ' }
    }
    let findUser = await User.findOne({ where: { id: params.assignTo } }).catch((error) => { return { error } })
    if (!findUser || (findUser && findUser.error)) {
        return { error: 'User not found' }
    }
    let update = await Task.update({ assignTo: params.assignTo }, { where: { id: findTask.id } }).catch((error) => { return { error } })
    if (!update || (update && update.error)) {
        return { error: 'Error in updating task' }
    }
    return { data: update }
}
async function checkStatus(data) {
    let schema = joi.object({
        id: joi.number(),
        status: joi.string()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function ustatus(id, params, userData) {
    params.id = id
    let valid = await checkStatus(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findTask = await Task.findOne({ where: { id: params.id } }).catch((error) => { return { error } })
    if (!findTask || (findTask && findTask.error)) {
        return { error: 'Task not found' }
    }
    if (findTask.assignTo != userData.id) {
        return { error: 'You are not assigned to this task' }
    }
    let findUser = await User.findOne({ where: { id: findTask.assignTo } }).catch((error) => { return { error } })
    if (!findUser || (findUser && findUser.error)) {
        return { error: 'User not found' }
    }
    let update = await Task.update({ status: params.status }, { where: { id: findTask.id } }).catch((error) => { return { error } })
    if (!update || (update && update.error)) {
        return { error: 'Error in updating task' }
    }
    return { data: update }
}
async function revoke(id, userData) {
    let valid = await check({ id }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findTask = await Task.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!findTask || (findTask && findTask.error)) {
        return { error: 'Task not found' }
    }
    if (findTask.createdBy != userData.id) {
        return { error: 'Task is not created by user ' }
    }
    let update = await Task.update({ assignTo: null }, { where: { id: findTask.id } }).catch((error) => { return { error } })
    if (!update || (update && update.error)) {
        return { error: 'Error in updating task' }
    }
    return { data: update }
}
module.exports = {
    create,
    update,
    readOne,
    readAll,
    tDelete,
    assign,
    ustatus,
    revoke
}