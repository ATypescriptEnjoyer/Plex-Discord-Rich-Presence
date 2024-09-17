import { copyFileSync } from "fs";
import pkg from "./package.json" assert { type: "json" };
import { exec } from "child_process";
import util from 'util';
const execAsync = util.promisify(exec);

console.log("Running 'Yarn Build'");
await execAsync("yarn build");
console.log("Generating sea blob");
await execAsync("node --experimental-sea-config sea-config.json");
const fileExtension = process.platform === "win32" ? ".exe" : "";
const packageName = `${pkg.name.replaceAll("_", "-")}-v${
  pkg.version
}${fileExtension}`;

console.log(`Copying node exec to ${packageName}`);
copyFileSync(process.execPath, packageName);
if (process.platform === "win32") {
    console.log("WINDOWS: Removing signing from package");
  await execAsync(`signtool remove /s ${packageName}`);
}
console.log("Injecting bundle into exec");
await execAsync(`npx --yes postject ${packageName} NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 `);
console.log("Finished!");
console.log(`VERSION: ${packageName}`);