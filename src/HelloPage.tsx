import React from 'react';

const HelloPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Hello, Telegram!</h1>
        <p className="text-xl text-gray-700">Welcome to our TypeScript mini-app!</p>
      </div>
    </div>
  );
};

export default HelloPage;
