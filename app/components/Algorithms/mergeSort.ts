import { AnimationArrayType } from "@/app/lib/types";

function merge(
  array: number[],
  begin: number,
  middle: number,
  finish: number,
  animations: AnimationArrayType,
  pseudocodeSteps: number[]
) {
  pseudocodeSteps.push(3); // Highlight "merge(arr, i, i+k, min(i+2k, n))"

  const left = array.slice(begin, middle);
  const right = array.slice(middle, finish);

  let i = 0;
  let j = 0;
  let k = begin;
  while (i < left.length && j < right.length) {
    pseudocodeSteps.push(4); // Highlight comparison inside merge
    animations.push([[begin + i, middle + j], false]);
    if (left[i] <= right[j]) {
      animations.push([[k, left[i]], true]);
      array[k] = left[i];
      i += 1;
    } else {
      animations.push([[k, right[j]], true]);
      array[k] = right[j];
      j += 1;
    }
    k++;
  }
  while (i < left.length) {
    pseudocodeSteps.push(5); // Highlight left array merge
    animations.push([[begin + i], false]);
    animations.push([[k, left[i]], true]);
    array[k] = left[i];
    i += 1;
    k += 1;
  }
  while (j < right.length) {
    pseudocodeSteps.push(6); // Highlight right array merge
    animations.push([[middle + j], false]);
    animations.push([[k, right[j]], true]);
    array[k] = right[j];
    j += 1;
    k += 1;
  }
}

function runMergeSort(
  array: number[],
  pseudocodeSteps: number[],
  animations: AnimationArrayType
) {
  pseudocodeSteps.push(0); // Highlight outer loop for k
  for (let k = 1; k < array.length; k = 2 * k) {
    pseudocodeSteps.push(1); // Highlight inner loop for i
    for (let i = 0; i < array.length; i += 2 * k) {
      pseudocodeSteps.push(2); // Highlight parameters for merge
      const begin = i;
      const middle = i + k;
      const finish = Math.min(i + 2 * k, array.length);
      merge(array, begin, middle, finish, animations, pseudocodeSteps);
    }
  }
}

export function generateMergeSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType, pseudocodeSteps: number[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const auxiliaryArray = array.slice();
  const animations: AnimationArrayType = [];
  const pseudocodeSteps: number[] = [];

  runMergeSort(auxiliaryArray, pseudocodeSteps, animations);
  runAnimation(animations, pseudocodeSteps); // Pass animations and pseudocodeSteps
}
