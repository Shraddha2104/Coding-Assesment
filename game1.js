const question = document.getElementById("question");
dynamic_choice=document.getElementById("dynamic_choice");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("loadData.php")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        selected_category=window.location.search.substring(10,window.location.search.length);

        questions = loadedQuestions.map(loadedQuestion => {

            const formattedQuestion = {
                question: loadedQuestion.question_text,
                category: loadedQuestion.category
            };
            correct_ans=""
            incorrect_ans=[]
            for(i=0;i<loadedQuestion.answers.length;i++){
                if(loadedQuestion.answers[i].id==loadedQuestion.correct_answer_id){
                    correct_ans=loadedQuestion.answers[i].answer_text;
                }
                else{
                    incorrect_ans.push(loadedQuestion.answers[i].answer_text);
                }
            }
            const answerChoices = [...incorrect_ans];
            //answer sequence is also shuffled so that user doesnt remembers the sequence if he takes the quiz again
            formattedQuestion.answer = Math.floor(Math.random()*1000)%3 + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                correct_ans
            );
            formattedQuestion.choices=[...answerChoices];

            return formattedQuestion;
        });

        startGame();
    })
    .catch(err => {
    console.error(err);
});

// total number of questions is 10 and max score per question is 10
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
   
    questionCounter = 0;
    score = 0;

    //segregate the question set based on three categories- Argument-Structure-Questions, Main-Point-Questions, Full-test
    for(i=0;i<questions.length;i++){
        if(selected_category=="Argument-Structure-Questions" && questions[i].category=="Argument Structure Questions")availableQuestions.push(questions[i]);
        if(selected_category=="Main-Point-Questions" && questions[i].category=="Main Point Questions")availableQuestions.push(questions[i]);
        if(selected_category=="Full-test")availableQuestions.push(questions[i]);

    }
   
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
  

    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        //go to the end page
        return window.location.assign("end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex];
        question.innerHTML = currentQuestion.question;

       
        dynamic_choice.innerHTML = ''
        for(j=0;j<currentQuestion.choices.length;j++)
        {
            dynamic_choice.innerHTML+='<div class="choice-container"><p class="choice-prefix" style="font-size: 12px;">'+(j+1)+'</p><p class="choice-text" data-number="'+j+'">'+currentQuestion.choices[j]+'</p></div>';
        }
        availableQuestions.splice(questionIndex, 1); //prevent the same question from being generated
        acceptingAnswers = true;

        new_choices = Array.from(dynamic_choice.getElementsByClassName("choice-text"));
        
        new_choices.forEach(choice => {
        
        choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
       
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});
};

//total time for entire quiz is 10 mins
function countdown(minutes) {
    var seconds = 60;
    var mins = minutes
    function tick() {
        //This script expects an element with an ID = "counter". You can change that to what ever you want. 
        var counter = document.getElementById("counter");
        var current_minutes = mins-1
        seconds--;
        counter.innerHTML = current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
        if( seconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
            if(mins > 1){
                countdown(mins-1);           
            }
        }
    }
    tick();
}

countdown(10);

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};