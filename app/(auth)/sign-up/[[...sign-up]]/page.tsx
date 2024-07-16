'use client';

import React, { useState } from 'react';
import { Client, Account, ID } from 'appwrite';


const client = new Client()
  .setEndpoint('https://appwrite.xeve.dev/v1') // Your Appwrite endpoint
  .setProject('mvworld'); // Your project ID

const account = new Account(client);

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const result = await account.create(ID.unique(), email, password,name);
      console.log(result);
      window.location.href = '/sign-in'; // Redirect to home page after successful sign-up
    } catch (err) {
      setError('Failed to sign up. Please check your details.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSignUp} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl mb-4">Sign Up</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/sign-in" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
