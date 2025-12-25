/* Javascript for the hamburger menu. */
const checkbox = document.querySelector("#toggle-menu");
console.log(checkbox);
const background = document.querySelector("body");
console.log(background);
background.addEventListener("click", hideMenu, false);
const menuIcon = document.querySelector("#menu-icon");
menuIcon.addEventListener("click", showMenu, true);
function hideMenu(e) {
  console.log("hideMenu");
  if (e.target.id !== "toggle-menu") {
    if (checkbox.checked === false) {
      checkbox.checked = true;
    }
  }
  document.body.style.overflow = "auto";
}
function showMenu(e) {
  if (checkbox.checked === true) {
    checkbox.checked = false;
  }
  e.stopPropagation();
  document.body.style.overflow = "hidden";
}
