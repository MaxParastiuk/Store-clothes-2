import { Router } from "express";
const router = Router();
import Clothes from "../models/clothes.js";
import auth from "../middleware/auth.js";
import { clothesValidators } from "../utils/valitdators.js";

router.get("/", async (req, res) => {
	try {
		const cloth = await Clothes.find();
		res.render("clothes", {
			title: "Clothes page",
			isClothes: true,
			userId: req.user ? req.user._id.toString() : null,
			cloth,
		});
	} catch (e) {
		console.log(e);
	}
});

router.get("/:id/edit", auth, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect("/");
	}

	try {
		const item = await Clothes.findById(req.params.id);

		if (item.userId.toString() !== req.user._id.toString()) {
			return res.redirect("/clothes");
		}

		res.render("item-edit", {
			title: item.title,
			item,
		});
	} catch (e) {
		console.log(e);
	}
});

router.post("/edit", auth, clothesValidators, async (req, res) => {
	const errors = validationResult(req);
	const { id } = req.body;

	if (!errors.isEmpty()) {
		return res.status(422).redirect(`clothes/${id}/edit?allow=true`);
	}
	try {
		delete req.body.id;
		const item = await Clothes.findById(id);
		if (item.userId.toString() !== req.user._id.toString()) {
			return res.redirect("/clothes");
		}
		Object.assign(item, req.body);
		await Clothes.findByIdAndUpdate(id, req.body);
		res.redirect("/clothes");
	} catch (e) {
		console.log(e);
	}
});

router.post("/remove", auth, async (req, res) => {
	try {
		await Clothes.deleteOne({
			_id: req.body.id,
			userId: req.user._id,
		});
		res.redirect("/clothes");
	} catch (e) {
		console.log(e);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const item = await Clothes.findById(req.params.id);
		console.log(item);
		res.render("item", {
			layout: "empty",
			title: item.title,
			item,
		});
	} catch (e) {
		console.log(e);
	}
});

export default router;
