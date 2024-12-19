"use client";

import { useEffect, useState } from "react";
import { Select } from "../components/Visualizer/Select"; 
import { Slider } from "../components/Visualizer/Slider";
import Navbar from "../components/Navbar";
import { CodeViewer } from "../components/Visualizer/CodeViewer";
import { useSortingAlgorithmContext } from "../context/Visualizer";
import { SortingAlgorithmType } from "@/app/lib/types";
import {
  algorithmOptions,
  generateAnimationArray,
  sortingAlgorithmsData,
} from "@/app/lib/utils";
import { FaPlayCircle } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import "./sorting-visualizer.css";

export default function Home() {
  const {
    arrayToSort,
    isSorting,
    setAnimationSpeed,
    animationSpeed, 
    highlightedLine,
    selectedAlgorithm,
    setSelectedAlgorithm,
    requiresReset,
    resetArrayAndAnimation,
    runAnimation,
    setNumLines,
  } = useSortingAlgorithmContext();

  const pseudocode = sortingAlgorithmsData[selectedAlgorithm].pseudocode;

  const [lineWidth, setLineWidth] = useState<number>(0); // State to store the line width

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlgorithm(e.target.value as SortingAlgorithmType);
  };

  const handleLineCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumLines(Number(e.target.value)); // Update the number of lines based on selection
  };

  const handlePlay = () => {
    if (requiresReset) {
      resetArrayAndAnimation();
      return;
    }

    generateAnimationArray(
      selectedAlgorithm,
      isSorting,
      arrayToSort,
      runAnimation
    );
  };  

  useEffect(() => {
    // This will run only in the client-side
    const calculateLineWidth = () => {
      const containerWidth = window.innerWidth; // You can adjust this if necessary
      const margin = 1; // Adjust this for spacing between bars
      return (containerWidth - margin * (arrayToSort.length - 1)) / arrayToSort.length;
    };

    setLineWidth(calculateLineWidth()); // Update the line width state

    // Optional: add a resize listener to recalculate line width on window resize
    const handleResize = () => {
      setLineWidth(calculateLineWidth());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener
    };
  }, [arrayToSort.length]); // Only re-run effect if the length of the array changes

  return (
    <div>
        <Navbar/>
        <div className="pt-16 absolute h-auto w-full z-[-2] bg-[#000000] bg-[size:40px_40px]">
        <div className="flex h-full justify-center">
            <div
            id="content-container"
            className="flex max-w-[1120px] w-full flex-col lg:px-0 px-4"
            >
            <div className="h-[66px] relative flex items-center justify-between w-full">
                <h1 className="text-gray-300 text-4xl font-light hidden md:flex">
                Sorting Visulizer
                </h1>
                <div className="flex items-center justify-center gap-4">
                <Slider
                    isDisabled={isSorting}
                    value={animationSpeed}
                    handleChange={(e) => setAnimationSpeed(Number(e.target.value))}
                />
                
                <Select
                    options={algorithmOptions}
                    defaultValue={selectedAlgorithm}
                    onChange={handleSelectChange}
                    isDisabled={isSorting}
                />
                <Select
                    options={[
                    { value: "10", label: "10 lines" },
                    { value: "25", label: "25 lines" },
                    { value: "50", label: "50 lines" },
                    { value: "100", label: "100 lines" },
                    { value: "150", label: "150 lines" },
                    ]}
                    defaultValue="50"
                    onChange={handleLineCountChange}
                    isDisabled={isSorting}
                />
                <button
                    className="bg-white flex items-center justify-center"
                    onClick={handlePlay}
                >
                    {requiresReset ? (
                    <RxReset className=" h-8 w-8" />
                    ) : (
                    <FaPlayCircle className=" h-8 w-8" />
                    )}
                </button>
                </div>

                <div className="hidden sm:flex absolute top-[120%] left-0 w-full">
                <div className="flex w-full text-gray-200 p-4 rounded border border-system-purple20 bg-system-purple80 bg-opacity-10 gap-6">
                    <div className="flex flex-col items-start justify-start w-3/4">
                    <h3 className="text-lg">
                        {sortingAlgorithmsData[selectedAlgorithm].title}
                    </h3>
                    <p className="text-sm text-grey-500 pt-2">
                        {sortingAlgorithmsData[selectedAlgorithm].description}
                    </p>
                    </div>

                    <div className="flex flex-col items-start justify-start w-1/4 gap-2">
                    <h3 className="text-lg">Time Complexity</h3>
                    <div className="flex flex-col gap-2">
                        <p className="flex w-full text-sm text-gray-200">
                        <span className="w-28">Worst Case:</span>
                        <span>
                            {sortingAlgorithmsData[selectedAlgorithm].worstCase}
                        </span>
                        </p>
                        <p className="flex w-full text-sm text-gray-200">
                        <span className="w-28">Average Case:</span>
                        <span>
                            {sortingAlgorithmsData[selectedAlgorithm].averageCase}
                        </span>
                        </p>
                        <p className="flex w-full text-sm text-gray-200">
                        <span className="w-28">Best Case:</span>
                        <span>
                            {sortingAlgorithmsData[selectedAlgorithm].bestCase}
                        </span>
                        </p>
                    </div>
                    </div>
                </div>
                        <div className="code-viewer-container w-1/3 p-4">
                          <CodeViewer code={pseudocode} highlightedLine={highlightedLine} />
                        </div>
                </div>
            </div>
            <div className="relative h-[calc(100vh-120px)] w-full">
                <div className="absolute bottom-[32px] w-full mx-auto left-0 right-0 flex justify-center items-end">
                {arrayToSort.map((value, index) => (
                    <div
                    key={index}
                    className="array-line relative shadow-lg mx-0.5 opacity-70 rounded-lg default-line-color"
                    style={{
                        width: `${lineWidth}px`, // Apply dynamic width
                        height: `${value}px`, // Use the value for height
                    }}
                    ></div>
                ))}
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
}
