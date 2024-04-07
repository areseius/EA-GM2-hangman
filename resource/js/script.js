// ------------------------------------------------------------------------ dom assignments

const keyboard = document.querySelector(".keyboard");
const patternArea = document.querySelector(".pattern");
const hintArea = document.querySelector(".hint");
const resultScreen = document.querySelector(".resultScreen");
const playAgain = document.querySelector(".playAgain");
const hangman = document.querySelector(".hangman");
const menu = document.querySelector(".menu");
const scoreCount = document.querySelector(".scoreCount");
const highScoreCount = document.querySelector(".highScoreCount");

// ------------------------------------------------------------------------ audio assignments

const correctAudio = new Audio("resource/audios/correct.mp3");
const inCorrectAudio = new Audio("resource/audios/incorrect.mp3");
const click = new Audio("resource/audios/click.mp3");
const win = new Audio("resource/audios/win.mp3");
const lose = new Audio("resource/audios/lose.mp3");

// ------------------------------------------------------------------------ other assignments

let counter = 7;
let scoreCounter = 0;
let secretWordPoint = 0;
let firstWin = 0;

const secretWords = [
  "odin",
  "thor",
  "snake",
  "dog",
  "barcelona",
  "real-madrid",
  "banana",
  "kiwi",
  "socrates",
  "platon",
  "javascript",
  "java",
];
const hints = [
  "a viking god.",
  "a viking god.",
  "an animal.",
  "an animal.",
  "a spain football club.",
  "a spain football club.",
  "a fruit.",
  "a fruit.",
  "a philosopher.",
  "a philosopher.",
  "a programming language.",
  "a programming language.",
];

// ------------------------------------------------------------------------ creating buttons

const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(i + 65)
);

alphabet.forEach((x) => {
  const currentLetter = document.createElement("button");
  currentLetter.textContent = x;
  keyboard.appendChild(currentLetter);
});

// ------------------------------------------------------------------------ generating new word, hint and other things

let randomIndex = 0;
let secretWord = "";
let hint = "";

const generateRandomQuestion = () => {
  randomIndex = Math.floor(Math.random() * secretWords.length);
  secretWord = secretWords[randomIndex];
  hint = hints[randomIndex];
  patternArea.textContent = secretWord
    .split("")
    .map((x) => (x != "-" ? "_" : x))
    .join(" ");
  hintArea.textContent = hint;
  secretWordPoint = secretWord.length * 7;
};

generateRandomQuestion();

// ------------------------------------------------------------------------ update score point

const updateScoreCount = (situation) => {
  situation
    ? (scoreCounter += secretWordPoint)
    : (secretWordPoint -= secretWord.length);

  scoreCount.textContent = scoreCounter;
};

// ------------------------------------------------------------------------ creating audio functions

const playCorrectAudio = () => {
  stopAudio(correctAudio);
  stopAudio(inCorrectAudio);
  correctAudio.play();
};

const playIncorrectAudio = () => {
  stopAudio(correctAudio);
  stopAudio(inCorrectAudio);
  inCorrectAudio.play();
};

const playClickAudio = () => {
  click.play();
};

const playWinkAudio = () => {
  win.play();
};

const playLoseAudio = () => {
  lose.play();
};

const stopAudio = (audio) => {
  audio.pause();
  audio.currentTime = 0;
};

// ------------------------------------------------------------------------ creating win and lose screens

const winScreen = () => {
  playAgain.textContent = "Next";
  resultScreen.style.visibility = "visible";
  resultScreen.children[0].children[0].src = "resource/images/hangmanWin.gif";
  resultScreen.children[0].children[0].alt = "hangmanWin";
  resultScreen.children[1].children[0].textContent = "WIN !!!";
  resultScreen.children[1].children[1].children[0].textContent = secretWord;
  firstWin++;
  playWinkAudio();
};

const failScreen = () => {
  playAgain.textContent = "Play Again";
  resultScreen.style.visibility = "visible";
  resultScreen.children[0].children[0].src = "resource/images/hangmanFail.gif";
  resultScreen.children[0].children[0].alt = "hangmanFail";
  resultScreen.children[1].children[0].textContent = "LOSE !!!";
  resultScreen.children[1].children[1].children[0].textContent = secretWord;
  playLoseAudio();
};

// ------------------------------------------------------------------------ checking win moments

const checkWinMoment = () => {
  patternArea.textContent
    .split("")
    .filter((x) => x != " ")
    .join("") == secretWord && winScreen();
};

// ------------------------------------------------------------------------ tapped buttons

const tappedButtons = (situation, button) => {
  if (situation) {
    button.classList.add("correctTapped");
    button.setAttribute("disabled", "");
  } else {
    button.classList.add("inCorrectTapped");
    button.setAttribute("disabled", "");
  }
};

// ------------------------------------------------------------------------ updating hangman's situation

const hangmanUpdate = (counter) => {
  switch (counter) {
    case 6:
      hangman.children[0].style.visibility = "visible";
      break;
    case 5:
      hangman.children[1].style.visibility = "visible";
      break;
    case 4:
      hangman.children[2].style.visibility = "visible";
      break;
    case 3:
      hangman.children[3].style.visibility = "visible";
      break;
    case 2:
      hangman.children[4].style.visibility = "visible";
      break;

    case 1:
      hangman.children[5].style.visibility = "visible";
      break;
    case 0:
      hangman.children[6].style.visibility = "visible";
      failScreen();

      break;
  }
};

// ------------------------------------------------------------------------ click buttons

Array.from(keyboard.children).forEach((x) => {
  x.addEventListener("click", (e) => {
    let currentPattern = patternArea.textContent
      .split("")
      .filter((z) => z != " ");
    if (secretWord.includes(x.textContent.toLowerCase())) {
      secretWord.split("").forEach((y, i) => {
        if (y == x.textContent.toLowerCase()) {
          currentPattern[i] = y;
        }
      });

      patternArea.textContent = currentPattern.join(" ");
      checkWinMoment();
      playCorrectAudio();
      updateScoreCount(1);
      tappedButtons(1, x);
    } else {
      updateScoreCount(0);
      hangmanUpdate(--counter);
      playIncorrectAudio();
      tappedButtons(0, x);
    }
  });
});

// ------------------------------------------------------------------------ click playAgain button

playAgain.addEventListener("click", (e) => {
  if (playAgain.textContent == "Play Again") {
    if (+highScoreCount.textContent < scoreCounter && firstWin) {
      highScoreCount.textContent = scoreCounter;
      firstWin = 0;
    }
    scoreCounter = 0;
    scoreCount.textContent = scoreCounter;
  }

  playClickAudio();
  generateRandomQuestion();
  resultScreen.style.visibility = "hidden";
  Array.from(keyboard.children).forEach((x) => {
    x.removeAttribute("disabled");
    x.classList.remove("inCorrectTapped");
    x.classList.remove("correctTapped");
  });
  stopAudio(win);
  stopAudio(lose);
  counter = 7;
  Array.from(hangman.children).forEach((x) => (x.style.visibility = "hidden"));
});

// ------------------------------------------------------------------------ click menu button

menu.children[2].addEventListener("click", (e) => {
  playClickAudio();
  menu.style.visibility = "hidden";
});
