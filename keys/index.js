import keysProd from "./keys.prod.js";
import KeysDev from "./keys.dev.js";

let Keys;

if (process.env.NODE_ENV === "production") {
	// console.log(keysProd);
	Keys = keysProd;
} else {
	Keys = KeysDev;
}

export default Keys;
