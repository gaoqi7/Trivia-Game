//uses customize the question

var questionsTotal = 10;
var questionPool = [];
var correctAnswerTotal = 0;
var wrongAnswer = questionsTotal - correctAnswerTotal;
var strUrl = "https://opentdb.com/api.php?amount=" + questionsTotal
//Counter for Ending API url building process
var counter = 0;
var cardIntervalId = 0;
var timerIntervalId = 0;
var cardCounter = 0;
var intervalTime = 10;
var playerChoice = [];



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
    $("#keepCalm").fadeOut(800);
};

//Display Game Card
function buildNewGameCard(n)
{
    let queObj = questionPool.results[n];
    //Build Card Header
    $("#cardHeader").text(`Question NO.${n + 1}`);
    //Build Question Line
    $("#questionHolder").text(queObj.question);

    //Build Answer Lines
    //Random an index for new added correct item
    let i = Math.floor(Math.random() * (queObj.incorrect_answers.length + 1));
    console.log("random index " + i);

    //---------------

    const insert = (arr, index, newItem) => [
        // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted item
        newItem,
        // part of the array after the specified index
        ...arr.slice(index)
    ]
    const incPc = insert(queObj.incorrect_answers, i, queObj.correct_answer);
    console.log(incPc)


    //-----------




    // queObj.incorrect_answers.splice(i, 0, queObj.correct_answer);
    console.log("the correct answer is " + queObj.correct_answer);
    //building process
    for (let j = 0; j < incPc.length; j++)
    {
        $("ul").append(`<li class = "answerOption">${incPc[j]}</li>`);
    };
    $(`ul li:nth-child(${i + 1})`).addClass("correctAnswer");
};

function oldCardRemover()
{
    $("#questionHolder").empty();
    $("#answersChoice").empty();
};

function gameReport(btn)
{
    oldCardRemover();
    console.log($(btn).text() - 1);

    buildNewGameCard($(btn).text() - 1);
    $(".correctAnswer").addClass("bg-success");

};



function displayTimer()
{
    clearInterval(timerIntervalId);
    $("#timer").empty();

    var timeLeft = intervalTime;
    function setCountDown()
    {
        $("#timer").text(`${timeLeft}s`);
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
        console.log("start of function cardCounter is " + cardCounter);

        oldCardRemover();
        buildNewGameCard(cardCounter);
        cardCounter++;
        //Click event listener must be inside the interval
        $("ul li").on("click", function ()
        {
            clearInterval(cardIntervalId);
            clearInterval(timerIntervalId)
            if ($(this).hasClass("correctAnswer"))
            {
                console.log("click time cardCounter is " + cardCounter);

                // console.log("you are right!");
                correctAnswerTotal++;
                $("#scoreWin").text(`${correctAnswerTotal}`);
                $(`#btn${cardCounter - 1}`).removeClass("badge-warning").addClass("badge-success");

            } else
            {
                // console.log("you are wrong");
                $(`#btn${cardCounter - 1}`).removeClass("badge-warning").addClass("badge-danger");
                console.log("click time cardCounter is " + cardCounter);
            };
            //Break the current interval
            // clearInterval(cardIntervalId);
            //Create a new interval
            if (cardCounter !== questionsTotal)
            {
                gameStarter();
            }

        });

    } else
    {
        clearInterval(cardIntervalId);
        clearInterval(timerIntervalId);

        console.log("game over");
    };
    console.log("end of function, cardCounter is " + cardCounter);


};

function runTrivia()
{
    cardIntervalId = setInterval(cardSwitch, (intervalTime - 1) * 1000);
};

function gameStarter()
{
    cardSwitch();
    runTrivia();
}



