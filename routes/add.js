import { Router } from "express";
const router = Router();
import Clothes from "../models/clothes.js";
import auth from "../middleware/auth.js";
import { clothesValidators } from "../utils/valitdators.js";
import { validationResult } from "express-validator";

router.get("/", auth, (req, res) => {
	res.render("add", {
		title: "Add clothes",
		isAdd: true,
	});
	// res.sendFile(path.join(__dirname, "views", "about.html"));
});

router.post("/", auth, clothesValidators, async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render("add", {
			title: "Add clothes",
			isAdd: true,
			error: errors.array()[0].msg,
			data: {
				title: req.body.title,
				price: req.body.price,
				img: req.body.img,
			},
		});
	}

	const clothe = new Clothes({
		title: req.body.title,
		price: req.body.price,
		img: req.body.img,
		userId: req.user,
	});

	try {
		await clothe.save();
		res.redirect("/clothes");
	} catch (e) {
		console.log(e);
	}
});

export default router;
