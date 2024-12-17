import { AnimationArrayType } from "@/app/lib/types";

function runSelectionSort(
  array: number[],
  animations: AnimationArrayType,
  pseudocodeSteps: number[]
) {
  for (let i = 0; i < array.length - 1; i++) {
    pseudocodeSteps.push(1); // Highlight "minIndex = i"
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      pseudocodeSteps.push(2); // Highlight "if arr[j] < arr[minIndex]"
      animations.push([[j, i], false]);
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    pseudocodeSteps.push(3); // Highlight "swap(arr[i], arr[minIndex])"
    animations.push([[i, array[minIndex]], true]);
    animations.push([[minIndex, array[i]], true]);
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
  }
}

export function generateSelectionSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType, pseudocodeSteps: number[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return;

  const animations: AnimationArrayType = [];
  const pseudocodeSteps: number[] = [];
  const auxiliaryArray = array.slice();

  runSelectionSort(auxiliaryArray, animations, pseudocodeSteps);
  runAnimation(animations, pseudocodeSteps);
}
