import React from 'react'

const UserList = ({ user, users, onLogout }) => {
    return (
        <div>
        <div className='min-w-screen px-4 sm:px-24 py-2'>
        <div className='flex items-center justify-between'>
          <h1 className="sm:text-5xl font-semibold mb-2">Welcome, {user.name}</h1>
          <button
            onClick={onLogout}
            className="mb-4 sm:text-3xl bg-red-500 hover:bg-red-700 text-white px-2 sm:px-6 sm:py-3 rounded sm:rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
      
      <hr className="border-gray-400 w-full" />
      
      <div className=' flex flex-col items-center min-w-screen'>
        <h2 className="sm:text-2xl font-bold  my-4 text-center">All Users</h2>
        <ul className="">
          {users.map(u => (
            <li key={u.email} className="text-sm text-gray-100 bg-gray-900 w-full p-2 mb-2 rounded-md">
              {u.name} - {u.email}
            </li>
          ))}
        </ul>
      </div>
            </div>
      
    );
  };
  
  export default UserList