        function mfunction() {

            //socket is global
            socket = io.connect();
            alert("connected to dashboard");


            function sendMessage(total) {
                socket.emit("totalWaitingCalls", { "totalWaiting": total });
            }

            //Receiving number of total waiting calls
            socket.on('totalWaitingCalls', function (msg) {

                var calls = msg.totalWaiting
                if (parseInt(calls) == 0) {
                    calls = 'No Incoming Calls'
                }

                var messages = document.getElementById('totalWaitingCalls').innerText = calls;
                // messages.set
                window.scrollTo(0, document.body.scrollHeight);
            });

            // Average Waiting Times
            socket.on("waitingTime", function (msg) {
                var item = document.createElement('li');
                item.textContent = msg;
                var messages = document.getElementById('waitingTime').innerText =
                    parseInt(msg) + " Seconds";
                // messages.set
                window.scrollTo(0, document.body.scrollHeight);
            });

            socket.on('stats', function (msg) {
                var messages = document.getElementById('waitingTime').innerText =
                    parseInt(msg.avarageWaitingTime) + " Seconds";
                var totalCalls = document.getElementById('totalCalls').innerText = msg.totalCalls;
                var complaints = document.getElementById('complaintCalls').innerText = msg.endOftheDay.Complaint;
                var disconnects = document.getElementById('disconnectingCalls').innerText = msg.endOftheDay.Disconnecting;
                var joinings = document.getElementById('joiningCalls').innerText = msg.endOftheDay.Joining;
                var services = document.getElementById('serviceCalls').innerText = msg.endOftheDay.Service;
                var tenMinWait = document.getElementById('tenMinWait').innerText = msg.tenMinWaitTime;
                // messages.set
                window.scrollTo(0, document.body.scrollHeight);
            })
        }
