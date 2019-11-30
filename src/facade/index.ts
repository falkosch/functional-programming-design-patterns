import { Demonstrator } from "../Demonstrator.meta-model";

// The OOP variant (outlined, not implemented)
interface SortAlgorithmOOP {
  apply(elements: ReadonlyArray<string>): string[];
}
interface SearchAlgorithmOOP {
  apply(elements: ReadonlyArray<string>, contains: string): number;
}
interface JoinAlgorithmOOP {
  apply(elements: ReadonlyArray<string>, separator: string): string;
}
interface AlgorithmFacadeOOP {
  // actual privates
  sortAlgorithm: SortAlgorithmOOP;
  searchAlgorithm: SearchAlgorithmOOP;
  joinAlgorithm: JoinAlgorithmOOP;
  // public API of the facade
  sort(elements: ReadonlyArray<string>): string[];
  search(elements: ReadonlyArray<string>, contains: string): number;
  join(elements: ReadonlyArray<string>, separator: string): string;
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

// a facade as an immutable value representation
interface AlgorithmFacade<T> {
  join(elements: ReadonlyArray<T>, separator: string): string;
  search(elements: ReadonlyArray<T>, contains: T): number;
  sort(elements: ReadonlyArray<T>): T[];
}

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

const algorithmFacade = (
  joinAlgorithm: JoinAlgorithm<string>,
  searchAlgorithm: SearchAlgorithm<string>,
  sortAlgorithm: SortAlgorithm<string>
): AlgorithmFacade<string> => ({
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
  console.log("\n\t--- facade example ---");

  const elements = ["c", "b", "a"];
  const facade = algorithmFacade(joiner, searcher, sorter);

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
