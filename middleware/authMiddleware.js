let { sequelizeCon, QueryTypes, } = require('../init/dbConfig')
let security = require('../helper/security')

function authMid(permission) {
    return async (req, res, next) => {
        if (typeof (permission) != 'string') {
            return res.send('Unauthorized').status(401)
        }
        let token = req.headers.token
        if (typeof (token) != 'string') {
            return res.send('Unauthorized2').status(401)
        }
        let decrypt = await security.decryption(token, "12345").catch((error) => { return { error } })
        if (!decrypt || (decrypt && decrypt.error)) {
            return res.send('Unauthorized3').status(401)
        }
        let query = `select user.id,user.name,user.email,p.name as permission
        from user
        left join userpermission as up
        on user.id=up.userID
        left join permission as p
        on up.permissionID=p.id
        where user.id='${decrypt.id}'
        and token='${token}'`
        let user = await sequelizeCon.query(query, { type: QueryTypes.SELECT }).catch((error) => {
            return { error }
        })
        if (!user || (user && user.error)) {
            return res.send('Unauthorized4')
        }
        let permissions = {}
        for (let i of user) {
            if (i.permission) {
                permissions[i.permission] = true
            }
        }

        if ((permissions.length <= 0 || !permissions[permission])) {
            return res.send('Unauthorized5').status(403)
        }
        req['userData'] = {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            permissions
        }
        next()
    }
}


module.exports = {
    authMid
}