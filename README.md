# mimir-question-timer

## Description
Chrome extension to add a timer onto the Wikiquiz scoring page and make passing order sticky

## Version History
06.11.2022: v1.1.0 - Option to hide the display of the standard clock as it was confusing some players.

05.11.2022: Make the timer settings customisable. Time can be set anywhere between 0 and 60 seconds.

05.02.2023: Update the `manifest.json` version to 3.

13.08.20223: v2.1.0
Changes:
1. Refactor code
2. Add buttons to adjust time
3. Reset time based on direct/pass
4. Add keyboard shortcuts

## Instructions for installation
1. Download the zip file `mimir-question-timer.7z` using the Code button and Download Zip.
2. Extract it to a folder `mimir-question-timer`.
3. Open your Extensions page in Chrome either by going to `chrome://extensions` or by selection "More tools" -> "Extensions" from the Chrome menu.
4. Switch on "Developer Mode" in the top right corner.
5. Click on "Load Unpacked" and select the root folder that you downloaded (it should have the `manifest.json` file).

## Instructions for use
1. Add the timer onto the page by clicking on the extension icon in your browser **after** starting your game.
2. Start the timer after you finish reading the question by clicking on it.
3. The timer for passed questions will start automatically after clicking on "Wrong"/"Pass".
4. Keyboard shortcuts:
   
   |Key|Action|
   |---|------|
   |A|Correct|
   |S|Pass|
   |D|Wrong|
   |F|Kill|
   |Q|Undo|
   |Z|Start/reset timer|
   |L|Show next question|

## Contact
1. Email me at **dsouza.arnold@gmail.com** for any clarifications or to report any bugs.
2. Updated versions of the app will be uploaded to this same repository.
