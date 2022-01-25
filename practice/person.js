class Person{
    constructor(name = "none", age = 0){
        this.name = name;
        this.age = age;
    }

    toJson(){
        return JSON.stringify({
            name: this.name,
            age: this.age
        })
    }

    sayHi(){
        return `Hi! ${this.name}`;
    }
}

//沒有exports的物件，其他JS是無法使用
const f3 = a => a*a*a;

console.log('person.js');

//exports一次只能export一個，要多個必須裝成一個物件
module.exports = {Person, f3};

// const p = new Person('Miles', 25);
// console.log(p.toJson());
// console.log(p.sayHi());