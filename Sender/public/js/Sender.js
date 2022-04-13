var customers;
var callStartedWaitingAt;

function initSocket() {
    //socket is global
    socket = io.connect();
    alert("connected");
    socket.on("customers", function (msg) {
        customers = msg;
    });
}

function calculatePeriod() {
    const date = Date.now();
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }] = dateTimeFormat.formatToParts(date)
    //holiday dates
    var holidays = {
        // 'Mar': [20, 21, 22],
        'Apr': [15, 16, 17, 18, 19, 20, 21, 22],
        'May': [4, 5], 6: [4, 5],
        'Sep': [25, 26, 27],
        'Oct': [4, 5, 9, 10, 16, 17]
    }

    if (holidays[month] !== undefined) {
        if (holidays[month].includes(parseInt(day))) {
            return "Holidays";
        }
        else {
            return "Yamei Hol";
        }
    }
    else if (month == "Jul" || month == "Aug") {
        return "Summer Break";
    }
    else {
        return "Yamei Hol";
    }

}

//emiting number of waiting calls
function sendMessage(total) {
    socket.emit("totalWaitingCalls", { totalWaiting: total });
}

//Generating random numbers
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//calculate age
function getAge(dateString) {
    var ageInMilliseconds = new Date() - new Date(dateString);
    return Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years
}

//calculate how long it took to answer the call
function countTime() {
    var waitingCalls = parseInt(document.getElementById("total").value)
    if (waitingCalls > 0) {
        callStartedWaitingAt = Date.now();
        // const afterClick = document.getElementById("answerCall");
        // var endTime;

        // afterClick.addEventListener('click', e => {
        //     endTime = performance.now();
        //     //sends out call details 
        //     return ((endTime - startTime) / 1000)
        // })
    }
}
//counts amount of calls per customer
var totalCalls = {}

// generates calls from random users
function startConv(total) {
    if (total > 0) {
        // WAITING CALLS
        var waitingCalls = parseInt(document.getElementById("total").value) || 0;
        if (parseInt(waitingCalls) > 0) {
            document.getElementById("total").value = (--waitingCalls) + "";
            sendMessage(waitingCalls);
        }

        var tr = document.getElementById('openConversations').insertRow();

        var cStart = tr.insertCell(0); //time of conversation
        var cPeriod = tr.insertCell(1); //time of the year
        var cName = tr.insertCell(2); //Caller's name
        var cCity = tr.insertCell(3); //city call is coming from
        var cGender = tr.insertCell(4); // Caller's gender
        var cAge = tr.insertCell(5); // Caller's age
        var cTotal = tr.insertCell(6); //Total number of calls
        var cProduct = tr.insertCell(7) // product type
        var cTopic = tr.insertCell(8); // topic 
        var cEnd = tr.insertCell(9);
        var cWait = tr.insertCell(10); //total waiting time for answer

        const date = Date.now();
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' })
        const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }] = dateTimeFormat.formatToParts(date)

        cStart.innerHTML = "<div id='" + date + "''>" + `${day}-${month}-${year} ,${hour}:${minute}` + "</div>";

        var items = ['Joining', 'Service', 'Complaint', 'Disconnecting']

        //generate random number
        var randomNum = getRandomArbitrary(0, customers.length)
        //pull the customer from the array
        var customer = customers[randomNum];

        //add call to total Number of calls from each customer
        var customerName = customer.name
        totalCalls[customerName] = (totalCalls[customerName] + 1) || 1;

        //set data
        cName.innerHTML = "<div id='cname'>" + customer.name + "</div>";
        cCity.innerHTML = "<div>" + customer.city + "</div>";
        cGender.innerHTML = "<div>" + customer.gender + "</div>";
        cAge.innerHTML = "<div>" + getAge(customer.birthDate) + "</div>";
        cTotal.innerHTML = "<div>" + totalCalls[customerName] + "</div>"; //change thi+""s
        cProduct.innerHTML = "<div>" + customer.products + "</div>";
        cTopic.innerHTML = "<div>" + items[Math.floor(Math.random() * items.length)] + "</div>";
        cWait.innerHTML = "<div>" + ((parseInt(Date.now() - parseInt(callStartedWaitingAt))) / 1000) + "</div>";

        //Verify Period Of Time
        // this method uses the "holidays" object 
        cPeriod.innerText = calculatePeriod()

        cEnd.innerHTML = "<button onclick='reportEndCall(this.parentNode.parentNode)'>End This Call</button>";
    }
}
function reportEndCall(row) {
    var message = {};
    message.id = row.cells[0].getElementsByTagName('div')[0].id;
    message.period = row.cells[1].getElementsByTagName('div').textContent;
    message.name = row.cells[2].getElementsByTagName('div')[0].textContent;
    message.city = row.cells[3].getElementsByTagName('div')[0].textContent;
    message.gender = row.cells[4].getElementsByTagName('div')[0].textContent;
    message.age = row.cells[5].getElementsByTagName('div')[0].textContent;
    message.totalCalls = row.cells[6].getElementsByTagName('div')[0].textContent;
    message.products = row.cells[7].getElementsByTagName('div')[0].textContent;
    message.topic = row.cells[8].getElementsByTagName('div')[0].textContent;
    message.totalTime = (parseInt(Date.now()) - parseInt(message.id)) / 1000; // seconds
    message.waitTime = row.cells[10].getElementsByTagName('div')[0].textContent;
    message.currWaitingCalls = parseInt(document.getElementById("total").value) || 0;;
    //sends out call details 
    socket.emit("callDetails", message);
    deleteRow(row);
}
//remove call when ended
function deleteRow(row) {
    var i = row.rowIndex;
    document.getElementById('openConversations').deleteRow(i);
}
