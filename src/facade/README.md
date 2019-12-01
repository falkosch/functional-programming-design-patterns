# Facade Pattern

In OOP, you can use a facade pattern to provide a unified interface for a set of interfaces [[1]](#1).

We can do something similar in FP too, with immutable value representations (IVR) as a container of functions calling other functions. To construct the immutable value representations, we can use a function.

This way we can parameterize the facade's IVR and hide construction details. Consider a facade for a backend API with multiple backend endpoints: For each request type of the API there would usually be one equivalent function taking the URL of the endpoint as a parameter. A facade could group the functions and hide the backend URL of the endpoint. It could also make it easier to pass the facade to other functions requiring to interact with any backend endpoint not needing to know its actual URL.

Now, the IVR protects from a modification of the facade and by that it protects from undefined behavior. However, what if it should be possible to modify the facade, e.g. to decorate it. In that case, functions that return functions are a possible alternative. You have a function that doesn't immediately return an IVR of the facade, but returns a parameterless function that does this last step, creating and returning a mutable value representation (MVR) of the facade.

In order to protect us from undefined behavior again, we pass the parameterless function to where the facade is needed. Every call to the parameterless function creates a new instance of a MVR of the facade. Each instance is an independent MVR. If one of them is modified, then all other will still be the same. This way we will be safe from undefined behavior at code which relied on using the parameterless function creating the MVR of the facade.

## References

[Gamma1994]: http://www.reddit.com

<a id="1">[1]</a> 
Gamma, et al. (1994). 
Design Patterns - Elements of Reusable Object-Oriented Software 
