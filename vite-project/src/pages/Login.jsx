import Input from "/src/components/Input.jsx";
import Button from "/src/components/Button.jsx";
import React, { useState } from 'react';
import  { useNavigate } from 'react-router-dom';
import styles from "/src/styles/Login.module.css";
import Fetch from "/src/fetch.jsx";



const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();


    const { data: users, loading } = Fetch( 'users/' );
    
    const handleLogin = (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            
            const user = users.find(user => user.username === username && user.website === password);
            const userId = user.id;

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                console.log(user.id);
                navigate(`/home/users/${userId}`);
            }
            else {
                throw new Error("Invalid username or password");
            }
        }
        catch(err) {
            setError(true);
            alert("Invalid username or password");
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

    const handleSubmit = (e) => {
        e.preventDefault();
    };



    return (
    <form className={styles.login} onSubmit={handleSubmit}>
        <h1>Login</h1>
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
        <Button type="button" onClick={handleLogin} value="Login" className='null' />
        {error && <p className="error">Invalid username or password</p>}
    </form>
    )
  };
  
export default Login;