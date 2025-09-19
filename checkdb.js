import mongoose from "mongoose";

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB").then (()=>{

        console.log("✅ Database Connected");
    })

    // Define schema & model
    const postSchema = new mongoose.Schema({
      title: String,
      content: String,
      createdAt: { type: Date, default: Date.now }
    });

    const Post = mongoose.model("blogs", postSchema);

    // Insert one document
    const newPost = await Post.create({
      title: "Hello MongoDB",
      content: "This is my first blog post inserted from Mongoose."
    });

    // Console log inserted doc
    console.log("Inserted Post:", newPost);

    // Close connection (optional for script)
    await mongoose.connection.close();
    console.log("🔒 Connection closed");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
