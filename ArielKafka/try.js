// "use strict";
import fetch from "node-fetch";
function getAge(dateString) {
    var ageInMilliseconds = new Date() - new Date(dateString);
    return Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years
}
console.log(getAge('1994-08-31'));

fetch('http://127.0.0.1:8887/customers.json')
    .then(function (resp) {
        return resp.json();
    })
    .then(function (data) {
        console.log(data.length);
        var randomNum = getRandomArbitrary(0, data.length)
        console.log(randomNum)
        var myCustomer = data[randomNum];
        console.log(myCustomer.name)
    })

//Generating random numbers
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
