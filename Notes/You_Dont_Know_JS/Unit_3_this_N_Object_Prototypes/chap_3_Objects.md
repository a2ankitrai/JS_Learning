# Chapter 3: Objects

## Syntax

Objects come in two forms: the declarative (literal) form, and the constructed form.

The literal syntax for an object looks like this:
```javascript
var myObj = {
    key: value
    // ...
};
```

The constructed form looks like this:
```javascript
var myObj = new Object();
myObj.key = value;
```

---

## Type

Objects are the general building block upon which much of JS is built. They are one of the 6 primary types (called **language types** in the specification) in JS:

- `string`

- `number`

- `boolean`

- `null`

- `undefined`

- `object`

Note that the simple primitives (`string`, `number`, `boolean`, `null`, and `undefined`) are not themselves `objects`. `null` is sometimes referred to as an object type, but this misconception stems from a bug in the language which causes `typeof null` to return the string `"object"` incorrectly (and confusingly). In fact, null is its own primitive type.

**It's a common mis-statement that "everything in JavaScript is an object". This is clearly not true.**

there are a few special object sub-types, which we can refer to as *complex primitives*.

`function` is a sub-type of object (technically, a "callable object"). Functions in JS are said to be "first class" in that they are basically just normal objects (with callable behavior semantics bolted on), and so they can be handled like any other plain object.

Arrays are also a form of objects, with extra behavior. The organization of contents in arrays is slightly more structured than for general objects.

### Built-in Objects

There are several other object sub-types, usually referred to as built-in objects.

- `String`

- `Number`

- `Boolean`

- `Object`

- `Function`

- `Array`

- `Date`

- `RegExp`

- `Error


In JS, these are actually just built-in functions. Each of these built-in functions can be used as a constructor (that is, a function call with the new operator), with the result being a newly constructed object of the sub-type in question. For instance:


```javascript
var strPrimitive = "I am a string";
typeof strPrimitive;                            // "string"
strPrimitive instanceof String;                 // false

var strObject = new String( "I am a string" );
typeof strObject;                               // "object"
strObject instanceof String;                    // true

// inspect the object sub-type
Object.prototype.toString.call( strObject );    // [object String]

```

The primitive value `"I am a string"` is not an object, it's a primitive literal and immutable value. To perform operations on it, such as checking its length, accessing its individual character contents, etc, a String object is required.

Luckily, the language automatically coerces a `"string"` primitive to a `String` object when necessary, which means you almost never need to explicitly create the Object form. The same sort of coercion happens between the number literal primitive `42` and the `new Number(42)` object wrapper. Likewise for `Boolean` objects from `"boolean"` primitives.

`null` and `undefined` have no object wrapper form, only their primitive values. By contrast, `Date` values can only be created with their constructed object form, as they have no literal form counter-part.

`Object`s, `Array`s, `Function`s, and `RegExp`s (regular expressions) are all objects regardless of whether the literal or constructed form is used.

`Error` objects are rarely created explicitly in code, but usually created automatically when exceptions are thrown. They can be created with the constructed form `new Error(..)`, but it's often unnecessary.

---

## Contents

**the contents of an object consist of values (any type) stored at specifically named locations, which we call properties.**

It's important to note that while we say "contents" which implies that these values are actually stored inside the object, that's merely an appearance. The engine stores values in implementation-dependent ways, and may very well not store them in some object container. What is stored in the container are these property names, which act as pointers (technically, references) to where the values are stored.

Consider:

```javascript
var myObject = {
    a: 2
};

myObject.a;     // 2

myObject["a"];  // 2
```

To access the value at the location `a` in `myObject`, we need to use either the `.` operator or the `[ ]` operator. The `.a` syntax is usually referred to as "property" access, whereas the `["a"]` syntax is usually referred to as "key" access. In reality, they both access the same location, and will pull out the same value, `2`, so the terms can be used interchangeably.

The main difference between the two syntaxes is that the `.` operator requires an `Identifier` compatible property name after it, whereas the `[".."]` syntax can take basically any UTF-8/unicode compatible string as the name for the property. To reference a property of the name "Super-Fun!", for instance, you would have to use the `["Super-Fun!"]` access syntax, as `Super-Fun!` is not a valid `Identifier` property name.

Also, since the [".."] syntax uses a string's value to specify the location, this means the program can programmatically build up the value of the string, such as:
```javascript
var wantA = true;
var myObject = {
    a: 2
};

var idx;

if (wantA) {
    idx = "a";
}

// later

console.log( myObject[idx] ); // 2
```

### Computed Property Names

The `myObject[..]` property access syntax we just described is useful if you need to use a computed expression value as the key name, like `myObject[prefix + name]`. But that's not really helpful when declaring objects using the object-literal syntax.

ES6 adds computed property names, where you can specify an expression, surrounded by a `[ ]` pair, in the key-name position of an object-literal declaration:
```javascript
var prefix = "foo";

var myObject = {
    [prefix + "bar"]: "hello",
    [prefix + "baz"]: "world"
};

myObject["foobar"]; // hello
myObject["foobaz"]; // world
```




















