import Person, {f3} from './person.mjs'; //不是export default的物件，需要用{}包起來才能import

const p1 = new Person("Jack", 25);

console.log(p1);
console.log(f3(2));