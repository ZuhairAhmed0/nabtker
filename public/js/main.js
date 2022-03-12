const username = document.querySelector('#username');
const password = document.querySelector('#password');
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const userData = {username: username.value, password: password.value};
	let myFetch = async () => {
		let response = await fetch('http://localhost:3000/login', {
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
		.then((data) => {
			const objData = JSON.parse(data);
			if (objData.username === username.value && objData.password === password.value) {
				location.href = '/nabtker/dashboard';
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



