const express = require('express');
const router = express.Router();
const authContoller = require('../controller/authController');
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');
const auth = require('../middlewares/auth');


// test

router.get('/test',(req,res)=>
{ res.json({msg:'hello world from test'});
})

// Authentication
                        // register
   router.post('/register',authContoller.register); 
                        //login
router.post('/login',authContoller.login);
                        //logout
router.post('/logout', auth, authContoller.logout);
                        //refresh
router.get('/refresh', authContoller.refresh);
                        //blog
router.post('/blog', auth, blogController.create);
router.get('/blog/all', auth, blogController.getAll);
router.get('/blog/:id', auth, blogController.getById);
router.put('/blog', auth, blogController.update);
router.delete('/blog/:id', auth, blogController.delete);

                        //comment
router.post('/comment', auth, commentController.create);
router.get('/comment/all', auth, commentController.getAll);
router.get('/comment/:id', auth, commentController.getById);
router.put('/comment', auth, commentController.update);
router.delete('/comment/:id', auth, commentController.delete);

module.exports=router;