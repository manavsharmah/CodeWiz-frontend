"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import GameContainer from '@/app/components/GameComponents/GameContainer';

const DsaGamePage = () => {
  const { game } = useParams(); // Extract the game ID dynamically

  return (
    <div className="w-full h-screen flex flex-col bg-black">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <GameContainer gameId={game} /> {/* Pass the ID to GameContainer */}
      </div>
    </div>
  );
};

export default DsaGamePage;
