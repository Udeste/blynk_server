const BlynkLib = require('blynk-library');
const ResourceCollector = require('./resource-collector');

class RaspbettoBlynk {

  constructor() {
    this.blynk = new BlynkLib.Blynk(process.env.BLYNK_KEY);
    this.refreshInterval = 5000;

    this.resources =  new ResourceCollector();

    /** Refresh rate */
    this.v0 = new this.blynk.VirtualPin(0);
    /** Used RAM Percent*/
    this.v1 = new this.blynk.VirtualPin(1);
    /** CPU Usage Percent */
    this.v2 = new this.blynk.VirtualPin(2);
    /** CPU Temp */
    this.v3 = new this.blynk.VirtualPin(3);
    /** CPU Freq */
    this.v4 = new this.blynk.VirtualPin(4);
    /** Disk usage percent */
    this.v5 = new this.blynk.VirtualPin(5);

    /** CPU load one */
    this.v6 = new this.blynk.VirtualPin(6);
    /** CPU load five */
    this.v7 = new this.blynk.VirtualPin(7);
    /** CPU load fifteen */
    this.v8 = new this.blynk.VirtualPin(8);

    this.setupEvents();
    this.setupVirtualWrites()
  }

  setupVirtualWrites() {
    this.v0.on('write', param => {
      this.refreshInterval = param * 1000;
      this.resources.initWorkers(this.refreshInterval);
      this.clearInterval();
      this.setupInterval();
    });
  }

  syncPins() {
    console.log('Syncing Virtual Pins');
    this.blynk.syncVirtual(0);
  }

  sendData() {
    this.v1.write(this.resources.ramUsagePercent);
    this.v2.write(this.resources.cpuPercent);
    this.v3.write(this.resources.cpuTemp);
    this.v4.write(this.resources.cpuFreq);
    this.v5.write(this.resources.diskUsagePercent);
    this.v6.write(this.resources.loadOne);
    this.v7.write(this.resources.loadFive);
    this.v8.write(this.resources.loadFifteen);
  }

  setupEvents() {
    this.blynk.on('connect', () => {
      console.log("Blynk ready.");
      this.syncPins();
    });

    this.blynk.on('disconnect', () => {
      console.log("DISCONNECT");
    });
  }

  setupInterval() {
    console.log('Setting up sendData interval to', this.refreshInterval, 'ms');
    this.sendDataInterval = setInterval(this.sendData.bind(this), this.refreshInterval);
  }

  clearInterval() {
    clearInterval(this.sendDataInterval);
  }
}

module.exports = RaspbettoBlynk;
