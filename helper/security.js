let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')

function encryption(ptext, key) {
    return new Promise((res, rej) => {
        jwt.sign(ptext, key, (error, token) => {
            if (error) {
                return rej(error)
            }
            return res(token)
        })
    })
}

function decryption(ptext, key) {
    return new Promise((res, rej) => {
        jwt.verify(ptext, key, (error, token) => {
            if (error) {
                return rej(error)
            }
            return res(token)
        })
    })
}

async function hash(ptext, salt = 10) {
    let encrypt = await bcrypt.hash(ptext, salt).catch((error) => {
        return { error }
    })
    if (!encrypt || (encrypt && encrypt.error)) {
        return { error: encrypt.error }
    }
    return { data: encrypt }
}

async function compare(ptext, etext) {
    let check = await bcrypt.compare(ptext, etext).catch((error) => {
        return { error }
    })
    if (!check || (check && check.error)) {
        return { error: check && check.error ? check.error : true }
    }
    return { data: true }
}

module.exports = {
    encryption,
    decryption,
    hash,
    compare
}