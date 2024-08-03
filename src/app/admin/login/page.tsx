"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call your login API to authenticate the user
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        console.log('Token received:', token);
        

        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        console.error('Login failed:', response.status, response.statusText);
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login request:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full px-4 py-2 border rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
