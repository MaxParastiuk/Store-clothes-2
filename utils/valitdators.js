import { body } from "express-validator";
import User from "../models/user.js";

export const registerValidators = [
	body("email")
		.isEmail()
		.withMessage("Enter a valid email")
		.custom(async (value, { req }) => {
			try {
				const user = await User.findOne({ email: value });
				if (user) {
					return Promise.reject("email is already in use ");
				}
			} catch (e) {
				console.log(e);
			}
		})
		.normalizeEmail(),
	body("password", "Password must be at least 6 characters long")
		.isLength({ min: 6, max: 56 })
		.isAlphanumeric()
		.trim(),
	body("confrim").custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Passwords do not match");
		}
		return true;
	}),
	body("name")
		.isLength({ min: 3 })
		.withMessage("The name must be at least 3 characters long")
		.trim(),
];

export const clothesValidators = [
	body("title")
		.isLength({ min: 3, max: 50 })
		.withMessage("The name must be at least 3 characters long")
		.trim(),
	body("price").isNumeric().withMessage("Enter the correct price"),
	body("img", "Enter the correct URL").isURL(),
];
