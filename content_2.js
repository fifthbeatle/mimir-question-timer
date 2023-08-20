let directTime = 0;
let passTime = 0;
let adjustTimeValue = 5;
let speechRate = 1;
let voiceType = 3;
let hideStandardClock = true;
let epochEndTime; //Javascript Date object
let keyboardShortcuts = false;
let timerAlreadyExists = false;
let readButtonAlreadyExists = false;
let showReader = false;

let totalPlayers = 0;
let currentPlayer = 0;

//CONSTANTS
const INTERVAL = 100;
const WARNING_THRESHOLD = 10;

let timer = null;

let onDirect = true;

function setInitialValues(request) {
  totalPlayers = $('.order').length;
  currentPlayer = Math.max(getCurrentPlayer(), 0);
  directTime = request.startTimeValue;
  passTime = request.passTimeValue;
  showReader = request.showReader;
  adjustTimeValue = request.adjustTimeValue;
  hideStandardClock = request.removeClock;
  keyboardShortcuts = request.keyboardShortcuts;
  timerAlreadyExists = $('#timer-button').length > 0
  readButtonAlreadyExists = $('#text-to-voice-button').length > 0
  console.log({ speechRate, voiceType })
  speechRate = request.speechRate
  voiceType = request.voiceType
}

function getCurrentPlayer() {
  return Array.from($('.order')).findIndex(p => $(p).find("span.priority").length > 0)
}

function getTimeRemaining() {
  const now = new Date()
  return Math.round((epochEndTime - now) / 1000)
}

function startTimer() {
  const currentTimeRemaining = getTimeRemaining();

  if (currentTimeRemaining < 0) {
    clearInterval(timer)
  } else {
    $('#timer-button').attr({ value: Math.round(currentTimeRemaining) })
    if (currentTimeRemaining <= WARNING_THRESHOLD) {
      $('#timer-button').addClass('timer-button-warning')
    } else {
      $('#timer-button').removeClass('timer-button-warning')
    }
  }
}

function addButtons() {
  if (!timerAlreadyExists) {
    const $targetElement = $('.tablecell3')
    const $newSpan = $('<span/>').attr({ id: 'timer-section' })

    const $timerButton = $('<input/>').attr({ id: 'timer-button', type: 'button', class: 'timer-button', value: directTime })
    const $decreaseButton = $('<input/>').attr({ id: 'decrease-button', class: 'adjust-button', type: 'button', value: '-' })
    const $increaseButton = $('<input/>').attr({ id: 'increase-button', class: 'adjust-button', type: 'button', value: '+' })

    $newSpan.append($decreaseButton).append($timerButton).append($increaseButton)

    $targetElement.append($newSpan)
  } else {
    $('#timer-button').attr({ value: directTime })
  }
}

function setButtonLogic() {
  $('#timer-button').click((e) => {
    clearInterval(timer)
    epochEndTime = new Date(new Date().getTime() + (onDirect ? directTime : passTime) * 1000)
    timer = setInterval(startTimer, INTERVAL)
  })

  $('#decrease-button').click(() => {
    if (getTimeRemaining() > adjustTimeValue)
      epochEndTime = new Date(epochEndTime.getTime() - (adjustTimeValue) * 1000);
    else
      epochEndTime = new Date()
  })

  $('#increase-button').click(() => {
    if (getTimeRemaining() >= 0) {
      epochEndTime = new Date(epochEndTime.getTime() + (adjustTimeValue * 1000))
    } else {
      epochEndTime = new Date(new Date().getTime() + (adjustTimeValue) * 1000)
      timer = setInterval(startTimer, INTERVAL)
    }
  })

  $("#text-to-voice-button").click(() => {
    const text = $("#ques_text").text();

    let utterance = new SpeechSynthesisUtterance();

    // Set the text and voice of the utterance
    utterance.text = text;
    utterance.rate = speechRate || 1
    utterance.voice = window.speechSynthesis.getVoices()[voiceType || 3];
    utterance.volume = 5;

    // Speak the utterance
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  })
}

function correctButtonHandler() {
  clearInterval(timer)
  $("#timer-button").attr({ value: directTime })
  $("#timer-button").removeClass('timer-button-warning');
  onDirect = true;
  currentPlayer = 0;
  setTimeout(() => {
    addShowNextQuestionShortcut()
  }, 100);
}

function passWrongButtonHandler() {
  currentPlayer += 1
  clearInterval(timer)
  if (currentPlayer < totalPlayers) {
    onDirect = false
    $("#timer-button").attr({ value: passTime })
    $("#timer-button").removeClass('timer-button-warning')
    epochEndTime = new Date(new Date().getTime() + passTime * 1000)
    timer = setInterval(startTimer, INTERVAL)
  } else {
    currentPlayer = 0;
    $("#timer-button").attr({ value: directTime })
    $("#timer-button").removeClass('timer-button-warning')
    onDirect = true;
    setTimeout(() => {
      addShowNextQuestionShortcut()
    }, 100);
  }
}

function undoEventHandler() {
  //TODO: Write the event handler for undo
  currentPlayer = currentPlayer === 0 ? totalPlayers - 1 : currentPlayer - 1;
  clearInterval(timer)

  if (currentPlayer === 0) {
    $("#timer-button").attr({ value: directTime })
    $("#timer-button").removeClass('timer-button-warning')
    onDirect = true
  } else {
    $("#timer-button").attr({ value: passTime })
    onDirect = false
  }

  setTimeout(() => {
    addShowNextQuestionShortcut()
  }, 100);
}

function setPassCorrectLogic() {
  const undoButton = document.querySelectorAll("input[value='Undo']")[0]
  const correctButton = document.querySelectorAll("input[value='Correct']")[0]
  const passButton = document.querySelectorAll("input[value='Pass']")[0]
  const wrongButton = document.querySelectorAll("input[value='Wrong']")[0]
  const killButton = document.querySelectorAll("input[value='Kill']")[0]

  correctButton.addEventListener("click", correctButtonHandler)
  passButton.addEventListener("click", passWrongButtonHandler)
  wrongButton.addEventListener("click", passWrongButtonHandler)
  killButton.addEventListener("click", correctButtonHandler)
  undoButton.addEventListener("click", undoEventHandler)
}

function handleStandardClock() {
  if (hideStandardClock) {
    $('.cell.w24.h7.ng-scope input').addClass('text-gray-color')
  }
  $('.cell.w24.h7.ng-scope').addClass('remove-stickiness')
}

function makePassingOrderSticky() {
  $(".cell.w99.h16:first").addClass('dashboard-sticky')
}

function addKeyboardShortcuts() {
  const undoButton = document.querySelectorAll("input[value='Undo']")[0]
  const correctButton = document.querySelectorAll("input[value='Correct']")[0]
  const passButton = document.querySelectorAll("input[value='Pass']")[0]
  const wrongButton = document.querySelectorAll("input[value='Wrong']")[0]
  const killButton = document.querySelectorAll("input[value='Kill']")[0]
  const timerButton = document.getElementById("timer-button")


  $(document).keypress(e => {
    if (e.which === 65 || e.which === 97) { //'A' or 'a'
      correctButton.click()
    }
    if (e.which === 83 || e.which === 115) { //'S' or 's'
      passButton.click()
    }
    if (e.which === 68 || e.which === 100) { //'D' or 'd'
      wrongButton.click()
    }
    if (e.which === 70 || e.which === 112) { //'F' or 'f'
      killButton.click()
    }
    if (e.which === 81 || e.which === 113) { // 'Q' or 'q'
      undoButton.click()
    }
    if (e.which === 90 || e.which === 122) { // 'Z' or 'z'
      timerButton.click()
    }
  })
}

function addShowNextQuestionShortcut() {
  if (keyboardShortcuts) {
    const showNextQuestion = document.querySelectorAll(".show-question-button")[0]
    $(document).keypress(e => {
      if (e.which === 76 || e.which === 108) { // 'L' or 'l'
        showNextQuestion?.click()
      }
    })
  }
}

function addTextToVoice() {
  const $timerSection = $('#timer-section')
  const $textToVoiceButton = $('<input/>').attr({ type: "button", value: "Read", id: "text-to-voice-button", class: "voice-button" })

  $timerSection.prepend($textToVoiceButton)
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
  console.log(request)
  setInitialValues(request);

  addButtons();
  if (showReader && !readButtonAlreadyExists) {
    addTextToVoice();
  }

  setButtonLogic();
  setPassCorrectLogic();


  if (keyboardShortcuts && !timerAlreadyExists) {
    addKeyboardShortcuts();
  }

  handleStandardClock();
  makePassingOrderSticky();
})
