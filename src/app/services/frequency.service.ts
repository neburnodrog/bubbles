import { NOTE_FREQUENCIES } from '../constants/notes';

export class FrequencyService {
  // static findClosestFrequency(arr: number[], target: number): number {
  //   console.log({ target });
  //   let n = arr.length;

  //   // Corner cases
  //   if (target <= arr[0]) return arr[0];
  //   if (target >= arr[n - 1]) return arr[n - 1];

  //   // Doing binary search
  //   let i = 0;
  //   let j = n;
  //   let mid = 0;

  //   console.log('####################################################');
  //   console.log('####################################################');

  //   while (i < j) {
  //     console.log('------------------');
  //     console.log({ i, j });
  //     // console.log(arr.slice(i, j)
  //     console.log(target);

  //     const midIdx = Math.floor((i + j) / 2);
  //     console.log({ midIdx });

  //     const midValue = arr[midIdx];
  //     console.log({ midValue });

  //     if (midValue == target) return midValue;

  //     if (target < arr[midIdx]) {
  //       // If target is greater than previous
  //       // to mid, return closest of two
  //       if (midIdx > 0 && target > arr[midIdx - 1])
  //         return this.getClosest(arr[midIdx - 1], arr[midIdx], target);

  //       // Repeat for left half
  //       j = midIdx;
  //     } else {
  //       // If target is greater than mid
  //       if (midIdx < n - 1 && target > arr[midIdx + 1])
  //         return this.getClosest(arr[midIdx], arr[midIdx + 1], target);
  //       i = midIdx + 1; // update i
  //     }
  //   }

  //   // Only single element left after search
  //   const closest = arr[mid];
  //   console.log(
  //     '🚀 ~ file: frequency.service.ts:50 ~ FrequencyService ~ findClosestFrequency ~ closest',
  //     closest
  //   );

  //   return closest;
  // }

  // static getClosest = (val1: number, val2: number, target: number) => {
  //   const closerToVal2 = target - val1 >= target - val2;
  //   return closerToVal2 ? val2 : val1;
  // };

  static findClosestFrequency(radius: number): number {
    const index = Math.floor(Math.random() * NOTE_FREQUENCIES.length);

    return NOTE_FREQUENCIES[index];
  }
}
