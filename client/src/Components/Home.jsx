import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserList from './UserList';
import AuthForm from './AuthForm';

const Home = () => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [isLogin, setIsLogin] = useState(false);
  
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
          withCredentials: true
        });
        setUsers(res.data);
      } catch {
        setUsers([]);
      }
    };
  
    const handleSubmit = async e => {
      e.preventDefault();
      const { name, email, password } = form;
      const url = isLogin
        ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`
        : `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;
  
      try {
        const res = await axios.post(url, { name, email, password }, {
          withCredentials: true
        });
        if (isLogin) {
          setUser(res.data.user);
        } else {
          alert("Registered: " + res.data.user.name);
          setForm({ name: "", email: "", password: "" });
          setIsLogin(true);
        }
      } catch (err) {
        alert("Error: " + (err.response?.data?.msg || "Something went wrong"));
        console.log("Detailed Error:", err.response?.data || err);
      }
    };
  
    const handleLogout = async () => {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
        withCredentials: true
      });
      setUser(null);
      setUsers([]);
    };
  
    useEffect(() => {
      const checkLogin = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
            withCredentials: true
          });
          setUser(res.data.user);
        } catch {
          setUser(null);
        }
      };
      checkLogin();
    }, []);
  
    useEffect(() => {
      if (user) fetchUsers();
    }, [user]);
  
    return (
      
        <div className='flex'>
          {user ? (
            <UserList user={user} users={users} onLogout={handleLogout} />
          ) : (
            <AuthForm
              form={form}
              setForm={setForm}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              onSubmit={handleSubmit}
              setUser={setUser}
            />
          )}
        </div>
     
    );
}

export default Home