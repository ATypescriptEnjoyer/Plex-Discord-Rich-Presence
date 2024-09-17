import { copyFileSync } from "fs";
import pkg from "./package.json" assert { type: "json" };
import { exec } from "child_process";
import util from 'util';
const execAsync = util.promisify(exec);

await execAsync("yarn build");
await execAsync("node --experimental-sea-config sea-config.json");
const fileExtension = process.platform === "win32" ? ".exe" : "";
const packageName = `${pkg.name.replaceAll("_", "-")}-v${
  pkg.version
}${fileExtension}`;

copyFileSync(process.execPath, packageName);
if (process.platform === "win32") {
  await execAsync(`signtool remove /s ${packageName}`);
}
await execAsync(`npx --yes postject ${packageName} NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 `);
console.log(packageName);