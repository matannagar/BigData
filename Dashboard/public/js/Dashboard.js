function mfunction() {

    //socket is global
    socket = io.connect();
    alert("connected to dashboard");

    _linesMultipleDarkExample([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    _scatterPieBasicDarkExample(0, 0, 0, 0);

    socket.on('stats', function (msg) {
        // var messages = document.getElementById('waitingTime').innerText =
        //     parseInt(msg.avarageWaitingTime) + " Seconds";
        document.getElementById('totalWaitingCalls').innerText = msg.currWaitingCalls
        var totalCalls = document.getElementById('totalCalls').innerText = msg.totalCalls;
        var complaints = document.getElementById('complaintCalls').innerText = msg.endOftheDay.Complaint;
        var disconnects = document.getElementById('disconnectingCalls').innerText = msg.endOftheDay.Disconnecting;
        var joinings = document.getElementById('joiningCalls').innerText = msg.endOftheDay.Joining;
        var services = document.getElementById('serviceCalls').innerText = msg.endOftheDay.Service;
        var tenMinWait = document.getElementById('tenMinWait').innerText = msg.tenMinWaitTime;
        var waitArray = msg.waitTimeArray;
        var totalCallArray = msg.totalCallsArray;

        _linesMultipleDarkExample(waitArray, totalCallArray);
        _scatterPieBasicDarkExample(parseInt(msg.endOftheDay.Joining), parseInt(msg.endOftheDay.Disconnecting), parseInt(msg.endOftheDay.Complaint), parseInt(msg.endOftheDay.Service));
        // messages.set
        window.scrollTo(0, document.body.scrollHeight);
    })
}

