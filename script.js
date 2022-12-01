'use strict';

//getting all required elements
const start_btn = document.querySelector('.start_btn button');
const info_box = document.querySelector('.info_box');
const exit_btn = document.querySelector('.buttons .quit');
const continue_btn = document.querySelector('.buttons .restart');
const quiz_box = document.querySelector('.quiz_box');
const option_list = document.querySelector('.option_list');
const timeCount = quiz_box.querySelector('.timer .timer_sec');
const timeLine = quiz_box.querySelector('header .time_line');
const timeOff = quiz_box.querySelector('header .time_text');

//If start button is clicked
start_btn.onclick = () => {
  info_box.classList.add('activeInfo'); //This will show the information box
};

//If exit button is clicked
exit_btn.onclick = () => {
  info_box.classList.remove('activeInfo'); //This will hide the information box
};

//If continue button is clicked
continue_btn.onclick = () => {
  info_box.classList.remove('activeInfo'); //This will remove the added information box
  quiz_box.classList.add('activeQuiz'); //This will proceed to the quiz
  showQuestions(0);
  queCounter(1);
  startTimer(20);
  startTimerLine(0);
};

let que_count = 0;
let que_numb = 1;
let counter;
let counterLine;
let timeValue = 20;
let widthValue = 0;
let userScore = 0;

const next_btn = quiz_box.querySelector('.next_btn');
const result_box = document.querySelector('.result_box');
const restart_quiz = result_box.querySelector('.buttons .restart');
const quit_quiz = result_box.querySelector('.buttons .quit');

restart_quiz.onclick = () => {
  result_box.classList.remove('activeResult');
  quit_quiz.classList.add('activeQuiz');
  let que_count = 0;
  let que_numb = 1;
  let timeValue = 20;
  let widthValue = 0;
  let userScore = 0;
  showQuestions(que_count);
  queCounter(que_numb);
  clearInterval(counter);
  startTimer(timeValue);
  clearInterval(counterLine);
  startTimerLine(widthValue);
  next_btn.style.display = 'none';
  timeOff.textContent = 'Time Left';
};

quit_quiz.onclick = () => {
  window.location.reload();
};

//If the next button is clicked

next_btn.onclick = () => {
  if (que_count < response.results.length - 1) {
    que_count++;
    que_numb++;
    showQuestions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    startTimer(timeValue);
    clearInterval(counterLine);
    startTimerLine(widthValue);
    next_btn.style.display = 'none';
    timeOff.textContent = 'Time Left';
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    console.log('No more Questions');
    showResultBox();
  }
};

//
let response;

const questionsAPI = async function () {
  try {
    const api = await fetch(
      'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
    );
    response = await api.json();
    console.log(response.results);
  } catch (error) {}
};

questionsAPI();

//Getting of questiona and options from the array of

let correctAnswer;

function showQuestions(index) {
  console.log(index);
  const que_text = document.querySelector('.que_text');

  let que_tag = `<span>${index + 1}.  ${
    response.results[index].question
  }</span>`;

  let incorrectOptions = response.results[index].incorrect_answers;
  correctAnswer = response.results[index].correct_answer;
  // let formattedQuestion = incorrectOptions.push(correctAnswer);

  const values = Math.floor(Math.random() * 4);

  incorrectOptions.splice(values - 1, 0, correctAnswer);

  console.log(incorrectOptions[1]);

  // for (let i = 0; i < incorrectOptions.length; i++) {
  //   console.log(incorrectOptions[values]);
  // }

  //New Options
  let option_tag = `<div class = "option"><span>
    ${incorrectOptions[0]}</span></div>
    <div class = "option"><span>
    ${incorrectOptions[1]}
    </span></div>
    <div class = "option"><span>
    ${incorrectOptions[2]}
    </span></div>
    <div class = "option"><span>
    ${incorrectOptions[3]}
    </span></div>`;

  //Former questions
  // let que_tag1 =
  //   '<span>' +
  //   questions[index].numb +
  //   '. ' +
  //   questions[index].question +
  //   '</span>';

  ///
  // for (let i = 0; i < questions.length; i++){
  //     let option_tag = '<div class = "option"><span>'+ questions[index].options[i]+'</span></div>';
  // }
  // let option_tag1 =
  //   '<div class = "option"><span>' +
  //   questions[index].options[0] +
  //   '</span></div>' +
  //   '<div class = "option"><span>' +
  //   questions[index].options[1] +
  //   '</span></div>' +
  //   '<div class = "option"><span>' +
  //   questions[index].options[2] +
  //   '</span></div>' +
  //   '<div class = "option"><span>' +
  //   questions[index].options[3] +
  //   '</span></div>';
  que_text.innerHTML = que_tag;
  option_list.innerHTML = option_tag;
  const option = option_list.querySelectorAll('.option');
  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute('onclick', 'optionSelected(this)');
  }
}

let tickIcon =
  '<div class="icon tick"><i class="fas fa-check">&#10003;</i></div>';
let crossIcon =
  '<div class="icon cross"><i class="fab fa-times">&#10005;</i></div>';

function optionSelected(answer) {
  clearInterval(counter);
  clearInterval(counterLine);
  let userAns = answer.textContent;
  let correctAns = correctAnswer;

  console.log(userAns, correctAns, userAns === correctAns);
  let allOptions = option_list.children.length;
  if (userAns === correctAns) {
    userScore += 1;
    answer.classList.add('correct');
    console.log('The answer is correct');
    answer.insertAdjacentHTML('beforeend', tickIcon);
  } else {
    answer.classList.add('incorrect');
    console.log('The answer is wrong');
    answer.insertAdjacentHTML('beforeend', crossIcon);

    //If the answer is wrong, this will show the right answer
    for (let i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correctAns) {
        option_list.children[i].setAttribute('class', 'option correct');
        option_list.children[i].insertAdjacentHTML('beforeend', tickIcon);
      }
    }
  }

  //When a user selects an option, all other options get disabled

  for (let i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add('disabled');
  }
  next_btn.style.display = 'block';
}

function showResultBox() {
  info_box.classList.remove('activeInfo');
  quiz_box.classList.remove('activeQuiz');
  result_box.classList.add('activeResult');
  const scoreText = result_box.querySelector('.score_text');
  if (userScore > 3) {
    let scoreTag =
      '<span>and Congrats! You got <p>' +
      userScore +
      '</p> out of <p>' +
      questions.length +
      '</p></span>';
    scoreText.innerHTML = scoreTag;
  } else if (userScore > 1) {
    let scoreTag =
      '<span>and nice, you got only <p>' +
      userScore +
      '</p> out of <p>' +
      questions.length +
      '</p></span>';
    scoreText.innerHTML = scoreTag;
  } else {
    let scoreTag =
      '<span>and sorry, you got only <p>' +
      userScore +
      '</p> out of <p>' +
      questions.length +
      '</p></span>';
    scoreText.innerHTML = scoreTag;
  }
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time;
    time--;
    if (time < 9) {
      let addZero = timeCount.textContent;
      timeCount.textContent = '0' + addZero;
    }
    if (time < 0) {
      clearInterval(counter);
      timeCount.textContent = '00';
      timeOff.textContent = 'Time Out';

      let correctAns = questions[que_count].answer;
      let allOptions = option_list.children.length;

      for (let i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correctAns) {
          option_list.children[i].setAttribute('class', 'option correct');
          option_list.children[i].insertAdjacentHTML('beforeend', tickIcon);
        }
      }
      for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add('disabled');
      }
      next_btn.style.display = 'block';
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 38);
  function timer() {
    time += 1;
    timeLine.style.width = time + 'px';
    if (time > 550) {
      clearInterval(counterLine);
    }
  }
}

function queCounter(index) {
  const bottom_ques_counter = quiz_box.querySelector('.total_que');
  let totalQuesCountTag =
    '<span><p>' +
    index +
    '</p>of<p>' +
    response.length +
    '</p>Questions</span>';
  bottom_ques_counter.innerHTML = totalQuesCountTag;
}

//////
