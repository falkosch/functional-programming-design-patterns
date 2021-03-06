import { Demonstrator } from "../Demonstrator.meta-model";

// The OOP variant outlined

interface JoinAlgorithmOOP<T> {
  apply(elements: ReadonlyArray<T>, separator: string): string;
}

interface SearchAlgorithmOOP<T> {
  apply(elements: ReadonlyArray<T>, contains: T): number;
}

interface SortAlgorithmOOP<T> {
  apply(elements: ReadonlyArray<T>): T[];
}

interface AlgorithmFacadeOOP<T> {
  // Actual constructor parameter
  joinAlgorithm: JoinAlgorithmOOP<T>;
  searchAlgorithm: SearchAlgorithmOOP<T>;
  sortAlgorithm: SortAlgorithmOOP<T>;

  // Public API of the facade
  join(elements: ReadonlyArray<T>, separator: string): string;
  search(elements: ReadonlyArray<T>, contains: T): number;
  sort(elements: ReadonlyArray<T>): T[];
}

// The FP variant

interface JoinAlgorithm<T> {
  (elements: ReadonlyArray<T>, separator: string): string;
}

interface SearchAlgorithm<T> {
  (elements: ReadonlyArray<T>, contains: T): number;
}

interface SortComparer<T> {
  (a: Readonly<T>, b: Readonly<T>): number;
}

interface SortAlgorithm<T> {
  (elements: ReadonlyArray<T>, comparer: SortComparer<T>): T[];
}

// Represents the facade as a value representation
interface AlgorithmFacade<T> {
  join(elements: ReadonlyArray<T>, separator: string): string;
  search(elements: ReadonlyArray<T>, contains: T): number;
  sort(elements: ReadonlyArray<T>): T[];
}

interface AlgorithmFacadeCreator<T> {
  (
    join: JoinAlgorithm<T>,
    search: SearchAlgorithm<T>,
    sort: SortAlgorithm<T>
  ): Readonly<AlgorithmFacade<T>>;
  // The Readonly on the return type AlgorithmFacade<T> means it is immutable
}

// Concrete implementations for strings as an example

const joiner: JoinAlgorithm<string> = (elements, separator) =>
  elements.join(separator);

const searcher: SearchAlgorithm<string> = (elements, contains) =>
  elements.reduce((firstFoundIndex, element, index) => {
    if (firstFoundIndex < 0 && element.indexOf(contains) >= 0) {
      return index;
    }
    return firstFoundIndex;
  }, -1);

const sorter: SortAlgorithm<string> = (elements, comparer) =>
  [...elements].sort(comparer);

const comparer: SortComparer<string> = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

const algorithmFacadeCreator: AlgorithmFacadeCreator<string> = (
  joinAlgorithm,
  searchAlgorithm,
  sortAlgorithm
) =>
  // Object.freeze enforces immutability at runtime: Even removing the Readonly constraint on TS
  // level like "(x as any).sort = ..." will not have an effect anymore
  Object.freeze({
    join(elements, separator) {
      return joinAlgorithm(elements, separator);
    },
    search(elements, contains) {
      return searchAlgorithm(elements, contains);
    },
    sort(elements) {
      return sortAlgorithm(elements, (a, b) => comparer(a, b));
    }
  });

const facadeDemonstrator: Demonstrator = async () => {
  console.log("\n\t--- facade IVR example ---");

  const elements = ["c", "b", "a"];
  const facade = algorithmFacadeCreator(joiner, searcher, sorter);

  console.log(
    "join: ",
    joiner(elements, ","),
    "==",
    facade.join(elements, ",")
  );

  console.log(
    "search: ",
    searcher(elements, "b"),
    "==",
    facade.search(elements, "b")
  );

  console.log(
    "sort: ",
    sorter(elements, comparer),
    "==",
    facade.sort(elements)
  );
};

export default facadeDemonstrator;
