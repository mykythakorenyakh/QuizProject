const tokenService = require('../services/tokenService.js')
const statusService = require('../services/statusService.js')
const emailService = require('../services/emailService.js')

const bcrypt = require('bcrypt')
const uuid = require('uuid')


const userDB = require('../models/user.js')
const tokenDB = require('../models/token.js')
const activationDB = require('../models/activation.js')

const login = async (req, res) => {
    try {

        const { email, password } = req.body;


        if (!email || !password) return statusService.forbidden(res);

        const applicant = await userDB.findOne({ email: email });

        if (!applicant) return statusService.forbidden(res);
        if (!bcrypt.compareSync(password, applicant.password)) return statusService.forbidden(res);

        if (!applicant.activated) return statusService.unauthorized(res);

        const tokens = await tokenService.generateTokens(applicant._id);

        if (!tokens) return statusService.forbidden(res);

        res.cookie('token', tokens.refresh, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 60 * 1000 });

        return res.send(tokens.access);


    } catch (error) {
        return statusService.forbidden(res);
    }

}

const register = async (req, res) => {
    try {

        const { email, password } = req.body;


        if (!email || !password) return statusService.forbidden(res);
        const applicant = await userDB.findOne({ email: email })
        if (applicant) return statusService.forbidden(res);

        const encrypted = await bcrypt.hash(password, bcrypt.genSaltSync(10))

        const newUser = await userDB.create({
            email: email,
            password: encrypted,
        })


        const url = uuid.v4();
        const activation = await activationDB.create({ userId: newUser._id, url: url })

        const isLegit = emailService.sendVerification(email,'http://localhost:3000/auth/activation/'+url)

        if(!isLegit) return statusService.forbidden(res)

        return res.send(`Activate account: http://localhost:3000/auth/activation/${url}`);

    } catch (error) {
        return statusService.forbidden(res);
    }

}

const logout = async (req, res) => {
    try {
        const refresh = req.cookies.token;

        const data = await tokenDB.deleteOne({ token: refresh });
        
        res.clearCookie('token');
        return res.send('Logged out');
    } catch (err) {
        return statusService.unauthorized(res);
    }
}

const activate = async (req, res) => {
    try {

        const { code } = req.params;

        const activation = await activationDB.findOne({ url: code })
        if (!activation) return statusService.forbidden(res);

        const applicant = await userDB.findOne({ _id: activation.userId })

        if (!applicant) return statusService.forbidden(res);
        applicant.activated = true;
        await applicant.save();

        await activationDB.deleteOne(activation);

        return res.send('Activated')

    } catch (error) {
        return statusService.forbidden(res)
    }
}

const refresh = async (req, res) => {
    try {
        const refresh = req.cookies.token;

        
        if (!refresh) return statusService.unauthorized(res)
            
        const data = await tokenDB.findOne({ token: refresh });
        


        const verify = await tokenService.verifyRefresh(refresh)



        if (!data || !verify) return statusService.unauthorized(res);



        const tokens = await tokenService.generateTokens(data.userId);

        res.cookie('token', tokens.refresh, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 60 * 1000 });

        return res.send(tokens.access);


    } catch (error) {
        return statusService.unauthorized(res)
    }
}

//Middlewere
const isAuthorized = async (req, res, next) => {
    try {
        const access = req.headers.authorization.split(' ')[1];
        const refresh = req.cookies.token;
        if (!refresh || !access) return statusService.unauthorized(res)
            
        const validAccess = await tokenService.verifyAccess(access);
        if (!validAccess) return statusService.unauthorized(res);
            
        const validRefersh = await tokenService.verifyRefresh(refresh);
        if (!validRefersh) return statusService.unauthorized(res);
            
        next();


    } catch (error) {
        return statusService.unauthorized(res);
    }
}


module.exports = {
    login, register, logout, activate, refresh,
    isAuthorized,
}