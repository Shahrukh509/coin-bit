const Joi = require('joi');
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,25}$/;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const DTO = require('../dto/user');
const JwtService = require('../services/JWTService');
const JWTService = require('../services/JWTService');
const dbToken = require('../models/token');
const UserDTO = require('../dto/user');




const authContoller = {
   
    async register(req,res,next){

        const userRegisterSchema= Joi.object({
           username: Joi.string().min(5).max(30).required(),
           name: Joi.string().max(30).required(),
           email: Joi.string().email().required(),
           password: Joi.string().pattern(passwordPattern,{message: errorMessage}).required(),
           confirmPassword: Joi.ref('password')
        });

        const { error } = userRegisterSchema.validate(req.body);
        if(error){
            
            return next(error);
        }

        const { username,name,email,password } = req.body;

        try{
            const emailInUse = await User.exists({email});
            const usernameInUse = await User.exists({username});
            if(emailInUse){
                const error={
                    status: 409,
                    message: 'Email already registered, use another'
                }
                
                return next(error);  
                
                
            }
            if(usernameInUse){
                const error={
                    status: 409,
                    message: 'Username not available, use another'
                }
                
                return next(error);

            }

        }catch(error){
            
            return next(error);

        }

        const hashedPassword = await bcrypt.hash(password,10);
        let accessToken;
        let refreshToken;
        let user;

        try{
            const userToRegister = new User({
                username,
                email,
                name,
                password:hashedPassword
            });
             user = await userToRegister.save();
            accessToken = JwtService.signAccessToken({_id: user._id},'30m');
            refreshToken = JwtService.signRefreshToken({id: user._id},'60m');

        }catch(error){
            
          return next(error);
        }

        await JwtService.storeToken(refreshToken,user._id);

        res.cookie('accessToken',accessToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
        });
        res.cookie('refreshToken',refreshToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
        })
        const userDto = new DTO(user);
        return res.status(201).json({user:userDto,auth:true});
    },
    async login(req,res,next){
        const userLoginSchema= Joi.object({
            username:Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern)
        });
       const { error } = userLoginSchema.validate(req.body);
       if(error) {  return next(error);}

       const {username,password} = req.body;
       let user;
       try{
         user = await User.findOne({username: username});
       
        if(!user) {
            const error={
            status: 401,
            message: 'Invalid username or password'
           };
           
           return next(error);
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match) {
            const error={
            status: 401,
            message: 'Invalid password'
           };
           

           return next(error);
        }

     }
       catch(error){
        
        return next(error);
       }

    const accessToken = JWTService.signAccessToken({_id:user._id},'30m');
    const refreshToken = JWTService.signRefreshToken({_id: user._id},'60m');

    try{

       await dbToken.updateOne({
            _id:user._id
        },
        {token: refreshToken},
        {upsert: true}
        )

    }catch(error){

        return next(error);

    }
  
    res.cookie('accessToken',accessToken,{
        maxAge: 1000*60*60*24,
        httpOnly:true
    });
    res.cookie('refreshToken',refreshToken,{
        maxAge: 1000*60*60*24,
        httpOnly:true
    })

       const userdto = new DTO(user);

       return res.status(200).json({user:userdto,auth:true});
    },
    async logout(req,res,next){

        console.log(req.user,'ye hai request bhai dekhly bad men nh bolna');
        
        const { refreshToken } = req.cookies;

        try {
            await dbToken.deleteOne({token: refreshToken});
        }
        catch(error) {
            return next(error);
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({user: null, auth:false});

    },

    async refresh(req,res,next){

        const originalRefreshToken = req.cookies.refreshToken;
        let id;
        try{
            id = JwtService.verifyRefreshToken(originalRefreshToken)._id;

        }catch(e){

            const error={
                status:401,
                message: 'Unauthorized'
            }

            return next(error);

        }

        try{
            const match = dbToken.findOne({_id:id, token: originalRefreshToken});
            if(!match){
                const error={
                    status:401,
                    message: 'Unauthorized'
                }
                return next(error);
            }
        }
        catch(e){
            return next(e);

        }

        try{
            const accessToken = JWTService.signAccessToken({_id:id},'30m');
            const refreshToken = JwtService.signRefreshToken({_id:id},'60m');
            await dbToken.updateOne({_id:id},{token:refreshToken});
            res.cookie('accessToken',accessToken,{
                maxAge:1000*60*60*24,
                httpOnly:true
            });
            res.cookie('refreshToken',refreshToken,{
                maxAge:1000*60*60*24,
                httpOnly:true
            })
        }catch(e){
            
            return next(e);

        }

        const user = await User.findOne({_id:id});
        console.log(user,'ye hai user');
        const userDto = new UserDTO(user);
      
         return res.status(200).json({
            user: userDto,
            auth:true
        })

    }
}

module.exports = authContoller;