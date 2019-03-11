const { fork } = require('child_process');

class ResourceCollector {

  constructor() {
    this.cpuFreq = 0;
    this.cpuTemp = 0;
    this.cpuPercent = 0;
    this.loadOne = 0;
    this.loadFive = 0;
    this.loadFifteen = 0;
    this.ramUsage = 0;
    this.ramUsagePercent = 0;
    this.diskUsagePercent = 0;
    this.refreshRate = 5000;
  }

  initWorkers(refreshTime) {
    if (this.cpuWorker) this.cpuWorker.kill();
    if (this.memWorker) this.memWorker.kill();
    if (this.diskWorker) this.diskWorker.kill();

    this.cpuWorker = fork('./workers/cpu.js', [refreshTime]);
    this.memWorker = fork('./workers/mem.js', [refreshTime]);
    this.diskWorker = fork('./workers/disk.js', [refreshTime]);

    this.cpuWorker.on('message', data => {
      this.cpuFreq = data.cpuFreq || this.cpuFreq;
      this.cpuPercent = data.cpuPercent || this.cpuPercent;
      this.cpuTemp = data.cpuTemp || this.cpuTemp;
      this.loadOne = data.loadOne || this.loadOne;
      this.loadFive = data.loadFive || this.loadFive;
      this.loadFifteen = data.loadFifteen || this.loadFifteen;
    });

    this.memWorker.on('message', data => {
      this.ramUsage = data.ramUsage
      this.ramUsagePercent = data.ramUsagePercent;
    });

    this.diskWorker.on('message', data => {
      this.diskUsagePercent = data.diskUsagePercent;
    });

  }
}

module.exports = ResourceCollector;
