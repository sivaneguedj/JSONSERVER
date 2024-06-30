import Input from "/src/components/Input.jsx";
import Button from "/src/components/Button.jsx";
import React, { useState } from 'react';
import  { useNavigate } from 'react-router-dom';
import "./Login.Module.css";
import Fetch from "/src/fetch.jsx";



const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();



  const { data: users, loading } = Fetch( 'users/' );
  
  
  const handleRegister = (e) => {
      e.preventDefault();

      if (password !== verPassword) {
        setError('Passwords do not match');
        return;
      }

      if (loading) return;

      try {
          const user = users.find(user => user.username === username && user.website === password);
          
          if (user) {
            throw new Error("User already exist in the system");              
          }
          else {
            console.log("New user Accepted");

            const maxId = users.reduce((max, user) => Math.max(max, parseInt(user.id, 10)), 0);
            const newUser = {
                id: maxId + 1,
                username,
                website: password
              };

              // Open a new window to complete the registration
              window.open('/complete-registration', '_blank');
              localStorage.setItem('partialUser', JSON.stringify({ newUser }));  
              
          }
      }
      catch(err) {
          setError(true);
          alert( err);
      }
      finally{
          setTimeout(() => {
              setError(false);
          }, 300)
      }


  }

  
  // Handles input of username and password
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleVerPasswordChange = (e) => setVerPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
  };



  return (
  <form className="login" onSubmit={handleSubmit}>
      <h1>Register</h1>
      <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          required
      />
      <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
      />
      <Input
          type="password"
          placeholder="Verify Password"
          value={verPassword}
          onChange={handleVerPasswordChange}
          required
      />
      <Button type="submit" onSubmit={handleRegister} value="Register" className='null' />
      {error && <p className="error">User already exist</p>}
  </form>
  )
  };
  
  export default Register;