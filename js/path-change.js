if  (location.protocol!="file:")
{
  var path = location.href;
  var path2 = window.location.pathname.split("/");
  var regex = /index(\.html)?$/;
  var regex2 = /\.html$/;
  var changed = false;
  if (path2[path2.length-1].match(regex))
  {
    path = path.replace(regex, "");
    changed = true;
  }
  if (!location.hostname.match(/^(localhost|127.0.0.1|192.168.\d{1,3}.\d{1,3}|172.168.\d{1,3}.\d{1,3}|172.(1[6-9]|2[0-9]|3[0-1]).\d{1,3}.\d{1,3}|10.\d{1,3}.\d{1,3}.\d{1,3})$/)&&path2[path2.length-1].match(regex2))
  {
    path = path.replace(regex2, "");
    changed = true;
  }
  if (changed)
    location.href = path;
}