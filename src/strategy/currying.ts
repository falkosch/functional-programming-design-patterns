import { Demonstrator } from "../Demonstrator.meta-model";

// The OOP variant outlined

interface SortAlgorithmOOP {
  sort(elements: ReadonlyArray<number>): number[];
}

interface PivotSelectStrategyOOP {
  indexOfPivot(left: number, right: number): number;
}

interface QuickSortTakingPivotSelectStrategyOOP {
  // Wraps the call to this.sort(...) as a new instance of SortAlgorithmOOP
  wrapSort(pivotSelectStrategy: PivotSelectStrategyOOP): SortAlgorithmOOP;

  // Actual sort
  sort(
    elements: ReadonlyArray<number>,
    pivotSelectStrategy: PivotSelectStrategyOOP
  ): number[];
}

// The FP variant

interface SortAlgorithm {
  (elements: ReadonlyArray<number>): number[];
}

interface PivotSelector {
  (left: number, right: number): number;
}

interface QuickSortTakingPivotSelector {
  (elements: ReadonlyArray<number>, pivotSelector: PivotSelector): number[];
}

// Concrete implementation

const quickSortTakingPivotSelector: QuickSortTakingPivotSelector = (
  elements,
  pivotSelector
) => {
  const elementsCopy = [...elements];

  // Partition part of quick sort
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

  // Recursive part of quick sort
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
  console.log("\n\t--- currying example ---");

  Object.entries({
    left: (left: number, __right: number) => left,
    "(left+right)/2": (left: number, right: number) =>
      Math.floor((left + right) / 2),
    right: (__left: number, right: number) => right
  }).forEach(([pivotSelectorName, pivotSelector]) => {
    // Here the pivot selector is curried
    const wrappingSorter: SortAlgorithm = elements =>
      quickSortTakingPivotSelector(elements, pivotSelector);

    const unsorted = [4, 1, 0, 11, -1, 3];

    // Although we change the behavior of quick sort, it should still return a sorted array
    console.log(
      unsorted,
      ' and pivot selector "',
      pivotSelectorName,
      '" -> ',
      wrappingSorter(unsorted)
    );
  });
};

export default demonstrator;
