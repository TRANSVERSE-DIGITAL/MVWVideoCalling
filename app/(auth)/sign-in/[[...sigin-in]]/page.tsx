'use client';

import React, { useState } from 'react';
import { Client, Account } from 'appwrite';

const client = new Client()
  .setEndpoint('https://appwrite.xeve.dev/v1') // Your Appwrite endpoint
  .setProject('mvworld'); // Your project ID

const account = new Account(client);

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await account.createEmailPasswordSession(email, password);
      window.location.href = '/'; // Redirect to home page after successful sign-in
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSignIn} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl mb-4">Sign In</h1>
        {error && <p className="text-red-500">{error}</p>}
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
          Sign In
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignInPage;
