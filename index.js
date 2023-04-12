import express from "express";
import { join } from "path";
import path from "path";
import { connect } from "mongoose";
import { create } from "express-handlebars";
import { urlencoded } from "express";
import Handlebars from "handlebars";
import helmet from "helmet";
import compression from "compression";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import session from "express-session";
import flash from "connect-flash";
import homeRoutes from "./routes/home.js";
import cartRoutes from "./routes/cart.js";
import addRoutes from "./routes/add.js";
import clothesRoutes from "./routes/clothes.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import csrf from "csurf";
import varMiddleWare from "./middleware/variables.js";
import userMiddleWare from "./middleware/user.js";
import errorHandler from "./middleware/404.js";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import ifeq from "./utils/hbs-helper.js";
import { fileURLToPath } from "url";
import Keys from "./keys/index.js";
import fileMiddleware from "./middleware/file.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MongoStore = connectMongoDBSession(session);
const app = express();

const hbs = create({
	defaultLayout: "main",
	extname: "hbs",
	helpers: { ifeq },
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
	collection: "sessions",
	uri: Keys.MONDGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// app.use(async (req, res, next) => {
// 	try {
// 		const user = await User.findById("641abc0e640c099ad5500177");
// 		req.user = user;
// 		next();
// 	} catch (e) {
// 		console.log(e);
// 	}
// });

app.use(express.static(join(__dirname, "public")));
app.use("/images", express.static(join(__dirname, "images")));
app.use(urlencoded({ extended: true }));
app.use(
	session({
		secret: Keys.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);
app.use(fileMiddleware.single("avatar"));
app.use(csrf());
app.use(flash());
// app.use(helmet({ crossOriginEmbedderPolicy: true }));
app.use(compression());
app.use(varMiddleWare);
app.use(userMiddleWare);

app.use("/", homeRoutes);

app.use("/add", addRoutes);
app.use("/clothes", clothesRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await connect(Keys.MONDGODB_URI, { useNewUrlParser: true });
		app.listen(PORT, () => {
			console.log(`Server is runnig on port ${PORT}`);
		});
		// const candidate = await User.findOne();
		// if (!candidate) {
		// 	const user = new User({
		// 		email: "hello@gmail.com",
		// 		name: "Max",
		// 		cart: { items: [] },
		// 	});
		// 	await user.save();
		// }
	} catch (error) {
		console.log(error);
	}
}

start();
