/**
* plugin-anagram-trial
*
* author(s): lynde folsom, pelops-4o. 
*/

jsPsych.plugins["anagram-trial"] = (function() {

    const plugin = {};

    plugin.info = {
        name: 'anagram-trial',
        parameters: {
            group: {
                type: jsPsych.plugins.parameterType.STRING, 
                pretty_name: 'Group',
                description: 'The group of word pairs to display.'
            },
            block: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Block',
                default: null,
                description: 'The block of word pairs to display.'
            },
            trial: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial',
                default: null,
                description: 'The trial of word pairs to display.'
            },
            wordPair: {
                type: jsPsych.plugins.parameterType.HTML_STRING,
                pretty_name: 'Word Pair',
                description: 'The word pair to be displayed for this trial.'
            },
            correct_responses: {
                type: jsPsych.plugins.parameterType.ARRAY,
                pretty_name: 'Correct response',
                description: 'The correct response for each word pair.'
            }
        }
    };

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    plugin.trial = function(display_element, trial) {
        const urlParams = new URLSearchParams(window.location.search);
        const condition = urlParams.get('condition') || 'A';

        let selectedSet;

        switch (condition) {
            case 'A':
                selectedSet = anagram_sets_A;
                break;
            case 'B':
                selectedSet = anagram_sets_B;
                break;
            case 'C':
                selectedSet = anagram_sets_C;
                break;
            case 'D':
                selectedSet = anagram_sets_D;
                break;
            default:
                console.error("Invalid condition");
                return;
        }

        // Shuffle and select 10 random pairs from each type
        const fourLetterPairs = shuffle(selectedSet.filter(pair => pair.Type === 'Four-Letter')).slice(0, 10);
        const fiveLetterPairs = shuffle(selectedSet.filter(pair => pair.Type === 'Five-Letter')).slice(0, 10);
        const sixLetterPairs = shuffle(selectedSet.filter(pair => pair.Type === 'Six-Letter')).slice(0, 10);

        const selectedPairs = fourLetterPairs.concat(fiveLetterPairs).concat(sixLetterPairs);
        const currentPair = selectedPairs[trial.trial - 1];

        // Display the anagram and response input
        display_element.innerHTML = `
            <p>${currentPair.Anagram}</p>
            <input type="text" id="response" autocomplete="off">
            <button id="submit">Submit</button>
        `;

        // Focus on the response input
        display_element.querySelector('#response').focus();

        // Capture the start time when the word pair is displayed
        let startTime = Date.now();

        // Record the response and details
        display_element.querySelector('#submit').addEventListener('click', () => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;  // Calculate the response time in milliseconds
            const response = display_element.querySelector('#response').value;
            const correct = response === currentPair.Word;

            // Capture information about the trial
            jsPsych.finishTrial({
                response: response,
                correct: correct,
                anagram: currentPair.Anagram,
                word: currentPair.Word,
                type: currentPair.Type,
                responseTime: responseTime // Response time in milliseconds
            });
        });
    };

    return plugin;

})();
