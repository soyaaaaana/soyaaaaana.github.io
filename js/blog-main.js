/**
 * 要素にHTML文字列を子要素として追加
 * @param {string} htmlStr 追加する子要素の文字列
 * @param {Element|Node} parentSelector 対象となる親要素
 * @return {Element|Node} 追加した子要素
 */
var appendChild = function(htmlStr, parentSelector) {
  var e;
  if (typeof htmlStr !== "string" || typeof parentSelector !== "string" || document.querySelector(parentSelector).length === 0)
    return;
  e = document.createElement('div');
  e.innerHTML = htmlStr;
  return document.querySelector(parentSelector).appendChild(e.firstChild);
};
/**
* 要素にHTML文字列の親要素に要素として追加
* @param {string} htmlStr 追加する子要素の文字列
* @param {Element|Node} parentSelector 対象となる親要素
* @return {Element|Node} 追加した子要素
*/
var append = function(htmlStr, parentSelector) {
 var e;
 if (typeof htmlStr !== "string" || typeof parentSelector !== "string" || document.querySelector(parentSelector).length === 0)
   return;
 e = document.createElement('div');
 e.innerHTML = htmlStr;
 return document.querySelector(parentSelector).parentNode.appendChild(e.firstChild);
};
append('<div style="text-align:center;"><br><a class="cp_link1 defaultfont changefont" href="javascript:changefont();">サイトの表示にシステムのデフォルトフォントを使用する</a></div>', "div.main");