//uses customize the question

var questionsTotal = 10;
var questionPool = [];
var correctAnswerTotal = 0;
var wrongAnswer = questionsTotal - correctAnswerTotal;
var strUrl = "https://opentdb.com/api.php?amount=" + questionsTotal
//Counter for Ending API url building process
var counter = 0;
var intervalId = 0;
var timerIntervalId = 0;
var cardCounter = 0;
var intervalTime = 10;



function selectHandler(elem)
{
    strUrl += `&${$(elem).attr("name")}=${$(elem).val()}`;
    //To Avoid storing one url part in multiple times
    $(elem).attr("disabled", "disabled");
    counter++;
}
//GET questions and answers from Trivia Game Api
function getData()
{
    if (counter === 3)
    {
        $.ajax({
            url: strUrl,
            method: "GET"
        }).then(function (response)
        {
            questionPool = response;
            console.log(questionPool)
        });
    };
};

//Display Game Card
function buildNewGameCard()
{
    let queObj = questionPool.results[cardCounter];
    //Build Card Header
    $("#cardHeader").text(`Question NO.${cardCounter + 1}`);
    //Build Question Line
    $("#questionHolder").html(queObj.question);

    //Build Answer Lines
    //Random an index for new added correct item
    let i = Math.floor(Math.random() * queObj.incorrect_answers.length + 1)
    queObj.incorrect_answers.splice(i, 0, queObj.correct_answer);
    console.log(queObj.incorrect_answers);
    //building process
    for (let j = 0; j < queObj.incorrect_answers.length; j++)
    {
        $("ul").append(`<li class = "answerOption">${queObj.incorrect_answers[j]}</li>`);
    };
    $(`ul li:nth-child(${i + 1})`).addClass("correctAnswer");
};

function oldCardRemover()
{
    $("#questionHolder").empty();
    $("#answersChoice").empty();
};

function gameReport()
{

};

function displayTimer()
{
    clearInterval(timerIntervalId);
    $("#timer").empty();

    var timeLeft = intervalTime;
    function setCountDown()
    {
        $("#timer").text(`Time left: ${timeLeft}s`);
        timeLeft--;
    };
    setCountDown();
    timerIntervalId = setInterval(setCountDown, 1000);
}

function cardSwitch()
{
    // display Timer;
    displayTimer();
    if (cardCounter < questionsTotal)
    {
        oldCardRemover();
        buildNewGameCard();
        cardCounter++;
        //Click event listener must be inside the interval
        $("ul li").on("click", function ()
        {
            clearInterval(intervalId);
            clearInterval(timerIntervalId)
            if ($(this).hasClass("correctAnswer"))
            {
                console.log("you are right!");
                correctAnswerTotal++;
            } else
            {
                console.log("you are wrong");
            };
            //Break the current interval
            // clearInterval(intervalId);
            //Create a new interval
            gameStarter();
        });

    } else
    {
        clearInterval(intervalId);
        clearInterval(timerIntervalId);

        console.log("game over");
    };

};

function runTrivia()
{
    intervalId = setInterval(cardSwitch, intervalTime * 1000);
};

function gameStarter()
{
    cardSwitch();
    runTrivia();
}



