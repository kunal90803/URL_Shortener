const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRoute");
const userRoute = require("./routes/user");
const URL = require("./models/url");
const path=require("path")
const app = express();
const PORT = 8001;
const cookieParser=require("cookie-parser")
const {restrictToLoggedinUserOnly}=require("./middlewares/auth")

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))








app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.get("/test",async(req,res)=>{
  const allUrls=await URL.find({});
  return res.render('home', {urls:allUrls,})

})

app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true } // This option returns the updated document
  );

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
