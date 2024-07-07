import React, { useState, useEffect } from 'react';
import Button from "/src/components/Button.jsx";
import  { useNavigate, useParams } from 'react-router-dom';
import style from '/src/styles/Home.module.css';



const Home = () => {
  
  const actualUser = JSON.parse(localStorage.getItem('user')) || {};
  const { userId } = useParams();
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();


  function handleInfo(){
    setShowInfo(!showInfo);

  }

  function handleTodos(){
    navigate(`/users/${userId}/todos`);
  }

  function handlePosts(){
    navigate(`/users/${userId}/posts`);
  }

  function handleAlbums(){
    navigate(`/users/${userId}/albums`);
  }

  function handleLogout(){
    localStorage.removeItem('user');
    navigate('/login');
    
  }


  return(
    <main>
      <div className={style.titleOptionsContainer}>
        <h1>{actualUser.name}</h1>
        <form className={style.options}>
          <Button type="button" onClick={handleInfo} value="Info" className={style.buttons} />
          <Button type="button" onClick={handleTodos} value="Todos" className={style.buttons} />
          <Button type="button" onClick={handlePosts} value="Posts" className={style.buttons} />
          <Button type="button" onClick={handleAlbums} value="Albums" className={style.buttons} />
          <Button type="button" onClick={handleLogout} value="Logout" className={style.buttons} />
        </form>

        {showInfo && (
        <div className={style.userInfo}>
          <h2>User Information</h2>
          <p><strong>Username:</strong> {actualUser.username}</p>
          <p><strong>Email:</strong> {actualUser.email}</p>
          <p><strong>Phone:</strong> {actualUser.phone}</p>
          <p><strong>Website:</strong> {actualUser.website}</p>
          <p><strong>Address:</strong> {actualUser.address.street}, {actualUser.address.suite}, {actualUser.address.city}, {actualUser.address.zipcode}</p>
          <p><strong>Company:</strong> {actualUser.company.name}</p>
          <p><strong>Catch Phrase:</strong> {actualUser.company.catchPhrase}</p>
          <p><strong>BS:</strong> {actualUser.company.bs}</p>
        </div>
      )}
    </div>
    </main>  

  );
};
  
export default Home;