import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  content:{ type: String, required: true },
  image: String,

    createdAt: {
    type: Date,
    default: Date.now,  
  }
  
});

export default mongoose.model("blogs", blogSchema);
