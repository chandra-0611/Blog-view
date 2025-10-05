import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import BlogList from "./components/BlogList";
import BlogDetails from "./components/BlogDetails";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import "./styles/custom.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/edit/:id" element={<EditBlog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
