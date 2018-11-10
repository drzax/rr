const path = require("path");
const webpack = require("webpack");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  type: "react",
  devServer: {
    https: true
  },
  webpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        FB_API_KEY: JSON.stringify(process.env.FB_API_KEY),
        FB_AUTH_DOMAIN: JSON.stringify(process.env.FB_AUTH_DOMAIN),
        FB_DATABASE_URL: JSON.stringify(process.env.FB_DATABASE_URL),
        FB_PROJECT_ID: JSON.stringify(process.env.FB_PROJECT_ID),
        FB_STORAGE_BUCKET: JSON.stringify(process.env.FB_STORAGE_BUCKET),
        FB_MESSGING_SENDER_ID: JSON.stringify(process.env.FB_MESSGING_SENDER_ID)
      })
    );
    config.plugins.push(
      new GenerateSW({
        // importWorkboxFrom: "local",
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true
      })
    );

    return config;
  },
  babel: config => {
    config.plugins.push("@babel/plugin-proposal-class-properties");
    return config;
  }
};
