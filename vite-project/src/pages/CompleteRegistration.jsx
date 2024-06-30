import Input from "/src/components/Input.jsx";
import Button from "/src/components/Button.jsx";
import React, { useState, useEffect } from 'react';
import  { useNavigate } from 'react-router-dom';
import "./Login.Module.css";



const CompleteRegistration = () => {

    const partialUser = JSON.parse(localStorage.getItem('partialUser')) || {};
    const [name, setName] = useState('');
    const [username, setUsername] = useState(partialUser.newUser?.username || '');
    const [email, setEmail] = useState('');
    
    const [address, setAddress] = useState({
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: {
                "lat": '',
                "lng": ''
            }
    });
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState(partialUser.newUser?.website || '');
    const [company, setCompany] = useState({
        name: '',
        catchPhrase: '',
        bs: ''
    });
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [newUserId, setNewUserId] = useState(partialUser.newUser?.maxId || '');


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3500/users');
                const users = await response.json();
                const maxId = users.reduce((max, user) => Math.max(max, parseInt(user.id, 10)), 0);
                setNewUserId(maxId);
            } catch (error) {
                console.log('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

   
    const newUser = {
        id: newUserId,
        ...partialUser.newUser,
        name,
        username: partialUser.newUser.username,
        email,
        address,
        phone,
        website: partialUser.newUser.website,
        company
    };

    
    
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    try {

        // Save to db.json (via POST request to JSON server)
        const response = await fetch('http://localhost:3500/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            throw new Error('Failed to save user');
        }


        // Save to local storage
        localStorage.removeItem('partialUser');
        localStorage.setItem('user', JSON.stringify(newUser));
        alert('User registered successfully!');
        navigate('/home/users/{newUserId}');

    } catch (err) {
        setError(true);
        alert(err.message);
    }
};



  return (
    <form className="complete-registration login" onSubmit={handleCompleteRegistration}>
        <h1>Complete Registration</h1>
        <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />
        <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <Input
          type="text"
          placeholder={partialUser.newUser?.username || 'Username'}
          value={partialUser.newUser?.username || ''}
          readOnly
          required
      />
        <Input
            type="text"
            placeholder="Street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
        />
        <Input
            type="text"
            placeholder="Suite"
            value={address.suite}
            onChange={(e) => setAddress({ ...address, suite: e.target.value })}
            required
        />
        <Input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
        />
        <Input
            type="text"
            placeholder="Zipcode"
            value={address.zipcode}
            onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
            required
        />
        <Input
            type="text"
            placeholder="Geo lattitude"
            value={address.lat}
            onChange={(e) => setAddress({ ...address, geo: e.target.value })}
            required
        />
        <Input
            type="text"
            placeholder="Geo longitude"
            value={address.lng}
            onChange={(e) => setAddress({ ...address, geo: e.target.value })}
            required
        />
        <Input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
        />
        <Input
            type="text"
            placeholder={partialUser.newUser?.website || 'Website'}
            value={partialUser.newUser?.website || ''}
            readOnly
            required
        />
        <Input
            type="text"
            placeholder="Company Name"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
            required
        />
        <Input
            type="text"
            placeholder="Catch Phrase"
            value={company.catchPhrase}
            onChange={(e) => setCompany({ ...company, catchPhrase: e.target.value })}
            required
        />
        <Input
            type="text"
            placeholder="Business Strategy"
            value={company.bs}
            onChange={(e) => setCompany({ ...company, bs: e.target.value })}
            required
        />
        <Button type="submit" onSubmit={handleCompleteRegistration} value="Complete Registration" />
        {error && <p className="error">Failed to complete registration</p>}
    </form>
    );
  };
  
  export default CompleteRegistration;