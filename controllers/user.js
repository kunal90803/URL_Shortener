const User = require("../models/user");
const { v4: uuidv4 } = require('uuid');
const {setUser}=require("../services/auth")
async function handleSignup(req, res) {
    const { name, email, password } = req.body;
     {
        await User.create({
            name,
            email,
            password
        });
        res.redirect('/');
    } 
    // catch (error) {
    //     res.status(500).send("Error creating user: " + error.message);
    // }
}
async function handleLogin(req, res) {
    const { email, password } = req.body;
    const user=await User.findOne({email,password});
    console.log("user",user)
    if(!user) return res.render('login',{error:"Invalid Username or Password"})
        const sessionId=uuidv4()
        setUser(sessionId,user);
        res.cookie("uid",sessionId);
    return res.redirect("/");
}

module.exports = { handleSignup,handleLogin };
