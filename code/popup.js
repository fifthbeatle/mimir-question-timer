const submitButton = document.getElementById("submit-button")
const queryParams = {
  active: true,
  currentWindow: true
}
submitButton.addEventListener("click", (e) => {
  chrome.tabs.query(queryParams, (tabs) => {
    if (tabs[0].url.includes("wikiquiz.org/Quiz_Scorer_App.html#/!/IQM")) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "CREATE_BUTTON",
        startTimeValue: document.getElementById("input-timer-start").value,
        passTimeValue: document.getElementById("input-timer-pass").value
      })
    }
  })
})