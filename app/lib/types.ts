export type SortingAlgorithmType =
  | "bubble"
  | "insertion"
  | "selection"
  | "merge"
  | "quick"
  | "heap"
  | "radix";
  
export type AlgorithmInfo = {
  title: string;
  description: string;
  worstCase: string;
  averageCase: string;
  bestCase: string;
};

export type SortingAlgorithmsData = {
  [key in SortingAlgorithmType]: AlgorithmInfo;
};

export type AnimateSpeedType = "slow" | "medium" | "fast" | "lighning";

export type SelectOptionsType = {
  label: string;
  value: string;
};

export type AnimationArrayType = [number[], boolean][];
