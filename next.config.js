/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    WS_ROSBRIDGE_URL: process.env.WS_ROSBRIDGE_URL,
    WS_MQTT_BROKER_URL: process.env.WS_MQTT_BROKER_URL
  },
};

module.exports = nextConfig;
