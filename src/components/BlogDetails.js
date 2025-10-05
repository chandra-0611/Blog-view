import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: "", content: "" });

  useEffect(() => {
    axios.get(`http://localhost:5000/blogs/${id}`)
      .then(res => setBlog(res.data))
      .catch(err => console.log(err));
    
    axios.get(`http://localhost:5000/comments?blogId=${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleLike = () => {
    if (blog) {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        likedBy: [...(blog.likedBy || []), `user${Date.now()}`]
      };
      
      axios.put(`http://localhost:5000/blogs/${id}`, updatedBlog)
        .then(() => setBlog(updatedBlog))
        .catch((err) => console.log(err));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Blog link copied to clipboard!");
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.author.trim() && newComment.content.trim()) {
      const comment = {
        ...newComment,
        blogId: parseInt(id),
        date: new Date().toISOString()
      };
      
      axios.post("http://localhost:5000/comments", comment)
        .then(() => {
          setComments([...comments, { ...comment, id: Date.now() }]);
          setNewComment({ author: "", content: "" });
        })
        .catch((err) => console.log(err));
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div>
      <div className="card p-3 mb-4 blog-card fade-in">
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
        
        <h2 className="blog-title">{blog.title}</h2>
        <p className="blog-content">{blog.content}</p>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="action-buttons">
            <button 
              onClick={handleLike} 
              className="btn btn-outline-danger btn-sm btn-like"
            >
              <i className="bi bi-heart"></i> {blog.likes || 0}
            </button>
            
            <button 
              onClick={handleShare} 
              className="btn btn-outline-primary btn-sm btn-share"
            >
              <i className="bi bi-share"></i> Share
            </button>
          </div>
          
          <Link to="/" className="btn btn-secondary">
            <i className="bi bi-arrow-left me-1"></i>Back
          </Link>
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments" className="comment-section fade-in">
        <h4>Comments ({comments.length})</h4>
        
        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <div className="row">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Your name"
                value={newComment.author}
                onChange={(e) => setNewComment({...newComment, author: e.target.value})}
                required
              />
            </div>
            <div className="col-md-6 mb-2">
              <button type="submit" className="btn btn-primary w-100">
                Add Comment
              </button>
            </div>
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Write your comment..."
              value={newComment.content}
              onChange={(e) => setNewComment({...newComment, content: e.target.value})}
              required
            />
          </div>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item fade-in">
              <div className="comment-author">
                <img 
                  src={comment.authorProfilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} 
                  alt={comment.author}
                  className="profile-picture-small"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                  }}
                />
                <div className="comment-author-details">
                  <h6>{comment.author}</h6>
                  <small>{new Date(comment.date).toLocaleDateString()}</small>
                </div>
              </div>
              <p className="mt-2 mb-0">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BlogDetails;
