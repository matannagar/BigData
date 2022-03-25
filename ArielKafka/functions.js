function countTime() {
    console.log("activated countTime function")
    var waitingCalls = parseInt(document.getElementById("total").value)
    console.log(waitingCalls)
    if (waitingCalls > 0) {

        var startTime = performance.now();
        const afterClick = document.getElementById("answerCall")
        var endTime;


        afterClick.addEventListener('click', e => {
            endTime = performance.now();
            //sends out call details 
            socket.emit("waitingTime", (endTime - startTime) / 1000);
        })
    }
}
