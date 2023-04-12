import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	res.render("index", {
		title: "Main page",
		isMain: true,
	});
});

export default router;
