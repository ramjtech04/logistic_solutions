// module.exports = {
//   apps: [
//     {
//       name: "frontend-dev",
//       script: "node_modules/next/dist/bin/next",
//       cwd: ".",
//       args: "start -p 3000",
//       exec_mode: "fork",
//       instances: 1,
//       autorestart: true,
//       watch: false, // auto reload in dev mode
//       env: {
//         NODE_ENV: "development",
//         PORT: 3000,
//       },
//     },
//     {
//       name: "app",
//       script: "node_modules/next/dist/bin/next", // Path to Next.js executable
//       cwd: ".",
//       args: "start -p 3000", // Arguments for the script
//       exec_mode: "fork",
//       instances: 1,
//       autorestart: true,
//       watch: false,
//       env: {
//         NODE_ENV: "production",
//         PORT: 3000,
//       },
//     },
//   ],
// };


module.exports = module.exports = {
  apps: [
    {
      name: "next-frontend",
      script: "node_modules/next/dist/bin/next",
      cwd: ".",
      args: "start -p 3000",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
