/* Javascript for the hamburger menu. */
const background = document.querySelector("body");
background.addEventListener("click", hideMenu, false);
const menuIcon = document.querySelector("#menu-icon");
const menu = document.querySelector("nav");
menuIcon.addEventListener("click", showMenu, true);

function showMenu(e) {
  const menuVisible = !menu.classList.contains("hide-menu");
  if (!menuVisible) {
    // document.body.style.overflow = "auto";
    menu.classList.remove("hide-menu");
  }
  e.stopPropagation();
}

function hideMenu(e) {
  const menuVisible = !menu.classList.contains("hide-menu");
  if (menuVisible) {
    // document.body.style.overflow = "auto";
    menu.classList.add("hide-menu");
  }
  e.stopPropagation();
}
