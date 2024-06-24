function encodeHTML(e){let t=document.createElement("div");t.appendChild(document.createTextNode(e));let n=t.innerHTML;return t.remove(),n}
function decodeHTML(e){let t=document.createElement("div");t.innerHTML=e;let n=t.innerText;return t.remove(),n}
function insertString(targetString, startIndex, insertString) {return targetString.slice(0,startIndex)+insertString+targetString.slice(startIndex)}
//function insertString(e,t,r){return e.slice(0,t)+r+e.slice(t)}
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
  {
    let message = `${tweet_id} は有効な文字列ではありませんでした。`
    output(message)
    throw new Error(message);
  }
  tweet_id = tweet_id.match(tweet_url_regexp)[0].replace(/^(https?:\/\/)?(mobile.)?(twitter|x).com\/[a-z0-9_]+\/status\//i,"");
  if (!/\d/.test(tweet_id))
  {
    let message = `${tweet_id} は有効な文字列ではありませんでした。`
    output(message)
    throw new Error(message);
  }
  let image = [];
  let bitrate = {0:[],1:[],2:[],3:[]};
  let video = {0:[],1:[],2:[],3:[]};
  let video_type = "";
  let error = false;
  let error_message_html = "";
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
    if (data["__typename"] == "TweetTombstone")
    {
      error = true;
      let text_data = data["tombstone"]["text"];
      let entities = text_data["entities"];
      error_message_html = encodeHTML(text_data["text"]);
      let length_plus = 0;
      for (let i=0;i<entities.length;i++)
      {
        let a_tag_start = `<a class="cp_link1" style="word-break:keep-all;overflow-wrap:anywhere;" target="_blank" rel="noopener noreferrer" href="${encodeHTML(entities[i]["ref"]["url"])}">`;
        let a_tag_end = "</a>"
        error_message_html = insertString(error_message_html,entities[i]["from_index"]+length_plus,a_tag_start);
        length_plus += a_tag_start.length;
        error_message_html = insertString(error_message_html,entities[i]["to_index"]+length_plus,a_tag_end);
        length_plus += a_tag_end.length;
      }
      return;
    }
    if (data["__typename"] != "Tweet") return error = true;
    let media = data["mediaDetails"];
    for (let i=0;i<media.length;i++)
    {
      video_type = media[i]["type"];
      if (video_type != "video" && video_type != "animated_gif") continue;
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
    output(error);
  });
  let html = "";
  if (error)
  {
    html = error_message_html;
  }
  else
  {
    console.log(bitrate);
    console.log(video);
    if (image.length != 0)
    {
      html = `<hr>`;
      for (let i = 0;i<image.length;i++)
      {
        let videos = "";
        for (let l=0;l<bitrate[i].length;l++)
        {
          if (l!=0) videos += "<hr>";
          videos += `ビットレート: ${encodeHTML(bitrate[i][l])} bps<br>動画のURL: <a class="cp_link1" style="word-break:keep-all;overflow-wrap:anywhere;" target="_blank" rel="noopener noreferrer" href="${encodeHTML(video[i][l])}">${encodeHTML(video[i][l])}</a><br>動画タイプ: ${encodeHTML(video_type)}`;
        }
        console.log(videos)
        html += `<div style="display:flex;flex-direction:row"><div style="display:flex;align-items:center;margin-right:1em"><img src="${encodeHTML(image[i])}" style="max-width:10em;height:5em"></div><div>${videos}</div></div><hr>`;
      }
    }
    else
    {
      html = "ツイートに動画が存在しませんでした。";
    }
  }
  output(html)
}
function output(s)
{
  document.querySelector(".data").innerHTML = s;
  progress_end();
}