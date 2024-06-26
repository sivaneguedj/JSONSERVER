import { useState, useEffect } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Todos from './pages/Todos.jsx';
import Posts from './pages/Posts.jsx';
import Albums from './pages/Albums.jsx';
import CompleteRegistration from "./pages/CompleteRegistration.jsx";
import './App.css'

 export default function App() {


   return (
    
     <BrowserRouter>
       <Routes>
         <Route path="/" element={<Layout />}>
           <Route path="login" element={<Login />} />
           <Route path="register" element={<Register />} />
           <Route path="home/users/:userId" element={<Home />} />
           <Route path="complete-registration" element={<CompleteRegistration />} />
           <Route path="/users/:userId/todos" element={<Todos />} />
          <Route path="/users/:userId/posts" element={<Posts />} />
          <Route path="/users/:userId/albums" element={<Albums />} />
         </Route>
       </Routes>
     </BrowserRouter>
   );
 }







