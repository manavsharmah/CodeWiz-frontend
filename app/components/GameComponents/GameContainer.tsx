import React from 'react';

const GameContainer = ({ gameId }: { gameId: string }) => {
  const gamePath = `/games/${gameId}/index.html`; // Directly map gameId to folder name

  return (
    <div className="flex-1 bg-black h-auto">
      <div>
        <iframe
          src={gamePath}
          width="100%"
          height="1000px" // Adjust height based on your game size
          style={{
            display: 'block', // Removes potential inline padding
            border: 'none', // Removes the iframe border
          }}
          frameBorder="0"
          title={`Game - ${gameId}`}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default GameContainer;
