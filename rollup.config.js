import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
// import resolve from "@rollup/plugin-node-resolve";
import svgr from "@svgr/rollup";
import image from "@rollup/plugin-image";
import url from "@rollup/plugin-url";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import sourcemaps from "rollup-plugin-sourcemaps";
import babel from "@rollup/plugin-babel";
import pkg from "./package.json" assert { type: "json" };

const extensions = [".js", ".ts"];
const config = {
  input: "lib/index.ts",
  output: [
    {
      sourcemap: true,
      file: pkg.main,
      format: "cjs",
    },
    {
      sourcemap: true,
      file: pkg.module,
      format: "esm",
    },
  ],
  plugins: [
    // resolve({ extensions }),
    babel({ exclude: "node_modules/**" }),
    commonjs({ include: "node_modules/**" }),
    typescript({ tsconfig: "./tsconfig.json", clean: true }),
    svgr(),
    image(),
    url(),
    peerDepsExternal(),
    sourcemaps(),
    // del({ targets: ["dist/*"] }),
  ],
};
export default config;
