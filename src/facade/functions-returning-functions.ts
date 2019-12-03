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

interface AlgorithmFacadeDecoratorOOP<T> extends AlgorithmFacadeOOP<T> {
  // Actual constructor parameter
  facadeToDecorate: AlgorithmFacadeOOP<T>;
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
interface AlgorithmFacadeValue<T> {
  join(elements: ReadonlyArray<T>, separator: string): string;
  search(elements: ReadonlyArray<T>, contains: T): number;
  sort(elements: ReadonlyArray<T>): T[];
}

interface AlgorithmFacade<T> {
  (): AlgorithmFacadeValue<T>;
}

interface AlgorithmFacadeCreator<T> {
  (
    join: JoinAlgorithm<T>,
    search: SearchAlgorithm<T>,
    sort: SortAlgorithm<T>
  ): AlgorithmFacade<T>;
}

interface AlgorithmFacadeDecorator<T> {
  (facadeToDecorate: AlgorithmFacade<T>): AlgorithmFacade<T>;
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
) => () => {
  console.debug("creating facade's value representation");
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

const algorithmFacadeDecorator: AlgorithmFacadeDecorator<string> = (
  facadeToDecorate: AlgorithmFacade<string>
) => () => {
  const originalFacadeValue = facadeToDecorate();
  console.debug("creating decorated facade's value representation");
  return {
    ...originalFacadeValue,
    sort(elements) {
      return [...elements];
    }
  };
};

const facadeDemonstrator: Demonstrator = async () => {
  console.log("\n\t--- facade FrF example ---");

  const elements = ["c", "b", "a"];
  const facade = algorithmFacadeCreator(joiner, searcher, sorter);
  const decoratedFacade = algorithmFacadeDecorator(facade);

  console.log("\n--- join:");
  console.log("by function", joiner(elements, ","));
  console.log("by facade", facade().join(elements, ","));
  console.log("by decorated facade", decoratedFacade().join(elements, ","));

  console.log("\n--- search:");
  console.log("by function", searcher(elements, "b"));
  console.log("by facade", facade().search(elements, "b"));
  console.log("by decorated facade", decoratedFacade().search(elements, "b"));

  console.log("\n--- sort:");
  console.log("by function", sorter(elements, comparer));
  console.log("by facade", facade().sort(elements));
  console.log("by decorated facade", decoratedFacade().sort(elements));
};

export default facadeDemonstrator;
