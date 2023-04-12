const keys = require("../keys");

module.exports = function (email, token) {
	return {
		to: email,
		from: keys.EMAIL_FROM,
		subject: "Password recovery",
		html: `
        <h1>Have you forgotten your password?</h1>
        <p>If not, ignore this message</p>
        <p>Otherwise click on the link below:</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">reset password</a></p>
        <hr/>
        <a href="${keys.BASE_URL}">Store</a>
        `,
	};
};
