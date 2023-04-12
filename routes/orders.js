import { Router } from "express";
import Order from "../models/order.js";

import auth from "../middleware/auth.js";

const router = Router();

router.get("/", auth, async (req, res) => {
	try {
		const orders = await Order.find({
			"user.userId": req.user._id,
		}).populate("user.userId");

		res.render("orders", {
			isOrder: true,
			title: "Orders",
			orders: orders.map((el) => {
				return {
					...el._doc,
					price: el.clothes.reduce((total, c) => {
						return (total += c.count * c.clothes.price);
					}, 0),
				};
			}),
		});
	} catch (e) {
		console.log(e);
	}
});

router.post("/", auth, async (req, res) => {
	const user = await req.user.populate("cart.items.clotheId");

	const clothes = user.cart.items.map((el) => ({
		count: el.count,
		clothes: { ...el.clotheId._doc },
	}));

	const order = new Order({
		user: {
			name: req.user.name,
			userId: req.user,
		},
		clothes: clothes,
	});

	await order.save();
	await req.user.clearCart();

	res.redirect("/orders");
});

export default router;
