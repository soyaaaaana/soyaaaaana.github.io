function isIe() {
  var userAgent = navigator.userAgent;
  if (document.documentMode == 11)
    return true;
  return userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1;
}
if (isIe())
{
  alert("このサイトは、Internet Explorerをサポートしていません。最新のブラウザーを使用してください。");
  history.back();
}
if (isIe())
  window.close();
if (isIe())
  location.href="https://www.msn.com/";  