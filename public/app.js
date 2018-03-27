const $footerYear = document.querySelector('.footer .year');
const $actionAddLibrary = document.querySelector('.action-add-library');
const $signup = document.querySelector('.signup');


$footerYear.innerText = (new Date()).getFullYear();
$actionAddLibrary.addEventListener('click', () => ($signup.style.height = 'auto'));