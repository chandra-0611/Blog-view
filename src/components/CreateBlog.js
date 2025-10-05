import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to create a blog post");
      navigate("/login");
      return;
    }
    
    const newBlog = {
      title,
      author: user.name,
      content,
      authorProfilePic: user.profilePic,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      likedBy: []
    };
    axios.post("http://localhost:5000/blogs", newBlog)
      .then(() => navigate("/"));
  };

  return (
    <div className="fade-in">
      <h2 className="blog-title">Add Blog</h2>
      {user ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Author</label>
            <input 
              className="form-control" 
              value={user.name}
              disabled
            />
          </div>
          <input 
            className="form-control my-2" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <textarea 
            className="form-control my-2" 
            placeholder="Content" 
            rows="5" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required
          ></textarea>
          <button className="btn btn-success">
            <i className="bi bi-plus-circle me-1"></i>Add Blog
          </button>
        </form>
      ) : (
        <div className="alert alert-warning">
          <h5>Please Login to Create a Blog Post</h5>
          <p>You need to be logged in to create a new blog post.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/login")}
          >
            <i className="bi bi-box-arrow-in-right me-1"></i>Login
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateBlog;
