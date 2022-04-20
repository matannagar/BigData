// Basic pie chart
var _scatterPieBasicDarkExample = function (a, b, c, d) {
    if (typeof echarts == 'undefined') {
        console.warn('Warning - echarts.min.js is not loaded.');
        return;
    }

    // Define element
    var pie_basic_element = document.getElementById('pie_basic');


    //
    // Charts configuration
    //

    if (pie_basic_element) {

        // Initialize chart
        var pie_basic = echarts.init(pie_basic_element);


        //
        // Chart config
        //

        // Options
        pie_basic.setOption({

            // Colors
            color: [
                '#2ec7c9', '#d84c74', '#5ab1ef', '#c76932'
            ],

            // Global text styles
            textStyle: {
                fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                fontSize: 13
            },

            // Add title
            title: {
                text: 'split of daily calls',
                subtext: 'Open source information',
                left: 'center',
                textStyle: {
                    fontSize: 17,
                    fontWeight: 500,
                    color: '#fff'
                },
                subtextStyle: {
                    fontSize: 12,
                    color: '#fff'
                }
            },

            // Add tooltip
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: [10, 15],
                textStyle: {
                    color: '#222',
                    fontSize: 13,
                    fontFamily: 'Roboto, sans-serif'
                },
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },

            // Add legend
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 0,
                data: ['Join', 'Disconnect', 'Complaint', 'Service'],
                itemHeight: 8,
                itemWidth: 8,
                textStyle: {
                    color: '#fff'
                }
            },

            // Add series
            series: [{
                name: 'calls',
                type: 'pie',
                radius: '70%',
                center: ['50%', '57.5%'],
                itemStyle: {
                    normal: {
                        borderWidth: 2,
                        borderColor: '#353f53'
                    }
                },
                data: [
                    { value: a, name: 'Join' },
                    { value: b, name: 'Disconnect' },
                    { value: c, name: 'Complaint' },
                    { value: d, name: 'Service' },
                ]
            }]
        });
    }


    //
    // Resize charts
    //

    // Resize function
    var triggerChartResize = function () {
        pie_basic_element && pie_basic.resize();
    };

    // On sidebar width change
    var sidebarToggle = document.querySelectorAll('.sidebar-control');
    if (sidebarToggle) {
        sidebarToggle.forEach(function (togglers) {
            togglers.addEventListener('click', triggerChartResize);
        });
    }

    // On window resize
    var resizeCharts;
    window.addEventListener('resize', function () {
        clearTimeout(resizeCharts);
        resizeCharts = setTimeout(function () {
            triggerChartResize();
        }, 200);
    });
};

function mfunction() {

    //socket is global
    socket = io.connect();
    alert("connected to dashboard");

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

    socket.on('stats', function (msg) {
        // var messages = document.getElementById('waitingTime').innerText =
        //     parseInt(msg.avarageWaitingTime) + " Seconds";
        var totalCalls = document.getElementById('totalCalls').innerText = msg.totalCalls;
        var complaints = document.getElementById('complaintCalls').innerText = msg.endOftheDay.Complaint;
        var disconnects = document.getElementById('disconnectingCalls').innerText = msg.endOftheDay.Disconnecting;
        var joinings = document.getElementById('joiningCalls').innerText = msg.endOftheDay.Joining;
        var services = document.getElementById('serviceCalls').innerText = msg.endOftheDay.Service;
        var tenMinWait = document.getElementById('tenMinWait').innerText = msg.tenMinWaitTime;

        _scatterPieBasicDarkExample(parseInt(msg.endOftheDay.Joining), parseInt(msg.endOftheDay.Disconnecting), parseInt(msg.endOftheDay.Complaint), parseInt(msg.endOftheDay.Service));
        // messages.set
        window.scrollTo(0, document.body.scrollHeight);
    })
}

