const { app, BrowserWindow } = require('electron')

const express = require('express');
const backend = express();
const expressWs = require('express-ws')(backend)

const sysinfo = require('systeminformation')

const { spawn } = require('child_process')
const child = spawn('npm', ['run', 'server']);

// Behalten Sie eine globale Referenz auf das Fensterobjekt. 
// Wenn Sie dies nicht tun, wird das Fenster automatisch geschlossen, 
// sobald das Objekt dem JavaScript-Garbagekollektor übergeben wird.

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({ width: 480, height: 320, frame: false })
    mainWindow.setResizable(false);
    mainWindow.loadFile('app/index.html')

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

backend.ws('/sysinfo', function(ws, req) {
  let response = { 
    "temperature": null,
    "network": null
  }
  
  sysinfo.cpuTemperature().then(data => {
    response.temperature = data.main

    sysinfo.networkInterfaces().then(data => {
      response.network = data
      ws.send(JSON.stringify(response));
    })
  })
});

backend.listen(3000);