# Chapter 2: this All Makes Sense Now!

In Chapter 1, we discarded various misconceptions about **this** and learned instead that **this** is a binding made for each function invocation, based entirely on its **call-site** (how the function is called).

## Call-site

The call-site: the location in code where a function is called (not where it's declared). We must inspect the call-site to answer the question: **what's this **this** a reference to?**

Finding the call-site is generally: "go locate where a function is called from", but it's not always that easy, as certain coding patterns can obscure the true call-site.

What's important is to think about the call-stack (the stack of functions that have been called to get us to the current moment in execution). The call-site we care about is in the invocation before the currently executing function.

---

## Nothing But Rules
 
How the call-site determines where this will point during the execution of a function? Inspect the call-site and determine which of 4 rules applies, their order of precedence, if multiple rules could apply to the call-site.

**Default Binding**

The first rule we will examine comes from the most common case of function calls: **standalone function invocation**. Think of this **this** rule as the default catch-all rule when none of the other rules apply.
Consider this code:
```javascript
function foo() {
    console.log( this.a );
}

var a = 2;

foo(); // 2
```
The first thing to note, if you were not already aware, is that variables declared in the global scope, as `var a = 2` is, are synonymous with global-object properties of the same name. They're not copies of each other, they are each other. Think of it as two sides of the same coin.

Secondly, we see that when `foo()` is called, `this.a` resolves to our global variable `a`. Why? Because in this case, the default binding for **this** applies to the function call, and so points **this** at the global object.

How do we know that the default binding rule applies here? We examine the call-site to see how `foo()` is called. In our snippet, `foo()` is called with a plain, un-decorated function reference. None of the other rules we will demonstrate will apply here, so the default binding applies instead.

If strict mode is in effect, the global object is not eligible for the default binding, so the this is instead set to undefined.
```javascript
function foo() {
    "use strict";

    console.log( this.a );
}

var a = 2;

foo(); // TypeError: **this** is `undefined`
```
A subtle but important detail is: even though the overall this binding rules are entirely based on the call-site, the global object is only eligible for the default binding if the contents of `foo()` are not running in strict mode; the strict mode state of the call-site of foo() is irrelevant.

```javascript
function foo() {
    console.log( this.a );
}

var a = 2;

(function(){
    "use strict";
    foo(); // 2
 })();
```

---

**Implicit Binding** 

Another rule to consider is: does the call-site have a context object, also referred to as an owning or containing object, though these alternate terms could be slightly misleading.

Consider:

```javascript
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2
```

Firstly, notice the manner in which `foo()` is declared and then later added as a reference property onto `obj`. Regardless of whether `foo()` is initially declared on `obj`, or is added as a reference later (as this snippet shows), in neither case is the function really "owned" or "contained" by the `obj` object.

However, the call-site uses the `obj` context to reference the function, so you could say that the `obj` object "owns" or "contains" the function reference at the time the function is called.

Whatever you choose to call this pattern, at the point that `foo()` is called, it's preceded by an object reference to `obj`. When there is a context object for a function reference, the implicit binding rule says that it's that object which should be used for the function call's **this** binding.

Because `obj` is the **this** for the `foo()` call, `this.a` is synonymous with `obj.a`.

Only the top/last level of an object property reference chain matters to the call-site. For instance:
```javascript
function foo() {
    console.log( this.a );
}

var obj2 = {
    a: 42,
    foo: foo
};

var obj1 = {
    a: 2,
    obj2: obj2
};

obj1.obj2.foo(); // 42
```

---

**Implicitly Lost**

One of the most common frustrations that **this** binding creates is when an implicitly bound function loses that binding, which usually means it falls back to the default binding, of either the global object or undefined, depending on strict mode.

Consider:
```javascript
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // function reference/alias!
var a = "oops, global"; // `a` also property on global object
bar(); // "oops, global"
```

Even though `bar` appears to be a reference to `obj.foo`, in fact, it's really just another reference to `foo` itself. Moreover, the call-site is what matters, and the call-site is `bar()`, which is a plain, un-decorated call and thus the default binding applies.

The more subtle, more common, and more unexpected way **this** occurs is when we consider passing a callback function:

```javascript
function foo() {
    console.log( this.a );
}

function doFoo(fn) {
    // `fn` is just another reference to `foo`

    fn(); // <-- call-site!
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // `a` also property on global object

doFoo( obj.foo ); // "oops, global"
```

--- 
 
Parameter passing is just an implicit assignment, and since we're passing a function, it's an implicit reference assignment, so the end result is the same as the previous snippet.

What if the function you're passing your callback to is not your own, but built-in to the language? No difference, same outcome.
```javascript
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // `a` also property on global object

setTimeout( obj.foo, 100 ); // "oops, global"
```

It's quite common that our function callbacks lose their **this** binding, as we've just seen. But another way that **this** can surprise us is when the function we've passed our callback to intentionally changes the **this** for the call. Event handlers in popular JavaScript libraries are quite fond of forcing your callback to have a **this** which points to, for instance, the DOM element that triggered the event. 

---

**Explicit Binding**
 
What if you want to force a function call to use a particular object for the **this** binding, without putting a property function reference on the object?

"All" functions in the language have some utilities available to them (via their **[[Prototype]]**) which can be useful for this task. Specifically, functions have `call(..)` and `apply(..)` methods. Technically, JavaScript host environments sometimes provide functions which are special enough (a kind way of putting it!) that they do not have such functionality. But those are few. The vast majority of functions provided, and certainly all functions you will create, do have access to `call(..)` and `apply(..)`.

How do these utilities work? They both take, as their first parameter, an object to use for the **this**, and then invoke the function with that **this** specified. Since you are directly stating what you want the **this** to be, we call it explicit binding.

Consider:
```javascript
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};
foo.call( obj ); // 2
```
Invoking foo with explicit binding by `foo.call(..)` allows us to force its **this** to be `obj`.

If you pass a simple primitive value (of type **string**, **boolean**, or **number**) as the **this** binding, the primitive value is wrapped in its object-form (`new String(..)`, `new Boolean(..)`, or `new Number(..)`, respectively). This is often referred to as **boxing**.

**Note**: With respect to **this** binding, `call(..)` and `apply(..)` are identical. They do behave differently with their additional parameters, but that's not something we care about presently.

Unfortunately, explicit binding alone still doesn't offer any solution to the issue mentioned previously, of a function "losing" its intended **this** binding, or just having it paved over by a framework, etc.
 
--- 

**Hard Binding**

But a variation pattern around explicit binding actually does the trick. Consider:
```javascript
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

var bar = function() {
    foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// `bar` hard binds `foo`'s **this** to `obj`
// so that it cannot be overriden
bar.call( window ); // 2
```
Let's examine how this variation works. We create a function `bar()` which, internally, manually calls `foo.call(obj)`, thereby forcibly invoking `foo` with `obj` binding for **this**. No matter how you later invoke the function `bar`, it will always manually invoke `foo` with `obj`. This binding is both explicit and strong, so we call it hard binding.

---

The most typical way to wrap a function with a hard binding creates a pass-thru of any arguments passed and any return value received:
```javascript
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = function() {
    return foo.apply( obj, arguments );
};

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

Another way to express this pattern is to create a re-usable helper:
```javascript
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

// simple `bind` helper
function bind(fn, obj) {
    return function() {
        return fn.apply( obj, arguments );
    };
}

var obj = {
    a: 2
};

var bar = bind( foo, obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```
 
Since hard binding is such a common pattern, it's provided with a built-in utility as of ES5: Function.prototype.bind, and it's used like this:
```javascript
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

**bind(..) returns a new function that is hard-coded to call the original function with the this context set as you specified.**

**Note**: As of ES6, the hard-bound function produced by `bind(..)` has a `.name` property that derives from the original target function. For example: `bar = foo.bind(..)` should have a `bar.name` value of "bound foo", which is the function call name that should show up in a stack trace.
 
---

**new Binding**

JavaScript has a `new` operator, and the code pattern to use it looks basically identical to what we see in those class-oriented languages; most developers assume that JavaScript's mechanism is doing something similar. However, **there really is no connection to class-oriented functionality implied by "new" usage in JS**.

First, let's re-define what a **constructor** in JavaScript is. In JS, constructors are just functions that happen to be called with the `new` operator in front of them. They are not attached to classes, nor are they instantiating a class. They are not even special types of functions. They're just regular functions that are, in essence, hijacked by the use of **new** in their invocation.

For example, the `Number(..)` function acting as a constructor, quoting from the ES5.1 spec: 

**The Number Constructor**

**When Number is called as part of a new expression it is a constructor: it initialises the newly created object.**

So, pretty much any ol' function, including the built-in object functions like `Number(..)` can be called with `new` in front of it, and that makes that function call a constructor call. This is an important but subtle distinction: **there's really no such thing as "constructor functions", but rather construction calls of functions**.

When a function is invoked with new in front of it, otherwise known as a constructor call, the following things are done automatically:

- a brand new object is created (aka, constructed) out of thin air
- the newly constructed object is **[[Prototype]]**-linked
- the newly constructed object is set as the **this** binding for that function call
- unless the function returns its own alternate object, the new-invoked function call will automatically return the newly 		constructed object.

--- 

## Everything In Order

the default binding is the lowest priority rule of the 4.

explicit binding takes precedence over implicit binding.

new binding is more precedent than implicit binding.

hard binding (which is a form of explicit binding) is more precedent than new binding, and thus cannot be overridden with new.

---

## Determining this

the rules for determining this from a function call's call-site, in their order of precedence.

1. 	Is the function called with **new** (new binding)? If so, this is the newly constructed object.
	`var bar = new foo()`
	
2. 	Is the function called with **call** or **apply** (explicit binding), even hidden inside a bind hard binding? If so, this is the explicitly specified object.	
	`var bar = foo.call( obj2 )`
	
3. 	Is the function called with a context (implicit binding), otherwise known as an owning or containing object? If so, this is that context object.
	`var bar = obj1.foo()`
	
4.	Otherwise, default the `this` (default binding). If in strict mode, pick `undefined`, otherwise pick the global object.
	`var bar = foo()`	
	
---
	
## Binding Exceptions	

**Ignored this**

If you pass `null` or `undefined` as a this binding parameter to **call**, **apply**, or **bind**, those values are effectively ignored, and instead the default binding rule applies to the invocation.
```javascript	
	function foo() {
		console.log( this.a );
	}

	var a = 2;

	foo.call( null ); // 2
```


**Lexical this**

Arrow-functions are signified not by the `function` keyword, but by the `=>` so called **fat arrow** operator. Instead of using the four standard this rules, arrow-functions adopt the this binding from the enclosing (function or global) scope.

Let's illustrate arrow-function lexical scope:

```javascript	
function foo() {
    // return an arrow function
    return (a) => {
        // **this** here is lexically adopted from `foo()`
        console.log( this.a );
    };
}

var obj1 = {
    a: 2
};

var obj2 = {
    a: 3
};

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2, not 3!
```

The arrow-function created in `foo()` lexically captures whatever **foo()s** `this` is at its call-time. Since `foo()` was this-bound to `obj1`, `bar` (a reference to the returned arrow-function) will also be **this-bound** to `obj1`. The lexical binding of an arrow-function cannot be overridden (even with new!).