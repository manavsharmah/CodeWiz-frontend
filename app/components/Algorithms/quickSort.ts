import { AnimationArrayType } from "@/app/lib/types";

function partition(
  array: number[],
  begin: number,
  finish: number,
  animations: AnimationArrayType,
  pseudocodeSteps: number[]
): number {
  pseudocodeSteps.push(3); // Highlight "partition(arr, low, high)"
  let i = begin;
  let j = finish + 1;
  const pivot = array[begin];

  while (true) {
    pseudocodeSteps.push(4); // Highlight loop to find i
    while (array[++i] <= pivot) {
      if (i === finish) break;
      animations.push([[i], false]);
    }

    pseudocodeSteps.push(5); // Highlight loop to find j
    while (array[--j] >= pivot) {
      if (j === begin) break;
      animations.push([[j], false]);
    }

    if (j <= i) break;

    pseudocodeSteps.push(6); // Highlight swapping elements
    animations.push([[i, array[j]], true]);
    animations.push([[j, array[i]], true]);
    [array[i], array[j]] = [array[j], array[i]];
  }

  pseudocodeSteps.push(7); // Highlight swapping pivot with array[j]
  animations.push([[begin, array[j]], true]);
  animations.push([[j, array[begin]], true]);
  [array[begin], array[j]] = [array[j], array[begin]];
  return j;
}

function runQuickSort(
  array: number[],
  begin: number,
  finish: number,
  animations: AnimationArrayType,
  pseudocodeSteps: number[]
) {
  if (begin < finish) {
    pseudocodeSteps.push(0); // Highlight "if low < high"
    const part = partition(array, begin, finish, animations, pseudocodeSteps);

    pseudocodeSteps.push(1); // Highlight "quickSort(arr, low, pivot - 1)"
    runQuickSort(array, begin, part - 1, animations, pseudocodeSteps);

    pseudocodeSteps.push(2); // Highlight "quickSort(arr, pivot + 1, high)"
    runQuickSort(array, part + 1, finish, animations, pseudocodeSteps);
  }
}

export function generateQuickSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType, pseudocodeSteps: number[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return array;

  const animations: AnimationArrayType = [];
  const pseudocodeSteps: number[] = [];
  const auxiliaryArray = array.slice();

  runQuickSort(auxiliaryArray, 0, array.length - 1, animations, pseudocodeSteps);
  runAnimation(animations, pseudocodeSteps); // Pass animations and pseudocodeSteps
}
