import path from "path"
import nollup from 'nollup'
import fs from "fs/promises"
import {constants as fsConstants} from "fs"
import {fork} from "child_process"
import nodeResolve from "@rollup/plugin-node-resolve"
import json from "@rollup/plugin-json"
import commonjs from "@rollup/plugin-commonjs"

await fs.rm("build", {recursive: true, force: true})

const bundle = await nollup({
	input: [
		"index.js",
	],
	plugins: [
		json(),
		nodeResolve(),
		commonjs({
			requireReturnsDefault: "preferred",
			ignoreDynamicRequires: true,
		}),
	],
})
console.log("Generating...")
const result = await bundle.generate({sourcemap: false, format: "esm"})

try {
	await fs.access("build", fsConstants.F_OK | fsConstants.W_OK)
} catch (e) {
	await fs.mkdir("build")
}

for (const o of result.output) {
	const filePath = path.join("build", o.fileName)
	await fs.writeFile(filePath, o.code, {flag: 'w'})
}

console.log("Running...")
fork("build/index.js")