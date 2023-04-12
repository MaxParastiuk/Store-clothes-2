import { Router } from "express";
import Clothes from "../models/clothes.js";
import auth from "../middleware/auth.js";
const router = Router();

function mapCart(cart) {
	return cart.items.map((el) => ({
		...el.clotheId._doc,
		id: el.clotheId.id,
		count: el.count,
	}));
}

function computePrice(clothes) {
	return clothes.reduce((total, clothe) => {
		return (total += clothe.price * clothe.count);
	}, 0);
}

router.post("/add", auth, async (req, res) => {
	const cloth = await Clothes.findById(req.body.id);
	await req.user.addToCart(cloth);
	res.redirect("/cart");
});

router.delete("/remove/:id", auth, async (req, res) => {
	await req.user.removeFromCart(req.params.id);

	const user = await req.user.populate("cart.items.clotheId");

	const clothes = mapCart(user.cart);

	const cart = {
		clothes,
		price: computePrice(clothes),
	};

	res.status(200).json(cart);
});

router.get("/", auth, async (req, res) => {
	const user = await req.user.populate("cart.items.clotheId");

	const clothes = mapCart(user.cart);

	res.render("cart", {
		title: "cart",
		isCart: true,
		clothes: clothes,
		price: computePrice(clothes),
	});
});

router.post("/app", async (req, res) => {});

export default router;
