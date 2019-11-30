# Facade Pattern

In OOP, you can use a facade pattern to provide a unified interface for a set of interfaces [[1]](#1).

We can do something similar in FP too, with immutable value representations as a container of functions calling other functions. To construct the immutable value representations, we can use a factory function.

This way we can even parameterize the facade's immutable value representation and hide construction details. Consider a facade for a backend API with multiple backend endpoints: For each request type of the API there would usually be one equivalent function taking the URL of the endpoint as a parameter. A facade could group the functions and hide the backend URL of the endpoint. It could also make it easier to pass the facade to other functions requiring to interact with any backend endpoint not needing to know its actual URL.

## References

[Gamma1994]: http://www.reddit.com

<a id="1">[1]</a> 
Gamma, et al. (1994). 
Design Patterns - Elements of Reusable Object-Oriented Software 
