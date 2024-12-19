import React from 'react';

export const GameButton = ({ gameId }: { gameId: string }) => {
  const handleGameClick = () => {
    window.location.href = `/dsagames/${gameId}`; // Navigate to the dynamic route
  };

  return (
    <button
      onClick={handleGameClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Play Game
    </button>
  );
};
