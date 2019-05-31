Chapter 3: Function vs. Block Scope
===================================
---
## Scope From Functions

JavaScript has function-based scope. That is, each function you declare creates a bubble for itself.

Function scope encourages the idea that all variables belong to the function, and can be used and reused throughout the entirety of the function (and indeed, accessible even to nested scopes). This design approach can be quite useful, and certainly can make full use of the **dynamic** nature of JavaScript variables to take on values of different types as needed.


## Hiding In Plain Scope

The traditional way of thinking about functions is that you declare a function, and then add code inside it. But the inverse thinking is equally powerful and useful: take any arbitrary section of code you've written, and wrap a function declaration around it, which in effect **hides** the code.

The practical result is to create a scope bubble around the code in question, which means that any declarations (variable or function) in that code will now be tied to the scope of the new wrapping function, rather than the previously enclosing scope. In other words, you can **hide** variables and functions by enclosing them in the scope of a function.

There's a variety of reasons motivating this scope-based hiding. They tend to arise from the software design principle 

***Principle of Least Privilege*** [note-`leastprivilege`], also sometimes called **Least Authority** or **Least Exposure**. This principle states that in the design of software, such as the API for a module/object, you should expose only what is minimally necessary, and **hide** everything else.


## Collision Avoidance

Another benefit of **hiding** variables and functions inside a scope is to avoid unintended collision between two different identifiers with the same name but different intended usages. Collision results often in unexpected overwriting of values.


## Anonymous vs. Named

```javascript
setTimeout( function(){
    console.log("I waited 1 second!");
}, 1000 );
```

This is called an "anonymous function expression", because `function()...` has no name identifier on it. Function expressions can be anonymous, but function declarations cannot omit the name -- that would be illegal JS grammar.

Inline function expressions are powerful and useful -- the question of anonymous vs. named doesn't detract from that. Providing a name for your function expression quite effectively addresses all these draw-backs, but has no tangible downsides. The best practice is to always name your function expressions:

```javascript
setTimeout( function timeoutHandler(){ // <-- Look, I have a name!
    console.log( "I waited 1 second!" );
}, 1000 );
```

Invoking Function Expressions Immediately
=========================================

```javascript
var a = 2;

(function IIFE( global ){

    var a = 3;
    console.log( a ); // 3
    console.log( global.a ); // 2

})( window );

console.log( a ); // 2
```

We pass in the window object reference, but we name the parameter global, so that we have a clear stylistic delineation for global vs. non-global references. Of course, you can pass in anything from an enclosing scope you want, and you can name the parameter(s) anything that suits you. This is mostly just stylistic choice.



Still another variation of the IIFE inverts the order of things, where the function to execute is given second, after the invocation and parameters to pass to it. This pattern is used in the UMD (Universal Module Definition) project. Some people find it a little cleaner to understand, though it is slightly more verbose.

```javascript
var a = 2;

(function IIFE( def ){
    def( window );
})(function def( global ){

    var a = 3;
    console.log( a ); // 3
    console.log( global.a ); // 2

});
```

The `def` function expression is defined in the second-half of the snippet, and then passed as a parameter (also called def) to the IIFE function defined in the first half of the snippet. Finally, the parameter def (the function) is invoked, passing window in as the global parameter.

## Blocks As Scopes

The sad reality is that, on the surface, JavaScript has no facility for block scope.
That is, until you dig a little further.

## try/catch
 
JavaScript in ES3 specified the variable declaration in the catch clause of a try/catch to be block-scoped to the catch block.

```javascript
try {
    undefined(); // illegal operation to force an exception!
}
catch (err) {
    console.log( err ); // works!
}

console.log( err ); // ReferenceError: `err` not found
```

`err` exists only in the catch clause, and throws an error when you try to reference it elsewhere.
 
## let

ES6 introduces a new keyword let which sits alongside var as another way to declare variables. The `let` keyword attaches the variable declaration to the scope of whatever block (commonly a { .. } pair) it's contained in. In other words, `let` implicitly hijacks any block's scope for its variable declaration.

```javascript
var foo = true;

if (foo) {
    let bar = foo * 2;
    bar = something( bar );
    console.log( bar );
}
console.log( bar ); // ReferenceError 
```

Using let to attach a variable to an existing block is somewhat implicit. It can confuse if you're not paying close attention to which blocks have variables scoped to them, and are in the habit of moving blocks around, wrapping them in other blocks, etc., as you develop and evolve code.

Creating explicit blocks for block-scoping can address some of these concerns, making it more obvious where variables are attached and not. Usually, explicit code is preferable over implicit or subtle code. This explicit block-scoping style is easy to achieve, and fits more naturally with how block-scoping works in other languages:

```javascript
var foo = true;

if (foo) {
    { // <-- explicit block
        let bar = foo * 2;
        bar = something( bar );
        console.log( bar );
    }
	console.log( bar ); // ReferenceError
}
```

We can create an arbitrary block for `let` to bind to by simply including a `{ .. }` pair anywhere a statement is valid grammar. In this case, we've made an explicit block inside the if-statement, which may be easier as a whole block to move around later in refactoring, without affecting the position and semantics of the enclosing if-statement.

Hoisting, which talks about declarations being taken as existing for the entire scope in which they occur.

However, **declarations made with let will not hoist to the entire scope of the block they appear in**. Such declarations will not observably **exist** in the block until the declaration statement.

```javascript
{
   console.log( bar ); // ReferenceError!
   let bar = 2;
}
```

## Garbage Collection

Another reason block-scoping is useful relates to closures and garbage collection to reclaim memory. Declaring explicit blocks for variables to locally bind to is a powerful tool that you can add to your code toolbox.

## let Loops

A particular case where `let` shines is in the for-loop case as we discussed previously.

```javascript
for (let i=0; i<10; i++) {
    console.log( i );
}
console.log( i ); // ReferenceError
```

Not only does let in the for-loop header bind the i to the for-loop body, but in fact, it re-binds it to each iteration of the loop, making sure to re-assign it the value from the end of the previous loop iteration.

## const

In addition to let, ES6 introduces `const`, which also creates a block-scoped variable, but whose value is fixed (constant). Any attempt to change that value at a later time results in an error.

```javascript
var foo = true;

if (foo) {
    var a = 2;
    const b = 3; // block-scoped to the containing `if`

    a = 3; // just fine!
    b = 4; // error!
}

console.log( a ); // 3
console.log( b ); // ReferenceError!
```

## Review (TL;DR)

Functions are the most common unit of scope in JavaScript. Variables and functions that are declared inside another function are essentially **hidden** from any of the enclosing **scopes**, which is an intentional design principle of good software.

But functions are by no means the only unit of scope. Block-scope refers to the idea that variables and functions can belong to an arbitrary block (generally, any `{ .. }` pair) of code, rather than only to the enclosing function.

Starting with ES3, the ***try/catch*** structure has block-scope in the catch clause.

In ES6, the `let` keyword (a cousin to the **var** keyword) is introduced to allow declarations of variables in any arbitrary block of code. `if (..) { let a = 2; }` will declare a variable a that essentially hijacks the scope of the if's { .. } block and attaches itself there.

Though some seem to believe so, block scope should not be taken as an outright replacement of var function scope. Both functionalities co-exist, and developers can and should use both function-scope and block-scope techniques where respectively appropriate to produce better, more readable/maintainable code.

