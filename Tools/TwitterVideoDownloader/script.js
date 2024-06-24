function encodeHTML(e){let t=document.createElement("div");t.appendChild(document.createTextNode(e));let n=t.innerHTML;return t.remove(),n}
function decodeHTML(e){let t=document.createElement("div");t.innerHTML=e;let n=t.innerText;return t.remove(),n}
function progress_start()
{
  document.querySelector(".progress").style.display = "block";
}
function progress_end()
{
  document.querySelector(".progress").style.display = "none";
}
async function search()
{
  progress_start();
  let tweet_id = document.querySelector(".tweet_url").value;
  let tweet_url_regexp = /^((https?:\/\/)?(mobile.)?(twitter|x).com\/[a-z0-9_]+\/status\/(\d+))|^\d+$/i;
  if (!tweet_url_regexp.test(tweet_id))
    throw new Error(`${tweet_id} は有効な文字列ではありませんでした。`);
  tweet_id = tweet_id.match(tweet_url_regexp)[0].replace(/^(https?:\/\/)?(mobile.)?(twitter|x).com\/[a-z0-9_]+\/status\//i,"");
  if (!/\d/.test(tweet_id))
    throw new Error(`${tweet_id} は有効な文字列ではありませんでした。`);
  let image = [];
  let bitrate = {0:[],1:[],2:[],3:[]};
  let video = {0:[],1:[],2:[],3:[]};
  await fetch(`https://script.google.com/macros/s/AKfycbw6N5z0mR6gqmPgLXUE1sxaWJYP9NaWEq2fB1i3MqRUO9JD3KLVA5FgTV1lvN_x69QU/exec?url=${encodeURIComponent("https://cdn.syndication.twimg.com/tweet-result?token=0&lang=ja&id=")}${tweet_id}`).then(response=> {
    if (!response.ok) {
      progress_end();
      throw new Error();
    }
    return response.text();
  }).then(data=>{
    data=data?JSON.parse(data):{};
    if (data["status"] != "200" || data["response_code"] != "200") throw new Error(`レスポンスが200ではありませんでした。\r\nGoogle Apps Script のレスポンスコード: ${data["status"]}, Twitter API のレスポンスコード: ${data["response_code"]}`);
    data = JSON.parse(data["response"]);
    let media = data["mediaDetails"];
    for (let i=0;i<media.length;i++)
    {
      if (media[i]["type"] != "video") continue;
      image.push(media[i]["media_url_https"]);
      let videos = media[i]["video_info"]["variants"];
      for (let l=0;l<videos.length;l++)
      {
        if (videos[l]["content_type"].indexOf("video/") == -1) continue;
        bitrate[i].push(videos[l]["bitrate"]);
        video[i].push(videos[l]["url"]);
      }
    }
    console.log(data);
  }).catch(error=>{
    progress_end();
    console.error('There was a problem with the fetch operation: ', error);
  });
  console.log(bitrate);
  console.log(video);
  let html = `<hr>`;
  for (let i = 0;i<image.length;i++)
  {
    let videos = "";
    for (let l=0;l<bitrate[i].length;l++)
    {
      if (l!=0) videos += "<hr>";
      videos += `ビットレート: ${encodeHTML(bitrate[i][l])}<br>動画のURL: <a class="cp_link1" style="word-break:keep-all;overflow-wrap:anywhere;" target="_blank" rel="noopener noreferrer" href="${encodeHTML(video[i][l])}">${encodeHTML(video[i][l])}</a>`;
    }
    console.log(videos)
    html += `<div style="display:flex;flex-direction:row"><div style="display:flex;align-items:center;margin-right:1em"><img src="${encodeHTML(image[i])}" style="max-width:10em;height:5em"></div><div>${videos}</div></div><hr>`;
  }
  document.querySelector(".data").innerHTML = html;
  progress_end();
}