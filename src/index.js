import {thing} from "./thing"

console.log("after static import, before dynamic:", thing)

import("./thing")

console.log("after firing dynamic import")