
// not supported

function func1(){
	console.log("default");
}

function func1(a,b){
	console.log(a + "" + b);
} 

function func1(a){
	console.log(a);
}

function callMe(){
	func1(3,4);
}

callMe();