const categoryContainer = document.getElementById('category-container');
const cat = document.querySelectorAll('.cat');
const quizContainer = document.getElementById('quiz-container');
const question = document.getElementById('question');
const answersContainer = document.getElementById('answers-container');
const nextBtn = document.getElementById('next');

const questions = [];
let currentQuestionIndex = 0;

// funcitonality for selecting answer. Disables button and highlisght correct answer if wrong answer selected. If correct answer selected; only disables buttons
const selectAnswer= e => {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === 'true';
  if (isCorrect) {
    selectedBtn.classList.add('correct_answer');
  } else {
    selectedBtn.classList.add('incorrect_answer');
  }
  
  Array.from(answersContainer.children).forEach( btn => {
    if(btn.dataset.correct === 'true') {
      btn.classList.add('correct_answer');
    }
    btn.disabled = "true";
  })
}

const nextQuestion = (arr) => {
  currentQuestionIndex++;
  if(currentQuestionIndex < arr.length) {
    displayQuestion(arr)
  } else {
    categoryContainer.classList.remove('inactive')
    quizContainer.style.display = 'none'
  }
}



// api data request funciton that takes one parameter being the subject selected by the user.
const fetchQuestions = async (category) => {
  const resp = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`);
  const data = await resp.json();
  
  // create an object for each question data set
  data.results.forEach( item => {
    questions.push({
      question: item.question,
      answers: [
        {answer: item.incorrect_answers[0], isCorrect: false},
        {answer: item.incorrect_answers[1], isCorrect: false},
        {answer: item.incorrect_answers[2], isCorrect: false},
        {answer: item.correct_answer, isCorrect: true},
      ]
    })
  })
  return questions
};


// display question
const displayQuestion = (arr) => {
  
  // remove child nodes (answers) when moving on to next question.
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.firstChild);
  }

  let currentQuestion = arr[currentQuestionIndex];
  question.innerHTML = currentQuestion.question;
  
  // create new array of answers in order to shuffle the array of answers.
  let currentAnswers = [];
  currentQuestion.answers.forEach( answer => {
    return currentAnswers.push(answer);
  })
  currentAnswers.sort()
  
  // display shuffled array on answers
  currentAnswers.forEach( answer => {
    const button = document.createElement('button');
    button.innerHTML = answer.answer;
    button.classList.add('btn');
    answersContainer.appendChild(button);
    if(answer.isCorrect) { button.dataset.correct = answer.isCorrect };
    button.addEventListener('pointerdown', selectAnswer);
  })
}

cat.forEach( item => {
  item.addEventListener('pointerdown', () => {
    categoryContainer.classList.add('inactive')
    quizContainer.style.display = 'flex'
  })
})

const computers = document.getElementById('computers');
computers.addEventListener('pointerdown', () => {
 fetchQuestions(18);
 setTimeout(displayQuestion, 300, questions)
})

const math = document.getElementById('math');
math.addEventListener('pointerdown', () => {
  fetchQuestions(10);
  setTimeout(displayQuestion, 300, questions)
 })

const mythology = document.getElementById('mythology');
mythology.addEventListener('pointerdown', () => {
  fetchQuestions(20);
  setTimeout(displayQuestion, 300, questions)
})

const history = document.getElementById('history');
history.addEventListener('pointerdown', () => {
  fetchQuestions(23);
  setTimeout(displayQuestion, 300, questions)
})

nextBtn.addEventListener('pointerdown', () => {
  if(currentQuestionIndex < questions.length ) {
    nextQuestion(questions);
  } else {
    selectCategory();
  }
})
