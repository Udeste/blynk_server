const { exec } = require('child_process');

let diskUsagePercent = 0;

function collectDiskData() {
  const cmd = 'df --output=pcent /';
  exec(cmd, (error, stdout) => {
    if (!error) {
      let lines = stdout.toString().split('\n');
      diskUsagePercent = parseInt(lines[1].replace('%', ''));
      sendData({ diskUsagePercent });
    }
  });
}

function sendData(data) {
  process.send(data);
}

const refreshRate = parseInt(process.argv[2]);

setImmediate(collectDiskData);

setInterval(collectDiskData, refreshRate * 6);
