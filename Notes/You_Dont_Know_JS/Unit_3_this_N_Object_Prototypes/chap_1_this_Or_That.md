# Chapter 1: this Or That?

the `this` mechanism provides a more elegant way of implicitly **passing along** an object reference, leading to cleaner API design and easier re-use.

You can define a function with no parameters but while calling the function with an arguement you can access that arguement value inside function by using `this`.

## Confusions
Some misconceptions about how `this` doesn't actually work: 
The name `this` creates confusion when developers try to think about it too literally. There are two meanings often assumed, but both are incorrect.

**Itself**

The first common temptation is to assume this refers to the function itself. **NO, IT DOESN'T**.

**Its Scope**

The next most common misconception about the meaning of `this` is that it somehow refers to the function's scope. It's a tricky question, because in one sense there is some truth, but in the other sense, it's quite misguided.

To be clear, `this` does not, in any way, refer to a function's lexical scope. It is true that internally, **scope is kind of like an object with properties for each of the available identifiers. But the scope "object" is not accessible to JavaScript code. It's an inner part of the Engine's implementation.**

## What's this?
`this` is not an author-time binding but a runtime binding. It is contextual based on the conditions of the function's invocation. `this` binding has nothing to do with where a function is declared, but has instead everything to do with the manner in which the function is called.

When a function is invoked, an activation record, otherwise known as an execution context, is created. This record contains information about where the function was called from (the **call-stack**), how the function was invoked, what parameters were passed, etc. One of the properties of this record is the `this` reference which will be used for the duration of that function's execution.


## Review (TL;DR)
`this` is neither a reference to the function itself, nor is it a reference to the function's lexical scope. `this` is actually a binding that is made when a function is invoked, and what it references is determined entirely by the call-site where the function is called.

