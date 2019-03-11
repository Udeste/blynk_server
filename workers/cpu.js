const { exec } = require('child_process');
const os = require('os');

let cpuTemp = 0;
let loadOne = 0;
let loadFive = 0;
let loadFifteen = 0;
let cpuPercent = 0;
let cpuFreq = 0;

let lastIdle = calcIdle(os.cpus());
let lastTotal = calcTotal(os.cpus())

function collectCPUTemp() {
  process.nextTick(() => {
    exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout) => {
      if (!error) {
        let lines = stdout.toString().split('\n');
        if (lines.length > 0) {
          cpuTemp = parseFloat(lines[0]) / 1000.0;
          sendData({ cpuTemp });
        }
      }
    });
  });
}

function collectCPULoad() {
  const load = os.loadavg();
  loadOne = load[0];
  loadFive = load[1];
  loadFifteen = load[2];
  sendData({ loadOne, loadFive, loadFifteen })
}

function collectCPUUsagePercent() {
  const nowIdle = calcIdle(os.cpus());
  const nowTotal = calcTotal(os.cpus())

  const idle = nowIdle - lastIdle;
  const total = nowTotal - lastTotal;
  const perc = idle * 100 / total;

  cpuPercent = 100 - perc;

  sendData({ cpuPercent });

  lastIdle = nowIdle;
  lastTotal = nowTotal;
}

function collectCPUFreq() {
  cpuFreq = os.cpus()[0].speed;
  sendData({ cpuFreq })
}

function sendData(data) {
  process.send(data);
}

function calcIdle(cpus) {
  return cpus.reduce((idle, cpu) => idle += cpu.times.idle, 0);
}

function calcTotal(cpus) {
  return cpus.reduce((total, cpu) => total += Object.keys(cpu.times).reduce((t, key) => t += cpu.times[key], 0), 0);
}

const refreshRate = parseInt(process.argv[2]);

setImmediate(collectCPUFreq);
setImmediate(collectCPUUsagePercent);
setImmediate(collectCPULoad);
setImmediate(collectCPUTemp);

setInterval(collectCPUFreq, refreshRate);
setInterval(collectCPUUsagePercent, refreshRate);
setInterval(collectCPULoad, refreshRate);
setInterval(collectCPUTemp, refreshRate * 3);
