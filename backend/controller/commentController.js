const Joi = require('joi');
const fs = require('fs');
const {BACKEND_SERVER_PATH} = require('../config/index');
const CommentDTO = require('../dto/comment');
const Blog = require('../models/blog');
const BlogDetailsDTO = require('../dto/blog-details');
const Comment = require('../models/comment');
const blog = require('../models/blog');
const comment = require('../models/comment');

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const commentController={
    async create(req, res, next){
        const createCommentSchema = Joi.object({
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blog: Joi.string().regex(mongodbIdPattern).required(),
        });

        const {error} = createCommentSchema.validate(req.body);
        if(error) return next(error);
        const {content, author, blog } = req.body;
        console.log(req.body,'req.body');

        try{
            const newComment = new Comment({
               content,author,blog 
            });
            await newComment.save();



        }catch(e){
            return next(e);

        }

        return res.status(201).json({message: 'comment created'});



    },
    async getAll(req, res, next){

        try{
            const blogs = await Blog.find({});
            const blogsDto =[];
            for(let i=0;i<blogs.length;i++){
                blogsDto.push(new BlogDTO(blogs[i]));
            }
            return res.status(200).json({blogs: blogsDto});
        }
        catch(e){
            return next(e);
        }

    },
    async getById(req, res, next){
            const getByIdSchema = Joi.object({
                id: Joi.string().regex(mongodbIdPattern).required()
            });
            let { error} = getByIdSchema.validate(req.params);
            if(error) return next(error);
            let comments;
            const {id} = req.params;
            try{
                comments = await Comment.find({blog:id}).populate('author');

            }
            catch(e){ return next(e);}
             console.log(comments,'ye get by block id k andar se araha hai');
             if(!comments){
                 error={
                    status: 409,
                    message: 'No blog exist against this id'
                }
                return next(error);
             } 
            // blog = new BlogDetailsDTO(blog);

            // return res.status(200).json({ blog: new BlogDTO(blog)});
            let alteredComments=[];
            for(let i=0; i< comments.length; i++) alteredComments.push(new CommentDTO(comments[i]));
            return res.status(200).json({ data: alteredComments});

    },
    async update(req, res, next){

        const updateBloSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blogId: Joi.string().regex(mongodbIdPattern).required(),
            photo: Joi.string(),

        });

        const {error} = updateBloSchema.validate(req.body);
        const {title,content,author,blogId,photo} = req.body;
        let blog;
        try{
            blog = await Blog.findOne({_id:blogId});


        }
        catch(e) {return next(e);}

        if(photo){
            let previouPhoto = blog.photoPath;
            previouPhoto = previouPhoto.split('/').at(-1);
            fs.unlinkSync(`storage/${previouPhoto}`);
            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);based64,/,''),'base64');
            const imagePath = `${Date.now()}-${author}.png`;
            try{
                fs.writeFileSync(`storage/${imagePath}`,buffer);
    
            }catch(e){
                return next(e);
    
            }
            await blog.updateOne({_id:blogId
            },
                {title,content,photoPath:`${BACKEND_SERVER_PATH}/storage/${photoPath}`
            })
        }
            else await Blog.updateOne({_id:blogId},{title,content});
            return res.status(200).json({
                message: 'blog updated !'
            });

            
        

    },
    async delete(req, res, next){

        const deleteCommentSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()    
        });
        const {error} = deleteCommentSchema.validate(req.params);
        const {id} = req.params;
        try{
            await Blog.deleteOne({_id: id});
            await Comment.deleteMany({_id:id});


        }
        catch(e) {
            return next(e);
        }
        return res.status(200).json({
            message: 'blog deleted !'
        });

    },

}

module.exports = commentController;
