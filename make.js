import path from "path"
import fs from "fs/promises"
import {constants as fsConstants} from "fs"
import {spawnSync} from 'child_process'
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import nollup from "nollup"

(async function () {
	const bundle = await nollup({
		input: ["src/index.js"],
		plugins: [
			commonjs({
				exclude: ["src/**"],
				ignore: ["crypto"], // remove to break build
				requireReturnsDefault: "preferred",
			}),
			nodeResolve({preferBuiltins: true}),
		],
	})
	console.log("Generating...")
	const result = await bundle.generate({
		sourcemap: false,
		format: "cjs",
		file: "index.cjs"
	})

	try {
		await fs.access("build", fsConstants.F_OK | fsConstants.W_OK)
	} catch (e) {
		console.log("ACCESS? ", e)
		await fs.mkdir("build")
	}

	for (const o of result.output) {
		const filePath = path.join("build", o.fileName)
		await fs.writeFile(filePath, o.code, {flag: 'w'})
	}
	spawnSync("node", ["build/index.cjs"], {
		stdio: 'inherit'
	})
})()