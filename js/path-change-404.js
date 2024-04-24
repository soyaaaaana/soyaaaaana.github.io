var changed = false;
var path = location.href;
if (path.slice(-1) == '/')
{
  path = path.replace(/[\/]+$/, "");
  changed = true;
}
var path2 = window.location.pathname.split("/");
if (path2[path2.length-1] == "index")
{
  path = path.replace(/index$/, "");
  changed = true;
}
if (changed)
  location.href = path;