var path = location.href;
var path2 = window.location.pathname.split("/");
var regex = /index(\.html)?$/;
if (location.protocol!="file:"&&path2[path2.length-1].match(regex))
{
  path = path.replace(regex, "");
  location.href = path;
}