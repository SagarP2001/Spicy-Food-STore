import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', form);
            alert('Signup successful');
        } catch (err) {
            alert(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <input name="address" placeholder="Address" onChange={handleChange} required />
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default Signup;
