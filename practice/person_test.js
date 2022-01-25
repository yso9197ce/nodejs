const obj = require('./person');
const {Person} = require('./person');
const {Person2, f3} = require('./person');

const p1 = new obj.Person("Bill", 18);
const p2 = new Person("Jack", 25);

//require多次，但只會執行一次person.js
//當require多次同一個js，node會將第一次的require存在記憶體內，後面的require會從記憶體拿取，而不會重複執行

console.log(p1);
console.log(p2);
console.log(f3(2));
console.log(obj.Person === Person);