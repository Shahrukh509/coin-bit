const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET,REFRESH_TOKEN_ACCESS} = require('../config/index');
const RefreshToken = require('../models/token');
class JWTService {
       static signAccessToken(payload,expiryTime){
            return jwt.sign(payload,ACCESS_TOKEN_SECRET,{expiresIn:expiryTime});
        }
         static signRefreshToken(payload,expiryTime){
            return jwt.sign(payload,REFRESH_TOKEN_ACCESS,{expiresIn:expiryTime});
        }
        static verifyAccessToken(token){
            return jwt.verify(token,ACCESS_TOKEN_SECRET);
        }
        static verifyRefreshToken(token){
            return jwt.verify(token,REFRESH_TOKEN_ACCESS);
        }
      static async storeToken(token,userId){
            try{
             const storeToken = new RefreshToken({
                token: token,
                userId:userId
             });
             await storeToken.save();
            }catch(error){
                console.log(error);

            }
        }
}

module.exports = JWTService;