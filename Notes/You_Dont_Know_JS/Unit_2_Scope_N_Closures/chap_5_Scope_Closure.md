# Chapter 5: Scope Closure


Closures happen as a result of writing code that relies on lexical scope.
 
**Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.**

Consider code which brings closure into full light:

```javascript
function foo() {
    var a = 2;
    function bar() {
        console.log( a );
    }
    return bar;
}

var baz = foo();

baz(); // 2 -- Whoa, closure was just observed, man.
```

The function **bar()** has lexical scope access to the inner scope of **foo()**. But then, we take **bar()**, the function itself, and pass it as a value. In this case, we return the function object itself that bar references.

After we execute **foo()**, we assign the value it returned (our inner **bar()** function) to a variable called baz, and then we actually invoke **baz()**, which of course is invoking our inner function **bar()**, just by a different identifier reference.

**bar()** is executed, for sure. But in this case, it's executed outside of its declared lexical scope.

After **foo()** executed, normally we would expect that the entirety of the inner scope of **foo()** would go away, because we know that the Engine employs a Garbage Collector that comes along and frees up memory once it's no longer in use. Since it would appear that the contents of **foo()** are no longer in use, it would seem natural that they should be considered gone.

But the ***magic*** of closures does not let this happen. That inner scope is in fact still **in use**, and thus does not go away. Who's using it? The function **bar()** itself.

By virtue of where it was declared, **bar()** has a lexical scope closure over that inner scope of **foo()**, which keeps that scope alive for **bar()** to reference at any later time.

**bar()** still has a reference to that scope, and that reference is called ***closure***.

The function is being invoked well outside of its author-time lexical scope. **Closure lets the function continue to access the lexical scope it was defined in at author-time.**

```javascript
function foo() {
    var a = 2;

    function baz() {
        console.log( a ); // 2
    }

    bar( baz );
}

function bar(fn) {
    fn(); // look ma, I saw closure!
}
```

We pass the inner function **baz** over to **bar**, and call that inner function (labeled **fn** now), and when we do, its closure over the inner scope of **foo()** is observed, by accessing **a**.

---


## Indirect passings-around of functions 

```javascript
var fn;

function foo() {
    var a = 2;

    function baz() {
        console.log( a );
    }

    fn = baz; // assign `baz` to global variable
}

function bar() {
    fn(); // look ma, I saw closure!
}

foo();

bar(); // 2
``` 

## Now I Can See

Closure is something all around you in your existing code. Let us now see that truth.

```javascript
function wait(message) {

    setTimeout( function timer(){
        console.log( message );
    }, 1000 );

}

wait( "Hello, closure!" );
```

We take an inner function (named **timer**) and pass it to `setTimeout(..)`. But timer has a scope closure over the scope of `wait(..)`, indeed keeping and using a reference to the variable message.

A thousand milliseconds after we have executed `wait(..)`, and its inner scope should otherwise be long gone, that inner function timer still has closure over that scope.

Deep down in the guts of the Engine, the built-in utility `setTimeout(..)` has reference to some parameter, probably called fn or func or something like that. Engine goes to invoke that function, which is invoking our inner timer function, and the lexical scope reference is still intact.
 
Essentially whenever and wherever you treat functions (which access their own respective lexical scopes) as first-class values and pass them around, you are likely to see those functions exercising closure. Be that timers, event handlers, Ajax requests, cross-window messaging, web workers, or any of the other asynchronous (or synchronous!) tasks, when you pass in a callback function, get ready to sling some closure around!
 
---

## Loops + Closure

The most common canonical example used to illustrate closure involves the humble for-loop.

```javascript
for (var i=1; i<=5; i++) {
    setTimeout( function timer(){
        console.log( i );
    }, i*1000 );
}
```

The spirit of this code snippet is that we would normally expect for the behavior to be that the numbers **1**, **2**, **.. 5** would be printed out, one at a time, one per second, respectively.

In fact, if you run this code, you get **6** printed out 5 times, at the one-second intervals.
The terminating condition of the loop is when i is not <=5. The first time that's the case is when i is 6. So, the output is reflecting the final value of the i after the loop terminates.

This actually seems obvious on second glance. The timeout function callbacks are all running well after the completion of the loop. In fact, as timers go, even if it was `setTimeout(.., 0)` on each iteration, all those function callbacks would still run strictly after the completion of the loop, and thus print 6 each time.

we are trying to imply that each iteration of the loop "captures" its own copy of i, at the time of the iteration. But, the way scope works, all 5 of those functions, though they are defined separately in each loop iteration, all are closed over the same shared global scope, which has, in fact, only one i in it.

Put that way, of course all functions share a reference to the same i. Something about the loop structure tends to confuse us into thinking there's something else more sophisticated at work. There is not. There's no difference than if each of the 5 timeout callbacks were just declared one right after the other, with no loop at all.

What's missing? We need more closured scope. Specifically, we need a new closured scope for each iteration of the loop.
The IIFE creates scope by declaring a function and immediately executing it.

Let's try:
```javascript
for (var i=1; i<=5; i++) {
    (function(){
        setTimeout( function timer(){
            console.log( i );
        }, i*1000 );
    })();
}
```
Does that work? **NO**.

We now obviously have more lexical scope. Each timeout function callback is indeed closing over its own per-iteration scope created respectively by each IIFE.

It's not enough to have a scope to close over if that scope is empty. Look closely. Our IIFE is just an empty do-nothing scope. It needs something in it to be useful to us.

It needs its own variable, with a copy of the i value at each iteration.
```javascript
for (var i=1; i<=5; i++) {
    (function(){
        var j = i;
        setTimeout( function timer(){
            console.log( j );
        }, j*1000 );
    })();
}
```
Eureka! It works!

A slight variation some prefer is:
```javascript
for (var i=1; i<=5; i++) {
    (function(j){
        setTimeout( function timer(){
            console.log( j );
        }, j*1000 );
    })( i );
}
```
The use of an IIFE inside each iteration created a new scope for each iteration, which gave our timeout function callbacks the opportunity to close over a new scope for each iteration, one which had a variable with the right per-iteration value in it for us to access.

---

## Block Scoping Revisited

Look carefully at our analysis of the previous solution. We used an **IIFE** to create new scope per-iteration. In other words, we actually needed a per-iteration block scope. The **let** declaration,  hijacks a block and declares a variable right there in the block.

**It essentially turns a block into a scope that we can close over.** So, the following awesome code "just works":
```javascript
for (var i=1; i<=5; i++) {
    let j = i; // yay, block-scope for closure!
    setTimeout( function timer(){
        console.log( j );
    }, j*1000 );
}
```
There's a special behavior defined for **let** declarations used in the head of a for-loop. This behavior says that the variable will be declared not just once for the loop, but each iteration. And, it will, helpfully, be initialized at each subsequent iteration with the value from the end of the previous iteration.
```javascript
for (let i=1; i<=5; i++) {
    setTimeout( function timer(){
        console.log( i );
    }, i*1000 );
}
``` 
 
---

## Modules

```javascript
function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];

    function doSomething() {
        console.log( something );
    }

    function doAnother() {
        console.log( another.join( " ! " ) );
    }

    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}

var foo = CoolModule();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

This is the pattern in JavaScript we call **module**. The most common way of implementing the module pattern is often called **Revealing Module**, and it's the variation we present here.

**some things about this code:**

Firstly, `CoolModule()` is just a function, but it has to be invoked for there to be a module instance created. Without the execution of the outer function, the creation of the inner scope and the closures would not occur.

Secondly, the `CoolModule()` function returns an object, denoted by the object-literal syntax `{ key: value, ... }`. The object we return has references on it to our inner functions, but not to our inner data variables. We keep those hidden and private. It's appropriate to think of this object return value as essentially a public API for our module.

This object return value is ultimately assigned to the outer variable foo, and then we can access those property methods on the API, like `foo.doSomething()`.

**Note:** It is not required that we return an actual object (literal) from our module. We could just return back an inner function directly. jQuery is actually a good example of this. The jQuery and $ identifiers are the public API for the jQuery "module", but they are, themselves, just a function (which can itself have properties, since all functions are objects).

The `doSomething()` and `doAnother()` functions have closure over the inner scope of the module **instance** (arrived at by actually invoking `CoolModule()`). When we transport those functions outside of the lexical scope, by way of property references on the object we return, we have now set up a condition by which closure can be observed and exercised.

To state it more simply, **there are two "requirements" for the module pattern to be exercised**:

There must be an outer enclosing function, and it must be invoked at least once (each time creates a new module instance).

The enclosing function must return back at least one inner function, so that this inner function has closure over the private scope, and can access and/or modify that private state.

---

The code snippet above shows a standalone module creator called `CoolModule()` which can be invoked any number of times, each time creating a new module instance. A slight variation on this pattern is when you only care to have one instance, a **singleton** of sorts:

```javascript
var foo = (function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];

    function doSomething() {
        console.log( something );
    }

    function doAnother() {
        console.log( another.join( " ! " ) );
    }

    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
})();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```
 
***Closure is when a function can remember and access its lexical scope even when it's invoked outside its lexical scope.***
