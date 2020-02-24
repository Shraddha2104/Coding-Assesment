highScoresList = document.getElementById("highScoresList");
//fetches all historical scores from the local storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
//called from highscores.html to save in pairs --username and password
highScoresList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");