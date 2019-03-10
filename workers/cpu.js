const { exec } = require('child_process');
const os = require('os');

let cpuTemp = 0;
let cpuLoad = 0;
let cpuFreq = 0;

function collectCPUTemp() {
  process.nextTick(() => {
    exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout) => {
      if (!error) {
        let lines = stdout.toString().split('\n');
        if (lines.length > 0) {
          cpuTemp = parseFloat(lines[0]) / 1000.0;
        }
      }
    });
  });
}

function collectCPULoad() {
  cpuLoad = os.loadavg()[0] * 100 / os.cpus().length; // Load One
}

function collectCPUFreq() {
  cpuFreq = os.cpus()[0].speed;
}

function sendData() {
  process.send({ cpuFreq, cpuTemp, cpuLoad });
}

const refreshRate = parseInt(process.argv[2]);

setImmediate(collectCPUFreq);
setImmediate(collectCPULoad);
setImmediate(collectCPUTemp);

setInterval(collectCPUFreq, refreshRate);
setInterval(collectCPULoad, refreshRate);
setInterval(collectCPUTemp, refreshRate * 3);

setInterval(sendData, refreshRate / 2)
