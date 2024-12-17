import { AnimationArrayType } from "@/app/lib/types";

function countingSort(
  array: number[],
  n: number,
  exp: number,
  animations: AnimationArrayType,
  pseudocodeSteps: number[]
) {
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  pseudocodeSteps.push(1); // Highlight "counting occurrences"
  for (let i = 0; i < n; i++) {
    count[Math.floor(array[i] / exp) % 10]++;
  }

  pseudocodeSteps.push(2); // Highlight "accumulating counts"
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  pseudocodeSteps.push(3); // Highlight "building output array"
  for (let i = n - 1; i >= 0; i--) {
    const index = Math.floor(array[i] / exp) % 10;
    output[count[index] - 1] = array[i];
    count[index]--;
  }

  pseudocodeSteps.push(4); // Highlight "copy back to array"
  for (let i = 0; i < n; i++) {
    animations.push([[i, output[i]], true]);
    array[i] = output[i];
  }
}

export function generateRadixSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType, pseudocodeSteps: number[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationArrayType = [];
  const pseudocodeSteps: number[] = [];
  const maxElement = Math.max(...array);

  pseudocodeSteps.push(0); // Highlight "for exp = 1 to maxDigit"
  for (let exp = 1; Math.floor(maxElement / exp) > 0; exp *= 10) {
    countingSort(array, array.length, exp, animations, pseudocodeSteps);
  }

  runAnimation(animations, pseudocodeSteps);
}
