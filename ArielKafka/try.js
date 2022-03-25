

// export function hoursToMidnight() {
//     var nd = new Date().setHours(23, 59, 59);
//     var expire = Math.floor((nd - Date.now()) / 1000);
//     console.log("i am here " + expire)
// }

module.exports = {
    hoursToMidnight: function () {
        var nd = new Date().setHours(23, 59, 59);
        var expire = Math.floor((nd - Date.now()) / 1000);
        console.log("i am here " + expire);
    },
    bar: function () {
        // whatever
    }
};
