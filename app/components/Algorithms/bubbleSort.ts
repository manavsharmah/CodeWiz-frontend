import { AnimationArrayType } from "@/app/lib/types";

function runBubbleSort(array: number[], animations: AnimationArrayType, pseudocodeSteps: number[]) {
  for (let i = 0; i < array.length - 1; i++) {
    pseudocodeSteps.push(0); // Highlight "for i from 0 to n-1"
    for (let j = 0; j < array.length - i - 1; j++) {
      pseudocodeSteps.push(1); // Highlight "for j from 0 to n-i-1"
      animations.push([[j, j + 1], false]);
      if (array[j] > array[j + 1]) {
        pseudocodeSteps.push(2); // Highlight "if array[j] > array[j+1]"
        animations.push([[j, array[j + 1]], true]);
        animations.push([[j + 1, array[j]], true]);
        [[array[j], array[j + 1]]] = [[array[j + 1], array[j]]];
        pseudocodeSteps.push(3); // Highlight "swap(array[j], array[j+1])"
      }
    }
  }
}

export function generateBubbleSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType, pseudocodeSteps: number[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationArrayType = [];
  const pseudocodeSteps: number[] = [];
  const auxiliaryArray = array.slice();
  runBubbleSort(auxiliaryArray, animations, pseudocodeSteps);
  runAnimation(animations, pseudocodeSteps);
}
