window.addEventListener('DOMContentLoaded', function(){
  let params = new URL(location.href).searchParams;
  if (params.has("icon"))
    decodeURIComponent(document.querySelector(".icon_url").value=params.get("icon"));
  if (params.has("text"))
    decodeURIComponent(document.querySelector(".content").value=params.get("text"));
  if (params.has("name"))
    decodeURIComponent(document.querySelector(".name").value=params.get("name"));
  if (params.has("id"))
    decodeURIComponent(document.querySelector(".id").value=params.get("id"));
  if (params.has("debug")&&params.get("debug")=="true")
    document.querySelector(".debug").checked=true;
  document.getElementsByClassName("generated_image")[0].addEventListener('load', (e)=> {
    progress_end();
  });
  document.getElementsByClassName("generated_image")[0].addEventListener('error', (e)=> {
    progress_end();
    document.getElementsByClassName("error")[0].style.display = "block";
  });
  document.querySelectorAll(".icon_url,.content,.name,.id,.debug").forEach(e=>{
    e.addEventListener("input", (v) => {
      update();
    });
  })
  let dialog = document.querySelector(".tweetid_input_dialog");
  dialog.addEventListener('click', function (event) {
    if (!event.target.closest('.tweetid_input_dialog .inner')) {
      dialog.close();
    }
    else if (event.target == dialog.querySelector(".cancel")) dialog.close("cancel")
    else if (event.target == dialog.querySelector(".ok")) dialog.close("ok")
  });
  dialog.addEventListener("close",async(e) => {
    if (dialog.returnValue == "ok")
      get_tweet();
    //document.documentElement.style.overflow = "initial";
    dialog.style.pointerEvents = "none";
    const waitDialogAnimation = (dialog) => Promise.allSettled(
      Array.from(dialog.getAnimations()).map(animation => animation.finished)
    );
    await waitDialogAnimation(e.target)
  });
});
function generate()
{
  document.getElementsByClassName("error")[0].style.display = "none";
  progress_start();
  let makeitaquote_url = "https://informalmakeitaquote.glitch.me/?";
  let icon = encodeURIComponent(document.querySelector(".icon_url").value);
  let content = encodeURIComponent(document.querySelector(".content").value);
  let name = encodeURIComponent(document.querySelector(".name").value);
  let id = encodeURIComponent(document.querySelector(".id").value);
  if(icon.length!=0)
    makeitaquote_url += `icon=${icon}&`;
  if(content.length!=0)
    makeitaquote_url += `text=${content}&`;
  else
    makeitaquote_url += `text=%20&`;
  if(name.length!=0)
    makeitaquote_url += `name=- ${name}&`;
  else
    makeitaquote_url += `name=%20&`;
  if(id.length!=0&&id.substring(0,3)!="%40")id="%40"+id;
  if(id.length!=0)
    makeitaquote_url += `id=${id}&`;
  else
    makeitaquote_url += `id=%20&`;
  if(document.querySelector(".debug").checked)makeitaquote_url+="debug=2&"
  if(makeitaquote_url.substring(makeitaquote_url.length-1)=="&"||makeitaquote_url.substring(makeitaquote_url.length-1)=="?")makeitaquote_url=makeitaquote_url.substring(0,makeitaquote_url.length-1)
  document.querySelector(".generated_image").setAttribute("src", makeitaquote_url);
}
function copy_url()
{
  var area = document.createElement("textarea");
  area.textContent = url_params().href;
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
  alert("コピーしました！");
}
function url_params()
{
  let url = new URL(`${location.origin+location.pathname}`);
  let icon = document.querySelector(".icon_url").value;
  let text = document.querySelector(".content").value;
  let name = document.querySelector(".name").value;
  let id = document.querySelector(".id").value;
  if(icon.length!=0)
    url.searchParams.set("icon",icon);
  if(text.length!=0)
    url.searchParams.set("text",text);
  if(name.length!=0)
    url.searchParams.set("name",name);
  if(id.length!=0)
    url.searchParams.set("id",id);
  if(document.querySelector(".debug").checked==true)url.searchParams.set("debug","true");
  return url;
}
function progress_end()
{
  document.getElementsByClassName("img_load")[0].setAttribute("style","display:none");
}
function progress_start()
{
  document.getElementsByClassName("img_load")[0].setAttribute("style","display:block");
}
function image_reload()
{
  progress_start()
  let e=document.querySelector(".generated_image")
  let s=e.src
  if(s){e.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";e.src=s}else{e.removeAttribute("src");progress_end()}
}
function dialog_open()
{
  //document.documentElement.style.overflow = "hidden";
  let dialog = document.querySelector(".tweetid_input_dialog");
  dialog.style.pointerEvents = "auto";
  dialog.style.display = "block";
  dialog.showModal();
}
async function get_tweet()
{
  document.querySelector(".progress").style.display = "block";
  let text = "";
  let name = "";
  let id = "";
  let profile_image = "";
  let tweet_id = document.querySelector(".tweet_id_input").value;
  if (!/^((https?:\/\/)?(mobile.)?(twitter|x).com\/[a-z0-9_]+\/status\/(\d+))|^\d+$/i.test(tweet_id))
    return error();
  tweet_id = tweet_id.replace(/^(https?:\/\/)?(mobile.)?(twitter|x).com\/[a-z0-9_]+\/status\//,"")
  if (!/\d/.test(tweet_id))
    return error();
  await fetch(`https://script.google.com/macros/s/AKfycbw6N5z0mR6gqmPgLXUE1sxaWJYP9NaWEq2fB1i3MqRUO9JD3KLVA5FgTV1lvN_x69QU/exec?url=${encodeURIComponent("https://cdn.syndication.twimg.com/tweet-result?token=0&lang=ja&id=")}${tweet_id}`).then(response=> {
    if (!response.ok) {
      progress_end();
      throw new Error();
    }
    return response.text();
  }).then(data=>{
    data=data?JSON.parse(data):{};
    data = JSON.parse(data["response"]);
    text = data["text"];
    name = data["user"]["name"];
    id = data["user"]["screen_name"];
    profile_image = data["user"]["profile_image_url_https"].replace(/_(normal|bigger|x96)\.(jpg|png)/,".$2");
    console.log(data);
  }).catch(error=>{
    progress_end();
    console.error('There was a problem with the fetch operation: ', error);
  });
  document.querySelector(".progress").style.display = "none";
  //document.querySelector(".content").value = text.replace(/https?:\/\/t.co\/[a-z0-9]*/gi,async function(s){await get_t_co_url(s)});
  text = decodeHTML(await replaceAsync(text,/https?:\/\/t.co\/[a-z0-9]*/gi,async(match,name)=>{return await get_t_co_url(match)}))
  document.querySelector(".content").value = text;
  document.querySelector(".name").value = name;
  document.querySelector(".id").value = id;
  document.querySelector(".icon_url").value = profile_image;
  update();
}
function error()
{
  alert("予期せぬエラーが発生しました。");
  document.querySelector(".progress").style.display = "none";
}
function update(){history.replaceState({},"",`${location.origin}${location.pathname}${url_params().search}`)}
async function get_t_co_url(t_co)
{
  console.log("t.co: "+t_co)
  let url = "";
  await fetch(t_co).then(response=> {
    if (!response.ok) throw new Error();
    return response.text();
  }).then(data=>{
    url = data.match(/(?<=<title>).+(?=<\/title>)/i)[0];
  }).catch(error=>{
    console.error('There was a problem with the fetch operation: ', error);
  });
  return url;
}
/**
 * @param {string} string
 * @param {RegExp} searchValue
 * @param {Function} replacer
 */
function replaceAsync(string, searchValue, replacer) {
  try {
    if (typeof replacer === "function") {
      var values = [];
      String.prototype.replace.call(string, searchValue, function () {
        values.push(replacer.apply(undefined, arguments));
        return "";
      });
      return Promise.all(values).then(function (resolvedValues) {
        return String.prototype.replace.call(string, searchValue, function () {
          return resolvedValues.shift();
        });
      });
    } else {
      return Promise.resolve(
        String.prototype.replace.call(string, searchValue, replacer)
      );
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
function reset()
{
  document.querySelector(".content").value = "";
  document.querySelector(".name").value = "";
  document.querySelector(".id").value = "";
  document.querySelector(".icon_url").value = "";
}
function encodeHTML(e){let t=document.createElement("div");t.appendChild(document.createTextNode(e));let n=t.innerHTML;return t.remove(),n}function decodeHTML(e){let t=document.createElement("div");t.innerHTML=e;let n=t.innerText;return t.remove(),n}
