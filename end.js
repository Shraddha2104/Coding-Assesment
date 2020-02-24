const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

//fetches all historical scores from the local storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
finalScore.innerText = mostRecentScore;

//validation for username and submit button
username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => {
  console.log("clicked the save buton!");
  e.preventDefault();
  //fetch the most recent score from the local storage
  //high scores will be saved in pairs ie Score and Username
  const score = {
    score: mostRecentScore,
    name: username.value
  };
  highScores.push(score);
  // highScores.sort((a, b) => b.score - a.score);
  // highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("highScores.html");

};