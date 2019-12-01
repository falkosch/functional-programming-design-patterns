import { Demonstrator } from "../Demonstrator.meta-model";

enum PivotSelectBehavior {
  Left,
  Middle,
  Right
}

// The OOP variant outlined

interface SortAlgorithmOOP {
  sort(elements: ReadonlyArray<number>): number[];
}

interface QuickSortProvidingPivotSelectStrategyOOP extends SortAlgorithmOOP {
  // Actual constructor parameter
  pivotSelectBehavior: PivotSelectBehavior;
}

// The FP variant

interface SortAlgorithm {
  (elements: ReadonlyArray<number>): number[];
}

interface QuickSortProvidingPivotSelector {
  (pivotSelectBehavior: PivotSelectBehavior): SortAlgorithm;
}

// Concrete implementation

const quickSortProvidingPivotSelector: QuickSortProvidingPivotSelector = pivotSelectBehavior => {
  interface PivotSelector {
    (left: number, right: number): number;
  }

  const availablePivotSelector: Record<PivotSelectBehavior, PivotSelector> = {
    [PivotSelectBehavior.Left]: (left, __right) => left,
    [PivotSelectBehavior.Middle]: (left, right) =>
      Math.floor((left + right) / 2),
    [PivotSelectBehavior.Right]: (__left, right) => right
  };

  const pivotSelector = availablePivotSelector[pivotSelectBehavior];

  return elements => {
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
};

const demonstrator: Demonstrator = async () => {
  console.log("\n\t--- functions returning functions example ---");

  [
    PivotSelectBehavior.Left,
    PivotSelectBehavior.Middle,
    PivotSelectBehavior.Right
  ].forEach(pivotSelectBehavior => {
    // giving a pivot select behavior returns us a concrete sort function with the wanted behavior
    const sorter = quickSortProvidingPivotSelector(pivotSelectBehavior);

    [
      [0, 1, 2, 3, 4],
      [1, 0],
      [4, 1, 0, 11, -1, 3]
    ].forEach(elements =>
      console.log(
        elements,
        ' and behavior "',
        PivotSelectBehavior[pivotSelectBehavior],
        '" -> ',
        sorter(elements)
      )
    );
  });
};

export default demonstrator;
