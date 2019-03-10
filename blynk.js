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

    /** Led Colors */
    this.v6 = new this.blynk.VirtualPin(6);
    /** Number of active leds */
    this.v7 = new this.blynk.VirtualPin(7);
    /** Leds refresh rate */
    this.v8 = new this.blynk.VirtualPin(8);
    /** Leds mode
     * 1: OFF
     * 2: CPU %
     * 3: CPU Temp
     * 4: MEM %
     * 5: CPU Freq
    */
    this.v9 = new this.blynk.VirtualPin(9);

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

    // SETUP LEDS COLOR
    // this.v6.on('write', param => this.ledController.setFillColor(param));

    // // SETUP NUMBER OF ACTIVE LEDS
    // this.v7.on('write', param => this.ledController.setActivePixels(param[0]));
    // this.v8.on('write', param => this.ledController.setRefreshRate(param[0]));
    // this.v9.on('write', param => this.ledController.setLedsMode(param[0]));
  }

  syncPins() {
    console.log('Syncing Virtual Pins');
    this.blynk.syncVirtual(0);
    this.blynk.syncVirtual(6);
    this.blynk.syncVirtual(7);
    this.blynk.syncVirtual(8);
    this.blynk.syncVirtual(9);
  }

  sendData() {
    this.v1.write(this.resources.ramUsagePercent);
    this.v2.write(this.resources.cpuLoad);
    this.v3.write(this.resources.cpuTemp);
    this.v4.write(this.resources.cpuFreq);
    this.v5.write(this.resources.diskUsagePercent);
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
