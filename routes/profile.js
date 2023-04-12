import { Router } from "express";
import auth from "../middleware/auth.js";
import User from "../models/user.js";

const router = Router();

router.get("/", auth, async (req, res) => {
	res.render("profile", {
		title: "Profile",
		isProfile: true,
		user: req.user.toObject(),
	});
});

router.post("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		const toChange = {
			name: req.body.name,
		};

		console.log(req.file);

		if (req.file) {
			toChange.avatarUrl = req.file.path;
		}

		Object.assign(user, toChange);
		await user.save();
		res.redirect("/profile");
	} catch (e) {
		console.log(e);
	}
});

export default router;
