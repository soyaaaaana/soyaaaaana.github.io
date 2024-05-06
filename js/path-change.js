if  (location.protocol!="file:")
{
  var path = location.href;
  var path2 = window.location.pathname.split("/");
  var regex = /index(\.html)?$/;
  var regex2 = /(\.html)?$/;
  var changed = false;
  if (path2[path2.length-1].match(regex))
  {
    path = path.replace(regex, "");
    changed = true;
  }
  if (path2[path2.length-1].match(regex2))
  {
    path = path.replace(regex2, "");
    changed = true;
  }
  if (changed)
    location.href = path;
}