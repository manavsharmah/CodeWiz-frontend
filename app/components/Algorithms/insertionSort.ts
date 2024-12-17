import { AnimationArrayType } from "@/app/lib/types";

function runInsertionSort(
  array: number[],
  animations: AnimationArrayType,
  pseudocodeSteps: number[]
) {
  for (let i = 1; i < array.length; i++) {
    pseudocodeSteps.push(1); // Highlight "key = arr[i]"
    animations.push([[i], false]);

    const currentValue = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > currentValue) {
      pseudocodeSteps.push(2); // Highlight "while j >= 0 and arr[j] > key"
      animations.push([[j, j + 1, i], false]);
      array[j + 1] = array[j];
      animations.push([[j + 1, array[j]], true]);
      j -= 1;
    }

    pseudocodeSteps.push(3); // Highlight "arr[j+1] = key"
    array[j + 1] = currentValue;
    animations.push([[j + 1, currentValue], true]);
  }
}

export function generateInsertionSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType, pseudocodeSteps: number[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationArrayType = [];
  const pseudocodeSteps: number[] = [];
  const auxiliaryArray = array.slice();

  runInsertionSort(auxiliaryArray, animations, pseudocodeSteps);
  runAnimation(animations, pseudocodeSteps);
}
