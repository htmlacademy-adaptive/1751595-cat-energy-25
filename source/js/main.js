// navigation
const menuButton = document.querySelector('#menu-button')
const menu = document.querySelector('#menu')

const map = document.querySelector('#map')

if (menuButton && menu) {
  start()
  menuButton.addEventListener('click', toggleMenu)
}

if (map) hideMap()

function start() {
  menuButton.classList.remove('header__button--js')
  menu.classList.remove('nav--js')
}

function toggleMenu() {
  menu.classList.toggle('nav--active')
  menuButton.classList.toggle('header__button--active')
}

// example before-after
const exampleBefore = document.querySelector('#example-before')
const exampleAfter = document.querySelector('#example-after')
const buttonBefore = document.querySelector('#button-before')
const buttonAfter = document.querySelector('#button-after')
const rangeIndicator = document.querySelector('#range-indicator')

if (exampleBefore && exampleAfter && buttonAfter && buttonBefore) {
  buttonBefore.addEventListener('click', showBeforeMobile)
  buttonAfter.addEventListener('click', showAfterMobile)
}

function showBeforeMobile() {
  exampleBefore.classList.add('switcher__image-block--active')
  exampleAfter.classList.remove('switcher__image-block--active')
  rangeIndicator.classList.remove('switcher__range-indicator--after')
  rangeIndicator.classList.add('switcher__range-indicator--before')
}

function showAfterMobile() {
  exampleBefore.classList.remove('switcher__image-block--active')
  exampleAfter.classList.add('switcher__image-block--active')
  rangeIndicator.classList.remove('switcher__range-indicator--before')
  rangeIndicator.classList.add('switcher__range-indicator--after')
}

// map
function hideMap() {
  map.classList.remove('location__map--js')
}
