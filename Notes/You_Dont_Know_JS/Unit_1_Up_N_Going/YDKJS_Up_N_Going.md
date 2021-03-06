# Unit 1: Up & Going

## Chapter 2: Into JavaScript

Values & Types
---------------

JavaScript has typed values, not typed variables. The following built-in types are available:

*string*

*number*

*boolean*

*null* and *undefined*

*object*

*symbol* (new to ES6)


JavaScript provides a **typeof** operator that can examine a value and tell you what type it is:
```javaScript
var a;
typeof a;       
```

Objects
--------

The object type refers to a compound value where you can set properties (named locations) that each hold their own values of any type.

Properties can either be accessed with dot notation (i.e., `obj.a`) or bracket notation (i.e., `obj["a"]`). Dot notation is shorter and generally easier to read, and is thus preferred when possible.

bracket notation is also useful if you want to access a property/key but the name is stored in another variable, such as:

```javaScript
var obj = {
    a: "hello world",
    b: 42
};

var b = "a";

obj[b];         // "hello world"
obj["b"];       // 42
```

Arrays
-------

difference between object and array declaration:

Object:	`var obj = {};`

Array:	`var arr = [];`

**typeof** operation will return object for both Object and Array.

Because arrays are special objects (as typeof implies), they can also have properties, including the automatically updated length property.

You theoretically could use an array as a normal object with your own named properties, or you could use an object but only give it numeric properties (0, 1, etc.) similar to an array. However, this would generally be considered improper usage of the respective types.

The best and most natural approach is to use arrays for numerically positioned values and use objects for named properties.


Functions
----------
```javaScript
function foo() {
    return 42;
}

foo.bar = "hello world";

typeof foo;         // "function"
typeof foo();       // "number"
typeof foo.bar;     // "string"
```
Functions are a subtype of objects -- **typeof** returns "function", which implies that a function is a main type -- and can thus have properties, but you typically will only use function object properties (like foo.bar) in limited cases.


Built-In Type Methods
---------------------
```javaScript
var a = "hello world";
var b = 3.14159;

a.length;               // 11
a.toUpperCase();        // "HELLO WORLD"
b.toFixed(4);           // "3.1416"
```
The "how" behind being able to call a.toUpperCase() is more complicated than just that method existing on the value.

Briefly, there is a **String** (capital S) object wrapper form, typically called a "native," that pairs with the primitive string type; it's this object wrapper that defines the `toUpperCase()` method on its prototype.

When you use a primitive value like "hello world" as an object by referencing a property or method (e.g., a.toUpperCase() in the previous snippet), JS automatically "boxes" the value to its object wrapper counterpart (hidden under the covers).

A string value can be wrapped by a String object, a number can be wrapped by a Number object, and a boolean can be wrapped by a Boolean object. For the most part, you don't need to worry about or directly use these object wrapper forms of the values -- prefer the primitive value forms in practically all cases and JavaScript will take care of the rest for you.


Truthy & Falsy
------------------

The **truthy** and **falsy** nature of values: when a non-boolean value is coerced to a boolean, does it become true or false, respectively?

The specific list of **falsy** values in JavaScript is as follows:
```
	"" (empty string)
	0, -0, NaN (invalid number)
	null, undefined
	false
```
Any value that's not on this **falsy** list is **truthy**. Here are some examples of those:

	"hello"
	42
	true
	[ ], [ 1, "2", 3 ] (arrays)
	{ }, { a: 42 } (objects)
	function foo() { .. } (functions)

It's important to remember that a non-boolean value only follows this **truthy**/**falsy** coercion if it's actually coerced to a boolean. It's not all that difficult to confuse yourself with a situation that seems like it's coercing a value to a boolean when it's not.


Equality
----------
There are four equality operators: `==`, `===`, `!=`, and `!==`.

**The difference between == and === is usually characterized that == checks for value equality and === checks for both value and type equality. However, this is inaccurate. The proper way to characterize them is that == checks for value equality with coercion allowed, and === checks for value equality without allowing coercion; === is often called "strict equality" for this reason.**

```javaScript
var a = "42";
var b = 42;

a == b;   // true
a === b;  // false
```

You should take special note of the == and === comparison rules if you're comparing two non-primitive values, like objects (including function and array). Because those values are actually held by reference, both == and === comparisons will simply check whether the references match, not anything about the underlying values.

For example, arrays are by default coerced to strings by simply joining all the values with commas (,) in between. You might think that two arrays with the same contents would be == equal, but they're not:

```javaScript
var a = [1,2,3];
var b = [1,2,3];
var c = "1,2,3";

a == c;     // true
b == c;     // true
a == b;     // false
 ```
 
Hoisting
--------

Wherever a var appears inside a scope, that declaration is taken to belong to the entire scope and accessible everywhere throughout.
Metaphorically, this behavior is called hoisting, when a var declaration is conceptually "moved" to the top of its enclosing scope.
Hoisting: call appearing before its formal declaration.


Block-level variable Declaration
---------------------------------

In addition to creating declarations for variables at the function level, ES6 lets you declare variables to belong to individual blocks (pairs of { .. }), using the let keyword.

```javaScript
function foo() {
    var a = 1;

    if (a >= 1) {
        let b = 2;

        while (b < 5) {
            let c = b * 2;
            b++;

            console.log( a + c );
        }
    }
}

foo(); // 5 7 9
```

Because of using let instead of var, b will belong only to the if statement and thus not to the whole foo() function's scope. Similarly, c belongs only to the while loop. Block scoping is very useful for managing your variable scopes in a more fine-grained fashion, which can make your code much easier to maintain over time.


Strict Mode
-----------
ES5 added a "strict mode" to the language, which tightens the rules for certain behaviors.
You can opt in to strict mode for an individual function, or an entire file, depending on where you put the strict mode pragma.

One key difference (improvement!) with strict mode is disallowing the implicit auto-global variable declaration from omitting the var:

```javaScript
function foo() {
    "use strict";   // turn on strict mode
    a = 1;          // `var` missing, ReferenceError
}

foo();
```
 
Functions As Values
--------------------

Not only can you pass a value (argument) to a function, but a function itself can be a value that's assigned to variables, or passed to or returned from other functions.

As such, a function value should be thought of as an expression, much like any other value or expression.

Consider:

```javaScript
var foo = function() {
    // ..
};

var x = function bar(){
    // ..
};
```

The first function expression assigned to the foo variable is called anonymous because it has no name.

The second function expression is named (bar), even as a reference to it is also assigned to the x variable. Named function expressions are generally more preferable, though anonymous function expressions are still extremely common.


Immediately Invoked Function Expressions (IIFEs)
-------------------------------------------------

```javaScript
(function IIFE(){
    console.log( "Hello!" );
})();
// "Hello!"
```

The outer `( .. )` that surrounds the `(function IIFE(){ .. })` function expression is just a nuance of JS grammar needed to prevent it from being treated as a normal function declaration.

The final `()` on the end of the expression -- the `})();` line -- is what actually executes the function expression referenced immediately before it.


this Identifier
---------------

While it may often seem that `this` is related to "object-oriented patterns," in JS `this` is a different mechanism.

If a function has a `this` reference inside it, that `this` reference usually points to an object. But which object it points to depends on how the function was called.

It's important to realize that **`this` does not refer to the function itself**, as is the most common misconception.

Here's a quick illustration:

```javaScript
function foo() {
    console.log( this.bar );
}

var bar = "global";

var obj1 = {
    bar: "obj1",
    foo: foo
};

var obj2 = {
    bar: "obj2"
};

// --------

foo();              // "global"
obj1.foo();         // "obj1"
foo.call( obj2 );   // "obj2"
new foo();          // undefined
```

There are four rules for how `this` gets set, and they're shown in those last four lines of that snippet.

1.	`foo()` ends up setting `this` to the global object in non-strict mode -- in strict mode, this would be **undefined** and you'd get an error in accessing the bar property -- so "global" is the value found for this.bar.

2.	`obj1.foo()` sets this to the **obj1** object.

3.	`foo.call(obj2)` sets this to the **obj2** object.

4.	`new foo()` sets this to a brand new empty object.















