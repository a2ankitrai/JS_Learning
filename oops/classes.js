class Animal{
	constructor(name){
		this.name = name;
	}

	speak(){
		console.log(this.name +" speaking generically..");
	}
}

class Dog extends Animal{
	speak(){
		super.speak();
		console.log(this.name+" speaking bhow bhow...!");
	}
}

var d = new Dog("Bruno");
d.speak();