let spans = document.getElementsByTagName("span")
let currentTimeValue = 0
let startTimeValue = 0
let passTimeValue = 0
const warningThreshold = 10
let epochEndTime = null
let interval = 100
let timer = null
let newQuestion = null

let mutationObserver = new MutationObserver(() => {
  clearInterval(timer)
  currentTimeValue = startTimeValue
  $("#timer-button").attr({ value: startTimeValue })
  $("#timer-button").css({ backgroundColor: "lightblue" })
  newQuestion = true
})

const spanStyles = { display: "inline-block", float: "right" }
const buttonStyles = {
  border: "none", borderRadius: "5px", padding: "15px 40px",
  backgroundColor: "lightblue", fontFamily: "Menlo, Consolas, monospace"
}

const getTimeRemaining = () => {
  const now = new Date()
  return Math.ceil((epochEndTime - now) / 1000)
}

const startTimer = () => {
  newQuestion = false
  currentTimeValue = getTimeRemaining()
  $("#timer-button").attr({ value: Math.ceil(currentTimeValue) })
  if (currentTimeValue <= warningThreshold) {
    $("#timer-button").css({ backgroundColor: "lightpink" })
  } else {
    $("#timer-button").css({ backgroundColor: "lightblue" })

  }
  if (currentTimeValue <= 0) {
    clearInterval(timer)
  }
}

const createNewButton = (name, value) => {
  const $target = $(".tablecell3.ng-binding")[0]
  const $mySpan = $("<span/>").css(spanStyles)
  const $myButton = $('<input>').attr({ id: "timer-button", value: startTimeValue, type: "button" }).css(buttonStyles)
  currentTimeValue = startTimeValue

  $myButton.click(() => {
    clearInterval(timer)
    epochEndTime = new Date(new Date().getTime() + startTimeValue * 1000)
    currentTimeValue = startTimeValue

    timer = setInterval(startTimer, interval)
  })
  $mySpan.append($myButton[0])
  $target.append($mySpan[0])

  //Add an observer to watch for changes to the Question Number
  mutationObserver.observe(document.getElementsByClassName("tablecell3 ng-binding")[0],
    { characterData: true, subtree: true, childList: true }
  )
}

const removeClockStickiness = () => {
  const $clock = $(".cell.w24.h7.ng-scope")
  $clock.css({ position: "relative" })
}

const makePassingOrderSticky = () => {
  const $dashboard = $(".cell.w99.h16:first")
  $dashboard.css({ position: "sticky", top: "0", height: "90px" })
}

function correctButtonHandler() {
  clearInterval(timer)
  currentTimeValue = startTimeValue
  $("#timer-button").attr({ value: startTimeValue })
  $("#timer-button").css({ backgroundColor: "lightblue" })
  removeClockStickiness()
}

function passWrongButtonHandler() {
  if (!newQuestion) {
    clearInterval(timer)
    currentTimeValue = passTimeValue
    $("#timer-button").attr({ value: passTimeValue })
    $("#timer-button").css({ backgroundColor: "lightpink" })
    epochEndTime = new Date(new Date().getTime() + passTimeValue * 1000)
    timer = setInterval(startTimer, interval)
  }
  removeClockStickiness()
}

const setButtonActions = () => {
  const correctButton = document.querySelectorAll("input[type=button]")[8]
  const passButton = document.querySelectorAll("input[type=button]")[9]
  const wrongButton = document.querySelectorAll("input[type=button]")[10]
  const killButton = document.querySelectorAll("input[type=button]")[11]

  correctButton.addEventListener("click", correctButtonHandler)
  passButton.addEventListener("click", passWrongButtonHandler)
  wrongButton.addEventListener("click", passWrongButtonHandler)
  killButton.addEventListener("click", correctButtonHandler)
}

const hideClock = () => {
  const $clock = $(".cell.w24.h7.ng-scope input");
  $clock.css("color", "rgb(240, 240, 240)")
}

chrome.runtime.onMessage.addListener((request, _sender, _response) => {
  startTimeValue = request.startTimeValue
  passTimeValue = request.passTimeValue

  removeClock = request.removeClock

  if ($("#timer-button").length == 0) {
    createNewButton("Start Timer")
  } else {
    console.log("Button already exists.")
  }
  if(removeClock) {
    hideClock()
  } else {
    removeClockStickiness()
  }
  makePassingOrderSticky()
  setButtonActions()

  /*[TODO] this is a quick-and-dirty hack to keep the timer "unsticky".
  It is currently becoming sticky randomly during the game due to some unknown event. Need to investigate what.
  */
  document.addEventListener("scroll", _event => {
    removeClockStickiness()
  })
})