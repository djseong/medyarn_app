window.onload = function () {
  document.getElementById("answerlink").onclick = function () {
    console.log("link is clicked");
    document.getElementById("showanswer").submit();
    return false;
  }
}
