import { Schema, model } from "mongoose";

const clothes = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	img: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

clothes.method("toClient", function () {
	const clothes = this.toObject();

	clothes.id = clothes._id;
	delete clothes._id;

	return clothes;
});

export default model("Clothes", clothes);
