const nextConfig = {
    webpack: (config, { isServer }) => {
      // Add a rule to handle .wasm files
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });

      // Ensure WebAssembly is enabled
      config.experiments = { asyncWebAssembly: true };

      return config;
    },
  };

module.exports = nextConfig;