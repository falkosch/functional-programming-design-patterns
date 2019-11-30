import { Demonstrator } from "../Demonstrator.meta-model";

// The OOP variant (outlined, not implemented)
interface PivotSelectStrategyOOP {
  indexOfPivot(left: number, right: number): number;
}
interface SortAlgorithmOOP {
  sort(elements: ReadonlyArray<number>): number[];
}
interface QuickSortTakingPivotSelectStrategyOOP extends SortAlgorithmOOP {
  // actual constructor parameter
  pivotSelectStrategy: PivotSelectStrategyOOP;
}

// The FP variant
interface PivotSelector {
  (left: number, right: number): number;
}
interface QuickSortTakingPivotSelector {
  (elements: ReadonlyArray<number>, pivotSelector: PivotSelector): number[];
}

const quickSortTakingPivotSelector: QuickSortTakingPivotSelector = (
  elements,
  pivotSelector
) => {
  const elementsCopy = [...elements];

  // partition part of quick sort
  function partition(left: number, right: number) {
    const pivot = elementsCopy[pivotSelector(left, right)];
    let j = right;
    for (let i = left; i < j; ) {
      for (; elementsCopy[j] > pivot; j--) {}
      for (; elementsCopy[i] < pivot; i++) {}
      if (i < j) {
        const swap = elementsCopy[i];
        elementsCopy[i] = elementsCopy[j];
        elementsCopy[j] = swap;
      }
    }
    return j;
  }

  // recursive part of quick sort
  function actualQuickSort(left: number, right: number) {
    if (left < right) {
      const p = partition(left, right);
      actualQuickSort(left, p - 1);
      actualQuickSort(p + 1, right);
    }
  }

  actualQuickSort(0, elementsCopy.length - 1);
  return elementsCopy;
};

const demonstrator: Demonstrator = async () => {
  console.log("\n\t--- functions taking functions example ---");

  Object.entries({
    left: (left: number, __right: number) => left,
    "(left+right)/2": (left: number, right: number) =>
      Math.floor((left + right) / 2),
    right: (__left: number, right: number) => right
  }).forEach(([pivotSelectorName, pivotSelector]) =>
    [
      [0, 1, 2, 3, 4],
      [1, 0],
      [4, 1, 0, 11, -1, 3]
    ].forEach(elements =>
      console.log(
        elements,
        ' and pivot selector "',
        pivotSelectorName,
        '" -> ',
        quickSortTakingPivotSelector(elements, pivotSelector)
      )
    )
  );
};

export default demonstrator;
