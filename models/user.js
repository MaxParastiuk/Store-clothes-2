import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		name: String,
		password: {
			type: String,
			required: true,
		},
		avatarUrl: String,
		resetToken: String,
		resetTokenExp: Date,
		cart: {
			items: [
				{
					count: {
						type: Number,
						required: true,
						default: 1,
					},
					clotheId: {
						type: Schema.Types.ObjectId,
						ref: "Clothes",
						required: true,
					},
				},
			],
		},
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

userSchema.methods.addToCart = function (clothe) {
	const cloneItem = [...this.cart.items];
	const idx = cloneItem.findIndex((el) => {
		return el.clotheId.toString() === clothe._id.toString();
	});
	if (idx >= 0) {
		cloneItem[idx].count = cloneItem[idx].count + 1;
	} else {
		cloneItem.push({
			clotheId: clothe._id,
			count: 1,
		});
	}

	// const newCart = { cart: cloneItem };
	// this.cart = newCart;

	this.cart = { items: cloneItem };
	return this.save();
};

userSchema.methods.removeFromCart = function (id) {
	let cloneItem = [...this.cart.items];

	const idx = cloneItem.findIndex((el) => {
		return el.clotheId.toString() === id.toString();
	});

	if (cloneItem[idx].count === 1) {
		cloneItem = cloneItem.filter(
			(el) => el.clotheId.toString() !== id.toString()
		);
	} else {
		cloneItem[idx].count = cloneItem[idx].count - 1;
	}

	this.cart = { items: cloneItem };
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

export default model("User", userSchema);
