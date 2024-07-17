const express=require("express");
const router=express.Router();
const {handleSignup,handleLogin} =require("../controllers/user")
router.post('/',handleSignup);
router.post('/login',handleLogin);

module.exports=router