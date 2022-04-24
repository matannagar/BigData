// Line multiples
var _linesMultipleDarkExample = function (num, time) {
    if (typeof echarts == 'undefined') {
        console.warn('Warning - echarts.min.js is not loaded.');
        return;
    }

    // Define element
    var line_multiple_element = document.getElementById('line_multiple');


    //
    // Charts configuration
    //

    if (line_multiple_element) {

        // Initialize chart
        var line_multiple = echarts.init(line_multiple_element);


        var hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

        //
        // Chart config
        //

        // Options
        line_multiple.setOption({

            // Define colors
            color: ['#FF8A65', '#4FC3F7'],

            // Global text styles
            textStyle: {
                fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                fontSize: 13
            },

            // Chart animation duration
            animationDuration: 750,

            // Setup grid
            grid: [
                {
                    left: 0,
                    right: 20,
                    top: 40,
                    height: 160,
                    containLabel: true
                },
                {
                    left: 0,
                    right: 20,
                    top: 280,
                    height: 160,
                    containLabel: true
                }
            ],

            // Title
            title: [
                {
                    left: 'center',
                    text: 'hourly waiting time',
                    top: 0,
                    textStyle: {
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#fff'
                    }
                },
                {
                    left: 'center',
                    text: 'hourly waiting calls',
                    top: 240,
                    textStyle: {
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#fff'
                    }
                }
            ],

            // Tooltip
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: [10, 15],
                textStyle: {
                    color: '#222',
                    fontSize: 13,
                    fontFamily: 'Roboto, sans-serif'
                },
                formatter: function (a) {
                    return (
                        a[0]['axisValueLabel'] + "<br>" +
                        '<span class="badge badge-mark mr-2" style="border-color: ' + a[0]['color'] + '"></span>' +
                        a[0]['seriesName'] + ': ' + a[0]['value'] + ' seconds' + "<br>" +
                        '<span class="badge badge-mark mr-2" style="border-color: ' + a[1]['color'] + '"></span>' +
                        a[1]['seriesName'] + ': ' + a[1]['value']
                    );
                }
            },

            // Connect axis pointers
            axisPointer: {
                link: {
                    xAxisIndex: 'all'
                },
                lineStyle: {
                    color: 'rgba(255,255,255,0.25)'
                }
            },

            // Horizontal axis
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        onZero: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.25)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)',
                            width: 1,
                            type: 'dashed'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(255,255,255,0.01)', 'rgba(0,0,0,0.01)']
                        }
                    },
                    data: hours,
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        onZero: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.25)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)',
                            width: 1,
                            type: 'dashed'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(255,255,255,0.01)', 'rgba(0,0,0,0.01)']
                        }
                    },
                    data: hours,
                }
            ],

            // Vertical axis
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        onZero: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.25)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)',
                            width: 1,
                            type: 'dashed'
                        }
                    }
                },
                {
                    gridIndex: 1,
                    type: 'value',
                    axisLine: {
                        onZero: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.25)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)',
                            width: 1,
                            type: 'dashed'
                        }
                    }
                }
            ],

            // Add series
            series: [
                {
                    name: 'waiting',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 7,
                    itemStyle: {
                        normal: {
                            borderWidth: 2
                        }
                    },
                    data: num,
                },
                {
                    name: 'hourly number',
                    type: 'line',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 7,
                    itemStyle: {
                        normal: {
                            borderWidth: 2
                        }
                    },
                    data: time,
                }
            ]
        });
    }


    //
    // Resize charts
    //

    // Resize function
    var triggerChartResize = function () {
        line_multiple_element && line_multiple.resize();
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

