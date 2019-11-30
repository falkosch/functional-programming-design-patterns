# Strategy Pattern

The probably most useful pattern in OOP is the strategy pattern (IMHO). In OOP, you can use the strategy pattern to define families of algorithms [[1]](#1). Consider the quick sort algorithm as an example. There are many different variants, which deal with selecting an appropriate pivot element in each recursive step of quick sort. Selecting a pivot element could be abstracted as a strategy as sub-algorithm in quick sort.

In FP, we can do that too. Here it is realized with different variants:
* `functions-taking-functions`
* `functions-returning-functions`
* `currying` of function parameters

Regarding the quick sort example, we could provide a pivot selecting function as a required parameter of the common algorithm part of quick sort. In that way, we have a common algorithm part that is extensible by specializations of sub-algorithm parts to adapt the algorithm's behavior without re-implementing the whole algorithm by itself.

We could also implement a function that takes a configuration-like parameter that is not a function, but e.g. a primitive value with a semantic meaning. This determines, which pivot function of a set of provided functions should be used, and composes the actual quick sort algorithm by returning a new function. In that way, we fix an algorithm to have only the provided number of different behaviors.

Last but not least, currying is a specialized form of `functions-returning-functions`. It allows us to preset function parameters without executing the actual algorithm encapsulated by a function. When the actual algorithm shall be executed, curried parameters do not need to provided anymore by the caller as they were preset in before and will be transparently provided to the algorithm. The algorithm function itself may support currying. Alternatively, a wrapping function can do that in a more general way for any function (see [Lodash's `_.curry` function](https://lodash.com/docs/4.17.15#curry) as an example).

## References

[Gamma1994]: http://www.reddit.com

<a id="1">[1]</a> 
Gamma, et al. (1994). 
Design Patterns - Elements of Reusable Object-Oriented Software 
