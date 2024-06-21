const jwt = require('jsonwebtoken')
const token = require('../models/token.js')
const { options } = require('../routers/authRouter')



const generateTokens = async (userId) => {
    try {
        const refresh = jwt.sign({ Id: userId }, process.env.REFRESH_KEY, {
            expiresIn: '2d',
        })
        const access = jwt.sign({ Id: userId }, process.env.ACCESS_KEY, {
            expiresIn: '10s',
        })

       

        const obj = await token.findOne({ userId: userId })
        if (obj) {
            obj.token = refresh;

            await obj.save();
        }else{
            const newToken = await token.create({token:refresh,userId:userId})
        }

        return {
            refresh,
            access,
        }


    } catch (error) {
        return null;
    }
}

const verifyAccess = (token) => {
    try {
        const data = jwt.verify(token,process.env.ACCESS_KEY)   
        return data;
    } catch (error) {
        return null;
    }
}
const verifyRefresh = (token) => {
    try {
        const data = jwt.verify(token,process.env.REFRESH_KEY)   
        return data;
    } catch (error) {
        return null;
    }
}

module.exports = {generateTokens,verifyAccess,verifyRefresh}