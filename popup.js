const submitButton = document.getElementById("submit-button")
const queryParams = {
  active: true,
  currentWindow: true
}
submitButton.addEventListener("click", (e) => {
  chrome.tabs.query(queryParams, (tabs) => {
    if (tabs[0].url.includes("wikiquiz.org/Quiz_Scorer_App.html#/!/IQM")) {
      const startTime = parseInt(document.getElementById("input-timer-start").value);
      const passTime = parseInt(document.getElementById("input-timer-pass").value);

      if(startTime <= 60 && startTime > 0 && passTime <= 60 && passTime > 0) {
        document.querySelector(".error-message").classList.add("error-message-hidden")
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "CREATE_BUTTON",
          startTimeValue: startTime,
          passTimeValue: passTime,
          removeClock: document.getElementById("remove-clock").checked
        })
      }
      else {
        document.querySelector(".error-message").classList.remove("error-message-hidden")
      }
    }
  })
})