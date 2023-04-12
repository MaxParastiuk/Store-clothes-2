const keys = require("../keys");

module.exports = function (email) {
	return {
		to: email,
		from: keys.EMAIL_FROM,
		subject: "registration",
		html: `
        <h1>You are welcome</h1>
        <p>You have successfully registered ${email}</p>
        <hr/>
        <a href="${keys.BASE_URL}">Store</a>
        `,
	};
};
