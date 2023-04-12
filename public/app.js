const toCurrency = (price) => {
	return new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	}).format(price);
};

const dateFromat = (date) => {
	return new Intl.DateTimeFormat("en-Us", {
		day: "2-digit",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		month: "2-digit",
		second: "2-digit",
	}).format(new Date(date));
};

document.querySelectorAll(".price").forEach((node) => {
	node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll(".date").forEach((node) => {
	node.textContent = dateFromat(node.textContent);
});

const $cart = document.querySelector("#cart");
if ($cart) {
	$cart.addEventListener("click", (e) => {
		if (e.target.classList.contains("js-remove")) {
			const id = e.target.dataset.id;
			const csrf = e.target.dataset.csrf;

			fetch("/cart/remove/" + id, {
				method: "delete",
				headers: {
					"X-XSRF-TOKEN": csrf,
				},
			})
				.then((res) => res.json())
				.then((cart) => {
					if (cart.clothes.length) {
						const html = cart.clothes
							.map((el) => {
								return `
						
									<tr>
										<td>${el.title}</td>
										<td>${el.count}</td>
										<td>
											<button
												class="btn btn-small js-remove"
												data-id="${el.id}"
											>Delete</button>
										</td>
									</tr>
								`;
							})
							.join();
						$cart.querySelector("tbody").innerHTML = html;
						$cart.querySelector(".price").textContent = toCurrency(cart.price);
					} else {
						$cart.innerHTML = "<p>Cart is empty!</p>";
					}
				});
		}
	});
}

var instance = M.Tabs.init(document.querySelectorAll(".tabs"));
