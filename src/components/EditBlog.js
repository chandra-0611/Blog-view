import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/blogs/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setAuthor(res.data.author);
        setContent(res.data.content);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedBlog = { 
      title, 
      author, 
      content, 
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      likedBy: []
    };
    axios.put(`http://localhost:5000/blogs/${id}`, updatedBlog)
      .then(() => navigate("/"));
  };

  return (
    <div>
      <h2>Edit Blog</h2>
      <form onSubmit={handleUpdate}>
        <input className="form-control my-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="form-control my-2" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <textarea className="form-control my-2" rows="5" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
        <button className="btn btn-primary">
          <i className="bi bi-check-circle me-1"></i>Update Blog
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
