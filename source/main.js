const menuButton = document.querySelector('#menu-button')
const menu = document.querySelector('#menu')

if (menuButton && menu) {
  start()
  menuButton.addEventListener('click', toggleMenu)
}

function start() {
  menuButton.classList.remove('header__button--js')
  menu.classList.remove('nav--js')
}

function toggleMenu() {
  menu.classList.toggle('nav--active')
  menuButton.classList.toggle('header__button--active')
}
