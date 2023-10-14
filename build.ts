import { build, BuildOptions, context } from "esbuild";
import { spawn } from "child_process";
import { compilerOptions } from "./tsconfig.json";

const dev = process.argv.pop() == "dev";

const alias: Record<string, string> = {};
for (const key in compilerOptions.paths) {
  alias[key] =
    compilerOptions.paths[key as keyof typeof compilerOptions.paths][0];
}

async function main() {
  const options: BuildOptions = {
    outdir: "dist",
    minify: true,
    bundle: true,
    sourcemap: true,
    entryPoints: ["src/index.tsx"],
    external: ["fs", "path"],
    loader: {
      ".png": "file",
      ".jpg": "file",
      ".otf": "file",
      ".gz": "file",
    },
    alias,
  };
  if (dev) {
    spawn("pnpm", ["run", "uno", "-w"], { stdio: "inherit" });
    const buildContext = await context(options);
    console.log(await buildContext.serve({ servedir: "dist" }));
  } else {
    spawn("pnpm", ["run", "uno"], { stdio: "inherit" });
    await build(options);
  }
}

main();
