window.onload = function () {
    startTime();
    startCount();
    getSysinfo();
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    setTimeout(function () {
        startTime()
    }, 1000);
}

var date = new Date();
date.setHours(0);
date.setMinutes(0);
date.setSeconds(1);

function startCount() {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();

    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('countUp').innerHTML = h + ":" + m + ":" + s;
    date.setSeconds(date.getSeconds() + 1);
    setTimeout(function () {
        startCount()
    }, 1000);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function setColor(element, color) {
    element.classList.remove(element.classList.item(element.classList.length - 1))
    element.classList.add(color);
}

function getSysinfo() {
    let ws = new WebSocket("ws://127.0.0.1:3000/sysinfo");
    ws.onmessage = function(event) {
        let data = JSON.parse(event.data);

        if(data.network.operstate == "up") {
            setColor(document.getElementById("routerIndicator"), "green")
        } else {
            setColor(document.getElementById("routerIndicator"), "red")
        }

        if(data.temperature >= 70) {
            setColor(document.getElementById("cpuTempIndicator"), "yellow")
        }else if(data.temperature >= 100) {
            setColor(document.getElementById("cpuTempIndicator"), "red")
        }else {
            setColor(document.getElementById("cpuTempIndicator"), "green")
        }

        document.getElementById("cpuTemp").innerText = data.temperature + "°C";
        
    };
    setTimeout(function () {
        getSysinfo()
    }, 1000);
}