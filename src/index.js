import {tryIt} from "./index2"

Promise.resolve(true)
	   .then(() => {
		   tryIt()
		   console.log("works!")
	   })