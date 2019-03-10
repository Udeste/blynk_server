const  RaspbettoBlynk = require('./blynk');

const blink = new RaspbettoBlynk();

 // ---- trap the SIGINT and reset before exit
 process.on('SIGINT', () => {
  blink.clearInterval();
  process.nextTick(() => process.exit(0));
});
