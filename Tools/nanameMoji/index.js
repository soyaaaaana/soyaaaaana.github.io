window.addEventListener('DOMContentLoaded', function(){
  document.querySelector(".generate").addEventListener("click", function(){
    let index = 0;
    let text = document.querySelector("#nanameInput").value;
    let result = "";/*
    for (let i = 0; i < Math.ceil(text.length/10); i++)
    {
      if (text.length != index)
      {
        if (i != 0)
          result += "\r\n"
        result += text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　" + text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　　" + text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　　　" + text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　　　　" + text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　　　　　" + text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　　　　" + text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　　　" + text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　　" + text[index]
        index++
      }
      if (text.length != index)
      {
        result += "\r\n　" + text[index]
        index++
      }
    }*/
function formatText(text) {
  const lineLength = 10;
  const indentChars = "　";
  let result = "";
  let index = 0;

  const indentLevels = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];

  for (let i = 0; i < Math.ceil(text.length / lineLength); i++) {

    for (let j = 0; j < lineLength && index < text.length; j++) {
      result += "\r\n" + indentChars.repeat(indentLevels[j]) + text[index++];
    }
  }

  return result.substring(2);
}
result = formatText(text);
    document.querySelector(".result").textContent = result;
  });
});
