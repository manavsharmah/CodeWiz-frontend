import { AnimationArrayType } from "@/app/lib/types";

function heapify(
  array: number[],
  n: number,
  i: number,
  animations: AnimationArrayType,
  pseudocodeSteps: number[]
): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  pseudocodeSteps.push(4); // Highlight comparison in heapify
  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  pseudocodeSteps.push(5); // Highlight comparison in heapify
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== i) {
    pseudocodeSteps.push(6); // Highlight swapping in heapify
    animations.push([[i, largest], false]);
    animations.push([[i, array[largest]], true]);
    animations.push([[largest, array[i]], true]);
    [array[i], array[largest]] = [array[largest], array[i]];

    heapify(array, n, largest, animations, pseudocodeSteps);
  }
}

function buildMaxHeap(
  array: number[],
  animations: AnimationArrayType,
  pseudocodeSteps: number[]
): void {
  pseudocodeSteps.push(1); // Highlight building the heap
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, animations, pseudocodeSteps);
  }
}

export function generateHeapSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType, pseudocodeSteps: number[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationArrayType = [];
  const pseudocodeSteps: number[] = [];
  const auxiliaryArray = array.slice();

  buildMaxHeap(auxiliaryArray, animations, pseudocodeSteps);

  pseudocodeSteps.push(2); // Highlight sorting loop
  for (let i = auxiliaryArray.length - 1; i > 0; i--) {
    pseudocodeSteps.push(3); // Highlight swapping root with end
    animations.push([[0, i], false]);
    animations.push([[0, auxiliaryArray[i]], true]);
    animations.push([[i, auxiliaryArray[0]], true]);
    [auxiliaryArray[0], auxiliaryArray[i]] = [auxiliaryArray[i], auxiliaryArray[0]];

    heapify(auxiliaryArray, i, 0, animations, pseudocodeSteps);
  }

  runAnimation(animations, pseudocodeSteps);
}
