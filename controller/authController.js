let userModel = require('../model/authModel')
async function register(req, res) {
    let reg = await userModel.register(req.body).catch((error) => { return { error } })
    if (!reg || (reg && reg.error)) {
        let error = (reg && reg.error) ? reg.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: reg.data })
}
async function login(req, res) {
    let log = await userModel.login(req.body).catch((error) => { return { error } })
    if (!log || (log && log.error)) {
        let error = (log && log.error) ? log.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.header({ token: log.token }).send({ msg: "login success" })
}

module.exports = {
    register,
    login
}