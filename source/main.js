const menuButton = document.querySelector('#menu-button')
const menu = document.querySelector('#menu')

start()

function start() {
  menuButton.classList.remove('header__button--js')
  menu.classList.remove('nav--js')
}

function toggleMenu() {
  menu.classList.toggle('nav--active')
  menuButton.classList.toggle('header__button--active')
}
