# Facade Pattern

In OOP, you can use a facade pattern to provide a unified interface for a set of interfaces [[1]](#1).

We can do something similar in FP too, with e.g. immutable value representations (IVR) as a container of functions. An IVR groups functions as a facade would do in OOP. Such an IVR does not need to reference the actual functions to be used, but can provide new functions with even simplified signature. The functions contained by the IVR hide which actual functions are used or decouple them from the rest of your system of functions.

If having a static or global IVR is not a good pattern in your perspective, then you can also use a function to construct the IVR - this function will be our facade's factory or creator. This way we can even parameterize the facade's IVR and hide construction details. Consider a facade e.g. for a backend API with multiple backend endpoints: Let's say for each request type of the backend API there would usually be one corresponding function that takes the URL of the endpoint of interest as a parameter, i.e. `querySomething(endpointURL)`. A facade factory function could group these functions by the URL of the backend endpoint and can so even drop the URL parameter from the function signatures.

The IVR protects from a modification of the facade and by that it protects from undefined behavior when the facade is passed to multiple other functions requiring the facade. However, what if it should be possible to modify the facade, e.g. to decorate it. In that case, functions that return functions are one alternative. You have a function as the facade's factory that doesn't immediately return an IVR of the facade, but returns a parameterless facade function that does this last step, creating the IVR of the facade.

The design of a facade factory function that returns a facade function that creates and returns the facade's IVR probably looks like over abstraction. However, it enables creating and decorating facades in a two-steps-way and thus allows you to decide when to do costly computations. The original facade factory function and possible decorators can e.g. postpone expensive computations required for creating the actual IVR until when the IVR is really needed. Or if required, the expensive computations could be done once very early so that creating and returning the IVR latter becomes almost costless.

## References

[Gamma1994]: http://www.reddit.com

<a id="1">[1]</a> 
Gamma, et al. (1994). 
Design Patterns - Elements of Reusable Object-Oriented Software 
