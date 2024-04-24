var params = new URL(window.location.href).searchParams;
window.onload = function () {
if (params.has("font"))
  if (params.get("font").toLowerCase() == "system")
  {
    ChangeToSystemFont();
    return;
  }
if (localStorage.getItem("font")?.toLowerCase() == "system")
  ChangeToSystemFont();
};
document.fonts.ready.then(function(fontFaceSet) {
  console.info({fontFaceSet});
  document.getElementsByClassName("main")[0].style.visibility="visible";
  document.getElementsByClassName("font_loading")[0].style.display="none";
});
function changefont()
{
  if (localStorage.getItem("font") == null)
    localStorage.setItem("font", "system");
  else
    localStorage.removeItem("font");
  location.href = location.origin + location.pathname;
}
function ChangeToSystemFont()
{
  document.getElementsByTagName("body")[0].classList.add("defaultfont");
  document.getElementsByClassName("changefont")[0].innerText = "サイトの表示にウェブフォントを使用する";
}