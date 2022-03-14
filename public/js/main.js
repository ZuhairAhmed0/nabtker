const username = document.querySelector('#username');
const password = document.querySelector('#password');
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const userData = {username: username.value, password: password.value};
	let myFetch = async () => {
		let response = await fetch('/login', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		});
		const users = await response.text();
		return users;
	};
	myFetch()
		.then((result) => {
			const data = JSON.parse(result);
			if (data.info.username === username.value && data.info.password === password.value) {
				location.href = data.redirect;
			}
		})
		.catch((err) => {
			username.style = 'border: 1px solid red';
			password.style = 'border: 1px solid red';
			username.value = '';
			password.value = '';
			document.querySelector('.worng').textContent = 'invalid username or password';
		});
});
