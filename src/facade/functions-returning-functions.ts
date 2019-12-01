import { Demonstrator } from "../Demonstrator.meta-model";

// The OOP variant outlined

interface JoinAlgorithmOOP<T> {
  apply(elements: ReadonlyArray<T>, separator: string): string;
}

interface SearchAlgorithmOOP<T> {
  apply(elements: ReadonlyArray<T>, contains: T): number;
}

interface SortComparerOOP<T> {
  compare(a: Readonly<T>, b: Readonly<T>): number;
}

interface SortAlgorithmOOP<T> {
  apply(elements: ReadonlyArray<T>, comparer: SortComparerOOP<T>): T[];
}

interface AlgorithmFacadeOOP<T> {
  join(elements: ReadonlyArray<T>, separator: string): string;
  search(elements: ReadonlyArray<T>, contains: T): number;
  sort(elements: ReadonlyArray<T>): T[];
}

interface AlgorithmFacadeFactoryOOP<T> {
  // Actual constructor parameter
  joinAlgorithm: JoinAlgorithmOOP<T>;
  searchAlgorithm: SearchAlgorithmOOP<T>;
  sortAlgorithm: SortAlgorithmOOP<T>;

  // Public API
  createFacade(): AlgorithmFacadeOOP<T>;
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

// Represents the facade as an immutable value representation
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
  ): () => AlgorithmFacade<T>;
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
  (elements as any).sort(comparer);

const comparer: SortComparer<string> = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

const algorithmFacadeCreator: AlgorithmFacadeCreator<string> = (
  joinAlgorithm,
  searchAlgorithm,
  sortAlgorithm
) => () => {
  console.debug("creating new IVR for facade");
  return {
    join(elements, separator) {
      return joinAlgorithm(elements, separator);
    },
    search(elements, contains) {
      return searchAlgorithm(elements, contains);
    },
    sort(elements) {
      return sortAlgorithm(elements, (a, b) => comparer(a, b));
    }
  };
};

const facadeDemonstrator: Demonstrator = async () => {
  console.log("\n\t--- facade example ---");

  const elements = ["c", "b", "a"];
  const facade = algorithmFacadeCreator(joiner, searcher, sorter);

  console.log(
    "join: ",
    joiner(elements, ","),
    "==",
    facade().join(elements, ",")
  );

  console.log(
    "search: ",
    searcher(elements, "b"),
    "==",
    facade().search(elements, "b")
  );

  // Let's try to manipulate the facade's value representation and see what is
  // happening with any future use of "facade()"
  const facadeVR = {
    ...facade(),
    sort(elements: ReadonlyArray<string>) {
      // just do not sort as an example
      return [...elements];
    }
  };

  console.log(
    "sort with facade manipulation: ",
    sorter(elements, comparer),
    "==",
    facadeVR.sort(elements)
  );

  console.log(
    "sort without facade manipulation: ",
    sorter(elements, comparer),
    "==",
    facade().sort(elements)
  );
};

export default facadeDemonstrator;
