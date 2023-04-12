import { Router } from "express";

import User from "../models/user.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { registerValidators } from "../utils/valitdators.js";
import sendgrid from "nodemailer-sendgrid-transport";
import Keys from "../keys/index.js";
// import regEmail from "../emails/registration";
// import resetEmail from "../emails/reset";

const router = Router();
const transporter = createTransport(
	sendgrid({
		auth: {
			api_key: Keys.SENDGRID_API_KEY,
		},
	})
);

router.get("/login", async (req, res) => {
	res.render("auth/login", {
		title: "Login",
		isLogin: true,
		loginError: req.flash("loginError"),
		registerError: req.flash("registerError"),
	});
});

router.get("/logout", async (req, res) => {
	req.session.destroy(() => {
		res.redirect("/auth/login#login");
	});
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const candidate = await User.findOne({ email });

		if (candidate) {
			const isSame = bcrypt.compare(password, candidate.password);

			if (isSame) {
				req.session.user = candidate;
				req.session.isAuthenticated = true;
				req.session.save((err) => {
					if (err) {
						throw err;
					}
					res.redirect("/");
				});
			} else {
				req.flash("loginError", "incorrect password");
				res.redirect("/auth/login#login");
			}
		} else {
			req.flash("loginError", "There is no such user");
			res.redirect("/auth/login#login");
		}
	} catch (e) {
		console.log(e);
	}
});

router.post("/register", registerValidators, async (req, res) => {
	try {
		const { email, password, name } = req.body;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("registerError", errors.array()[0].msg);
			return res.status(422).redirect("login#register");
		}

		const hashPassword = await bcrypt.hash(password, 10);
		const user = new User({
			email,
			name,
			password: hashPassword,
			cart: { items: [] },
		});
		await user.save();
		// need authentication email adress
		// await transporter.sendMail(regEmail(email));
		res.redirect("/auth/login#login");
	} catch (e) {
		console.log(e);
	}
});

router.get("/reset", (req, res) => {
	res.render("auth/reset", {
		title: "forget password?",
		error: req.flash("error"),
	});
});

router.get("/password/:token", async (req, res) => {
	if (!req.params.token) {
		req.redirect("/auth/login");
	}
	try {
		const user = await User.findOne({
			resetToken: req.params.token,
			resetTokenExp: { $gt: Date.now() },
		});

		if (!user) {
			res.redirect("/auth/login");
		} else {
			res.render("auth/password", {
				title: "New password",
				error: req.flash("error"),
				userId: user._id.toString(),
				token: req.params.token,
			});
		}
	} catch (e) {
		console.log(e);
	}
});

router.post("/reset", (req, res) => {
	try {
		crypto.randomBytes(32, async (err, buffre) => {
			if (err) {
				req.flash("error", "somthing went wrong...");
				return res.redirect("/auth/reset");
			}
			const token = buffer.toString("hex");

			const candidate = await User.findOne({ email: req.body.email });

			if (candidate) {
				candidate.resetToken = token;
				candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
				await candidate.save();
				// Send mail for reset password
				// await transporter.sendMail(resetEmail(candidate.email, token))
				res.redirect("/auth/login");
			} else {
				req.flash("error", "there is no such user");
				return res.redirect("/auth/reset");
			}
		});
	} catch (e) {
		console.log(e);
	}
});

router.post("/password", async (req, res) => {
	try {
		const user = await User.findOne({
			_id: req.body.userId,
			resetToken: req.body.token,
			resetTokenExp: { $gt: Data.now() },
		});

		if (user) {
			user.password = crypto.hash(req.body.password, 10);
			user.resetToken = undefined;
			user.resetTokenExp = undefined;
			await user.save();
			res.redirect("/auth/login");
		} else {
			res.redirect("/auth/login");
		}
	} catch (e) {
		console.log(e);
	}
});

export default router;
