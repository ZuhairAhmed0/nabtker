const addmin_container = document.querySelector('.admin-info');
const submitFile = document.querySelector('.submitFile');
const submitEditFile = document.querySelector('#submitEdit');
const eidtFile = document.querySelector('#form-edit-file');
const files_container = document.querySelector('.file-info');
const formUploading = document.querySelector('.upload-file');
const eidtFileInput = document.querySelectorAll('.edit-file input');
const editAdminInfo = document.querySelector('.edit-admin form');
const fullname = document.querySelector('.edit-admin #name');
const username = document.querySelector('.edit-admin #username');
const email = document.querySelector('.edit-admin #email');
const password = document.querySelector('.edit-admin #password');
let id = 1;

// لعرض جميع الادمن في الصفحة
fetch('/allAdmin', {
	method: 'get',
})
	.then((response) => {
		if (response.status == 200) {
			return response.json();
		} else {
			return response.text();
		}
	})
	.then((data) => {
		const html = data.map(
			(info) => `<section>
         <div class="head">
         <a href="#"><img src="../img/userm.jpg"></a>
         </div>
         <div class="edit">
            <h4> ${info.name}</h4>
            <h4><span><a href="mailto:${info.email}">${info.email}</a></span></h4>
            <br>
            <a class="btn-del" data-doc=${info.id}>حذف</a>
            <a class="btn-add" data-doc=${info.id}>تعديل</a>
            <br>
         </div>
      </section>`,
		);
		addmin_container.insertAdjacentHTML('afterbegin', html);
	})
	.catch((err) => {
		console.log(err);
	});

addmin_container.addEventListener('click', (event) => {
	// لحذف ادمن من الصفحة وقاعدة البيانات
	if (event.target.className === 'btn-del') {
		const userData = event.target.dataset.doc;
		let myFetch = async () => {
			let response = await fetch(`/DeleteAdmin/${userData}`, {
				method: 'DELETE',
			});
			const users = await response.text();
			return users;
		};
		myFetch()
			.then((data) => {
				const objData = JSON.parse(data);
				if (objData.id != 1) {
					event.target.parentElement.parentElement.remove();
					alert(objData.msg);
				}
				alert(objData.msg);
			})
			.catch((err) => {
				alert('Something Wrong');
			});
	}
	if (event.target.className === 'btn-add') {
		// للوصول الي ادمن معين لتعديل البيانات
		id = event.target.dataset.doc;
		editAdminInfo.parentElement.style = 'opacity: 1; z-index: 99;';
	}
});

// لتعديل بيانات الادمن في الصفحة وقاعدة البيانات
editAdminInfo.addEventListener('submit', (event) => {
	event.preventDefault();
	const userData = {
		name: fullname.value,
		username: username.value,
		email: email.value,
		password: password.value,
	};
	let myFetch = async () => {
		let response = await fetch(`/editAdminInfo/${id}`, {
			method: 'PUT',
			// mode: 'cors',
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
			alert(data);
			document.querySelectorAll('form input').forEach((input) => (input.value = ''));
		})
		.catch((err) => {
			alert('Something Wrong');
		});
});

// لعرض جميع الملفات في الصفحة
fetch('/uploadFiles', {
	method: 'get',
})
	.then((response) => {
		if (response.status == 200) {
			return response.json();
		} else {
			return response.text();
		}
	})
	.then((data) => {
		const html = data.map(
			(info) => `<section>
		<div class="head">
		<a href="#"><img src="../uploads/${info.fileImg}" ></a>
		<a class="details" href="/details/${info.id}">عرض التفاصيل</a>
		</div>
		<div class="edit">
			<h2> <span>${info.fileName}</span></h2>
			<h3><span><a href="../uploads/${info.fileSrc}">تحميل</a></span></h3>
			<a class="btn-del" data-doc=${info.id}>حذف</a>
			<a class="btn-add" data-doc="${info.id}">تعديل</a>
			<br>
		</div>
	</section>`,
		);
		files_container.insertAdjacentHTML('afterbegin', html);
	})
	.catch((err) => {
		console.log(err);
	});

files_container.addEventListener('click', (event) => {
	// لحذف ملف من الصفحة وقاعدة البيانات
	if (event.target.className === 'btn-del') {
		const userData = event.target.dataset.doc;
		let myFetch = async () => {
			let response = await fetch(`/DeleteFiles/${userData}`, {
				method: 'DELETE',
			});
			const files = await response.text();
			return files;
		};
		myFetch()
			.then((data) => {
				event.target.parentElement.parentElement.remove();
				alert(data);
			})
			.catch((err) => {
				alert('Something Wrong');
			});
	}
	if (event.target.className === 'btn-add') {
		// للوصول الي ملف معين لتعديل البيانات
		eidtFile.parentElement.style = 'opacity: 1; z-index: 99;';
		eidtFile.action = `editFiles/${event.target.dataset.doc}`;
	}
});

