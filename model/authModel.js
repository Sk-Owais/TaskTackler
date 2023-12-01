let { User } = require('../schema/userSchema')
let { UserPermission } = require('../schema/userPermissionSchema')
let joi = require('joi')
let security = require('../helper/security')

async function checkRegister(data) {
    let schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function register(params) {
    let valid = await checkRegister(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let find = await User.findOne({ where: { email: params.email } }).catch((error) => { return { error } })
    if (find || (find && find.error)) {
        return { error: 'Email already exists' }
    }
    let msgDg = await security.hash(params.password).catch((error) => { return { error } })
    if (!msgDg || (msgDg && msgDg.error)) {
        return { error: 'Error in hashing' }
    }
    let userData = {
        name: params.name,
        email: params.email,
        password: msgDg.data
    }
    let data = await User.create(userData).catch((error) => { return { error } })
    console.log("🚀 ~ file: authModel.js:43 ~ register ~ data:", data)
    if (!data || (data && data.error)) {
        return { error: 'Error on create new user' }
    }
    let userPermission = {
        userID: data.id,
        permissionID: 1
    }
    let permisionCreate = await UserPermission.create(userPermission).catch((error) => { return { error } })
    console.log("🚀 ~ file: authModel.js:52 ~ register ~ permisionCreate:", permisionCreate)
    if (!permisionCreate || (permisionCreate && permisionCreate.error)) {
        return { error: 'Error on create permission' }
    }
    return { data }
}
async function checkLogin(data) {
    let schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function login(params) {
    let valid = await checkLogin(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findUser = await User.findOne({ where: { email: params.email } }).catch((error) => { return { error } })
    if (!findUser || (findUser && findUser.error)) {
        return { error: 'User not found' }
    }
    let msgDg = await security.compare(params.password, findUser.password).catch((error) => { return { error } })
    if (!msgDg || (msgDg && msgDg.error)) {
        return { error: 'Error in hash' }
    }
    let token = await security.encryption({ id: findUser.id }, "12345").catch((error) => { return { error } })
    if (!token || (token && token.error)) {
        return { error: token.error }
    }
    let updata = await User.update({ token }, { where: { id: findUser.id } }).catch((error) => { return { error } })
    if (!updata || (updata && updata.error)) {
        return { error: 'Error update user' }
    }
    return { token }
}

module.exports = {
    register,
    login
}