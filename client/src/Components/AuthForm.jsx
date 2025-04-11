import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
axios.defaults.withCredentials = true;
const AuthForm = ({ form, setForm, isLogin, setIsLogin, onSubmit, setUser }) => {
  return (
    <div className="flex items-center justify-center">

    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={onSubmit} className="flex items-center justify-center m-4">

        <div className="grid grid-cols-1 gap-4 m-auto p-8 min-w-[340px] sm:min-w-[540px] border rounded-xl shadow-lg">

        {!isLogin && (
            <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </div>
      </form>

      <div className="my-4 text-center text-gray-600">OR</div>

      <div className="p-4"><GoogleLogin
        onSuccess={async (credentialResponse) => {
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
              credential: credentialResponse.credential,
            });
          setUser(res.data.user);
        }}
        onError={() => alert("Google Login Failed")}
        /></div>

      <p className="mt-4 text-sm text-center text-gray-600">
        {isLogin ? "Don't have an account?" : "Already registered?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-2 text-blue-600 underline"
          >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
        </div>
    </div>
  );
};

export default AuthForm;