import express from "express";
import mongoose from "mongoose";
import blogModel from "./schema/BlogSchema.js";
import upload from './config/multer.js'
import sanitize from "sanitize-html";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Connect DB
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
    .then(() => console.log("Database Connected"))
    .catch(err => console.error("DB connection error:", err));

// Routes
app.get("/", async (req, res) => {
    const posts = await blogModel.find();
    res.render("index", { posts });
});
app.get("/create", (req, res) => {
    res.render("createBlog");
});
app.post("/create", upload.single("image"), async (req, res) => {

    const sanitizedContent = sanitize(req.body.content, {
        allowedTags: ['b', 'i', 'strong', 'br'],      // this is use for new line bold and all 
        allowedAttributes: {}
    });
    try {
        const newPost = new blogModel({
            title: req.body.title,
            // content: req.body.content,  this is show simple all data in mix without new line ,bold and other
            content:sanitizedContent,
            image: req.file ? "/uploads/" + req.file.filename : null,
        });
        await newPost.save();
        res.redirect("/");

    } catch (err) {
        res.status(500).send("Error saving post");
    }
});
app.get("/delete/:id", async (req, resp) => {

    const id = req.params.id;
    const post = await blogModel.findByIdAndDelete(id)


    resp.redirect("/")

})
app.get("/details/:id", async (req, resp) => {

    const id = req.params.id;
    const post = await blogModel.findById(id)
    resp.render("details", { post })
})
app.get("/update/:id", async (req, resp) => {

    const id = req.params.id
    const post = await blogModel.findById(id)
    resp.render("updateBlog", { post })
})

app.post("/update/:id", upload.single("image"), async (req, resp) => {

    const id = req.params.id;

    // Build update object
    let updateData = {
        title: req.body.title,
        content: req.body.content,
    };
    if (req.file) {
        updateData.image = req.file ? "/uploads/" + req.file.filename : null; // only overwrite if new file uploaded
    }
    await blogModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );
    resp.redirect("/");
})

// Start server
app.listen(3100, () => {
    console.log("Server running at http://localhost:3100");
});
