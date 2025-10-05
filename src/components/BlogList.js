import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.log(err));
    
    axios.get("http://localhost:5000/comments")
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/blogs/${id}`)
      .then(() => setBlogs(blogs.filter(blog => blog.id !== id)));
  };

  const handleLike = (blogId) => {
    const blog = blogs.find(b => b.id === blogId);
    if (blog) {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        likedBy: [...(blog.likedBy || []), `user${Date.now()}`]
      };
      
      axios.put(`http://localhost:5000/blogs/${blogId}`, updatedBlog)
        .then(() => {
          setBlogs(blogs.map(b => b.id === blogId ? updatedBlog : b));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleShare = (blog) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.content.substring(0, 100) + "...",
        url: window.location.origin + `/blogs/${blog.id}`
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin + `/blogs/${blog.id}`);
      alert("Blog link copied to clipboard!");
    }
  };

  const getCommentCount = (blogId) => {
    return comments.filter(comment => comment.blogId === blogId).length;
  };

  return (
    <div>
      <h2 className="blog-title">All Blogs</h2>
      {blogs.map(blog => (
        <div className="card my-3 blog-card fade-in" key={blog.id}>
          <div className="card-body">
            <div className="author-info">
              <img 
                src={blog.authorProfilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} 
                alt={blog.author}
                className="profile-picture"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                }}
              />
              <div className="author-details">
                <h6>{blog.author}</h6>
                <small>{blog.date}</small>
              </div>
            </div>
            
            <h5 className="blog-title">{blog.title}</h5>
            <p className="blog-content">{blog.content.substring(0, 100)}...</p>
            
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="btn-group-gap" role="group">
                <Link to={`/blogs/${blog.id}`} className="btn btn-primary btn-sm">
                  <i className="bi bi-eye me-1"></i>Read More
                </Link>
                <Link to={`/edit/${blog.id}`} className="btn btn-warning btn-sm">
                  <i className="bi bi-pencil me-1"></i>Edit
                </Link>
                <button onClick={() => handleDelete(blog.id)} className="btn btn-danger btn-sm">
                  <i className="bi bi-trash me-1"></i>Delete
                </button>
              </div>
              
              <div className="action-buttons">
                <button 
                  onClick={() => handleLike(blog.id)} 
                  className="btn btn-outline-danger btn-sm btn-like"
                >
                  <i className="bi bi-heart"></i> {blog.likes || 0}
                </button>
                
                <button 
                  onClick={() => handleShare(blog)} 
                  className="btn btn-outline-primary btn-sm btn-share"
                >
                  <i className="bi bi-share"></i> Share
                </button>
                
                <Link 
                  to={`/blogs/${blog.id}#comments`} 
                  className="btn btn-outline-info btn-sm btn-comment"
                >
                  <i className="bi bi-chat"></i> {getCommentCount(blog.id)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlogList;
