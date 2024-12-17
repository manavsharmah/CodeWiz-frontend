import React from 'react'

const GameContainer = () => {
  return (
    <div>
        <iframe 
            src="/games/"
            width="100%"
            height="1000px" // Adjust the height based on your game size
            frameBorder="0"
            title="Unity WebGL Game"
            allowFullScreen       
        ></iframe>
    </div>
  )
}

export default GameContainer
