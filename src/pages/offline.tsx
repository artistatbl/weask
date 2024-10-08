import React from 'react';
import Head from 'next/head';

const Offline = () => (
  <>
    <Head>
      <title>WeAsk - Offline</title>
    </Head>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">You&#39;re offline</h1>
      <p className="text-xl mb-8">Please check your internet connection and try again.</p>
      <button
        className="bg-gray-800 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  </>
);

export default Offline;