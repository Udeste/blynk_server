module.exports = {
  apps : [{
    name: 'Blynk server',
    script: 'index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      BLYNK_KEY: ''
    },
    env_production: {
      NODE_ENV: 'production',
      BLYNK_KEY: ''
    }
  }],
};
