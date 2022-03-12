const content_li = document.querySelector('.content-li');
const sub_menu = document.querySelector('.content-li .sub-menu');
const study_li = document.querySelector('.study');
const study_sub_menu = document.querySelector('.study .sub-menu');
const arrow = document.querySelector('.content-li .arrow');
const sub_sub_menu = document.querySelector('.content-li .sub-sub-menu');
const books_container = document.querySelector('.books');
const show_more_book = document.querySelector('.show-more-book');

// لعرض الملفات في الصفحة

fetch('/uploadFiles', {
	method: 'get',
	mode: "no-cors"
})
	.then((response) => {
		if (response.status == 200) {
			return response.json();
		} else {
			return response.text();
		}
	})
	.then((data) => {
		data.map((info) => {
			const html = `
					<div class="book">
						<img src="../uploads/${info.fileImg}">
						<a class="details" href="details/${info.id}">عرض التفاصيل</a>
						<h3>${info.fileName}</h3>
						<h5><a href="../uploads/${info.fileSrc}">تحميل</a></h5>
					</div>
					`;
			books_container.insertAdjacentHTML('afterbegin', html);
		});
	})
	.catch((err) => {
		console.log(err);
	});

// احداث خاصة بالقائمة من ظهور واخفاء القائمات المنسدلة
content_li.addEventListener('mouseover', () => {
	sub_menu.style = 'display: block;';
});
content_li.addEventListener('mouseleave', () => {
	sub_menu.style = 'display: none;';
});

arrow.addEventListener('mouseover', () => {
	sub_sub_menu.style = 'display: block;';
});
arrow.addEventListener('mouseleave', () => {
	sub_sub_menu.style = 'display: none;';
});

study_li.addEventListener('mouseover', () => {
	study_sub_menu.style = 'display: block;';
});
study_li.addEventListener('mouseleave', () => {
	study_sub_menu.style = 'display: none;';
});
