function encodeHTML(e){let t=document.createElement("div");t.appendChild(document.createTextNode(e));let n=t.innerHTML;return t.remove(),n}
function decodeHTML(e){let t=document.createElement("div");t.innerHTML=e;let n=t.innerText;return t.remove(),n}
async function show()
{
  progress_start();
  /** @type {string[]} */
  let user_id = [];
  /** @type {string[]} */
  let tweet_id = [];
  /** @type {string[]} */
  let handle = [];
  /** @type {string[]} */
  let name = [];
  /** @type {number[]} */
  let timestamp = [];
  /** @type {string[]} */
  let image = [];
  /** @type {number} */
  let retweet_count = 0;
  
  await fetch(`https://api.twitterpicker.com/tweet/datav3?id=${document.querySelector(".tweet_id").value}`,{mode:"cors"}).then(async response=> {
    /*if (!response.ok) {
      progress_end();
      throw new Error();
    }*/
    //console.log(response.text())
    await response.text().then(data_=>{
      /*resolve(data_ ? JSON.parse(data_) : {}).then(data=>{
        retweet_count = data.retweet_count;
      })*/
      let data = data_ ? JSON.parse(data_) : {}
      retweet_count = data.retweet_count;
      console.log(data)
      console.log(retweet_count)
    });
  }).catch(error=>{
    progress_end();
    console.error('There was a problem with the fetch operation: ', error);
  });
  console.log(retweet_count);
  document.querySelector(".tweet_detail").textContent = `RT数: ${retweet_count}`;
  await fetch(`https://api.twitterpicker.com/tweet/retweets?id=${document.querySelector(".tweet_id").value}`,{mode:"no-cors"}).then(response=>{
    /*if (!response.ok) {
      progress_end();
      throw new Error();
    }*/
    return response.json();
  }).then(data=>{
    resolve(data ? JSON.parse(data) : {})
    for(let i = 0;i<data.length;i++)
    {
      user_id.push(data[i]["user_id"])
      tweet_id.push(data[i]["tweet_id"])
      handle.push(data[i]["handle"])
      name.push(data[i]["name"])
      timestamp.push(data[i]["timestamp"])
      image.push(data[i]["image"])
    }
  }).catch(error=>{
    console.error('There was a problem with the fetch operation: ', error);
    progress_end();
  });
  let html = `<hr>`;
  for (let i = 0;i<user_id.length;i++)
  {
    html += `<div style="display:flex;flex-direction:row"><div style="display:flex;align-items:center;margin-right:1em"><img src="${encodeHTML(image[i].replace("_normal.","."))}" style="width:5em;height:5em;border-radius:50%;"></div><div style="display:flex;flex-direction:column">名前: ${encodeHTML(name[i])}<br>RTした時刻: ${encodeHTML(new Date(timestamp[i]).toLocaleDateString('ja-JP'))} ${encodeHTML(new Date(timestamp[i]).toLocaleTimeString('ja-JP'))}<br>ハンドル: @${encodeHTML(handle[i])}<br>user_id: ${encodeHTML(user_id[i])}<br>RTのURL: <a class="cp_link1" style="word-break:keep-all;overflow-wrap:anywhere;" href="https://x.com/i/status/${encodeHTML(tweet_id[i])}" target="_blank" rel="noopener noreferrer">https://x.com/i/status/${encodeHTML(tweet_id[i])}</a>プロフィール画像: <a class="cp_link1" style="word-break:keep-all;overflow-wrap:anywhere;" href="${encodeHTML(image[i].replace("_normal.","."))}" target="_blank" rel="noopener noreferrer">${encodeHTML(image[i].replace("_normal.","."))}</a></div></div><hr>`
  }
  document.querySelector(".data").innerHTML = html;
  progress_end();
}
function progress_end()
{
  document.querySelector(".progress").setAttribute("style","display:none");
}
function progress_start()
{
  document.querySelector(".progress").setAttribute("style","display:block");
}