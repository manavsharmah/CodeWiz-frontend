"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

const dsagame = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = ["TwoSum", "BubbleSort", "QuickSort", "MergeSort", "HeapSort"];

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    console.log(`Clicked on: ${item}`);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main layout container */}
      <div className="flex">
        {/* Sidebar */}
        {/* <Sidebar items={items} onItemClick={handleItemClick} /> */}

        {/* Main Content */}
        <div className="flex-1 bg-black h-auto w-auto">
          <div>
            <iframe
              src="/games/1/index.html"
              width="100%"
              height="1000px" // Adjust the height based on your game size
              frameBorder="0"
              title="Unity WebGL Game"
              allowFullScreen
            ></iframe>
            <iframe
              src="/games/2D Matrix/index.html"
              width="100%"
              height="1000px" // Adjust the height based on your game size
              frameBorder="0"
              title="Unity WebGL Game"
              allowFullScreen
            ></iframe>
            <iframe
              src="/games/Peak Element Finder/index.html"
              width="100%"
              height="1000px" // Adjust the height based on your game size
              frameBorder="0"
              title="Unity WebGL Game"
              allowFullScreen
            ></iframe>
            <iframe
              src="/games/Remove Duplicates/index.html"
              width="100%"
              height="1000px" // Adjust the height based on your game size
              frameBorder="0"
              title="Unity WebGL Game"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dsagame;
