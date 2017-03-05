/**
 @constructor
 @abstract
 */

var Animal = function(name) {
	if (!name) this.name = "generic";
	else
		this.name = name;
	if (this.constructor === Animal) {
		throw new Error("Can not instantiate abstract class");
	}
}

Animal.prototype.say = function() {
	throw new Error("abstract method");
}

// var genericAnimal = new Animal();
// console.log(genericAnimal);

var Cat = function() {
	Animal.apply(this);
};

Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;
Cat.prototype.say = function() {
	console.log("meoooow..");
}


var c = new Cat();
c.say();

new Animal();

/* class Dog extends Animal {
	say() {
		console.log(this.name + ' barks.');
	}
}

var dog = new Dog();
console.log(dog.name);
*/
