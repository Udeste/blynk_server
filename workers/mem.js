const os = require('os');

let ramUsage = 0;
let ramUsagePercent = 0;

function collectRamData() {
  ramUsage = os.totalmem() - os.freemem();
  ramUsagePercent = (ramUsage * 100) / os.totalmem();
}

function sendData() {
  process.send({ ramUsage, ramUsagePercent });
}

const refreshRate = parseInt(process.argv[2]);

setImmediate(collectRamData);
setInterval(collectRamData, refreshRate * 2);

setInterval(sendData, refreshRate / 2);
