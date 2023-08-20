const submitButton = document.getElementById("submit-button")
const queryParams = {
  active: true,
  currentWindow: true
}

document.getElementById("show-reader").addEventListener("click", () => {
  document.getElementsByClassName("voice-options")[0].classList.toggle("hide-voice-options");
})

submitButton.addEventListener("click", (e) => {
  chrome.tabs.query(queryParams, (tabs) => {
    if (tabs[0].url.includes("wikiquiz.org/Quiz_Scorer_App.html#/!/IQM")) {
      const startTime = parseInt(document.getElementById("input-timer-start").value);
      const passTime = parseInt(document.getElementById("input-timer-pass").value);
      const adjustTime = parseInt(document.getElementById("input-timer-adjust").value);

      if (startTime <= 60 && startTime > 0 && passTime <= 60 && passTime > 0) {
        document.querySelector(".error-message").classList.add("error-message-hidden")
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "CREATE_BUTTON",
          startTimeValue: startTime,
          passTimeValue: passTime,
          adjustTimeValue: adjustTime,
          removeClock: document.getElementById("remove-clock").checked,
          keyboardShortcuts: document.getElementById("keyboard-shortcuts").checked,
          showReader: document.getElementById("show-reader").checked,
          speechRate: parseFloat(document.getElementById("speech-rate").value),
          voiceType: parseInt(document.getElementById("voice-type").value) - 1,
        })
        window.close();
      }
      else {
        document.querySelector(".error-message").classList.remove("error-message-hidden")
      }
    }
  })
})