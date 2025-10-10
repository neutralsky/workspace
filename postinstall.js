// postinstall.js
import { exec } from "child_process";

function run(cmd) {
  return new Promise((resolve, reject) => {
    const p = exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        reject(err);
      } else {
        console.log(stdout);
        resolve();
      }
    });
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
  });
}

(async () => {
  try {
    console.log("Installing Playwright browsers...");
    await run("npx playwright install");
    console.log("Installing Playwright system dependencies...");
    await run("npx playwright install-deps");
    console.log("Playwright setup complete ✅");
  } catch (err) {
    console.error("Playwright setup failed ❌", err);
    process.exit(1);
  }
})();
