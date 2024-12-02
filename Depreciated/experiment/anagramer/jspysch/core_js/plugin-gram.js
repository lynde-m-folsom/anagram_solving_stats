// Adapted from Cloze plugin by Brandon Papineau as part of Hernandez et al (2024)
// Modifications from the JSpych Cloze plugin
// 1. Added a prompt option to display a prompt beneath the cloze task
// 2. Disabled pasting in the input boxes
// 3. Added a function to check multiple answers against the solutions <- Lynde disabled for anagramer
// 4. Only one blank space 
// 5. Must hit enter rather than continue
// 6. Autofocus on the textboxes
// Lynde's Mods:
// 1. renamed some vars and conts for clarity
// 2. getting some problems with the timeline


//--------------------------------------Plugin Parameters--------------------------------------//
var jsPsychAnagrammer = (function (jspsych) {
  'use strict';

  const info = {
      name: "gram",
      parameters: {
        // The anagram text to be displayed. 
        anagram: {
            type: jspsych.ParameterType.STRING,
            pretty_name: "Anagram",
            default: "Problem with the anagram text.",
            description: "The anagram text to be displayed."
        },
        // The correct answer to the anagram.
        correct: {
            type: jspsych.ParameterType.STRING,
            pretty_name: "Correct",
            description: "The correct answer to the anagram."
        },
        // unique ID for the trial
        id: {
            type: jspsych.ParameterType.STRING,
            pretty_name: "ID",
            description: "The ID of the trial."
        },
        // type of the trial
        type: {
            type: jspsych.ParameterType.STRING,
            pretty_name: "Type",
            description: "The type of the trial."
        },
        // set of the trial, there are unique sets of trials assigned to the participant group
        set: {
            type: jspsych.ParameterType.STRING,
            pretty_name: "Set",
            description: "The set of the trial."
        },
        // The prompt to be displayed beneath the anagram can include something like the avg time to solve the anagram
        prompt: {
            type: jspsych.ParameterType.STRING,
            pretty_name: "Prompt",
            default: null,
            description: "Any content here will be displayed below the stimulus."
        },
        // Whether to check answers against solutions.
        check_answers: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: "Check answers",
            default: false,
            description: "Whether to check answers against solutions."
        },
        // Whether to allow blanks in the responses.
        allow_blanks: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: "Allow blanks",
            default: true,
            description: "Whether to allow blanks in the responses."
        },
        // Function to call when a mistake is made.
        mistake_fn: {
            type: jspsych.ParameterType.FUNCTION,
            pretty_name: "Mistake function",
            default: () => {},
            description: "Function to call when a mistake is made."
        }
        }
  };
  /**
   * **cloze ..now anagram,**
   *
   * jsPsych plugin for displaying a cloze test and checking participants answers against a correct solution
   * that has been modified to display anagrams and check answers against solutions but allows for further modifications so that it's not a cloze per se
   * orignal @author Philipp Sprengholz
   * modified by @author Lynde Folsom 
   * @see {@link https://www.jspsych.org/plugins/jspsych-cloze/ cloze plugin documentation on jspsych.org}
   */

  class GramPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
        //var current_page = 0; <- revisit later maybe
        var view_history = [];
        var start_time = performance.now();
         // create the html for the trial
         let html = `<div class="gram">${trial.anagram}</div>`;
         html += `<input class="inputBox" onpaste="return false" type="text" id="inputBox" value="">`;
         // prompt
         if (trial.prompt !== null) {
            html += `<br><br><div id="jspsych-html-button-response-prompt" style="font-size:90%"><strong>${trial.prompt}</strong></div>`;
         }
        // draw onscreen
         display_element.innerHTML = html;
         // response handling preface
         var response = {
            rt: null,   // response time
            key: null,  // keys pressed
            stimulus: trial.anagram, // the anagram onscreen
            id: trial.id, // the unique ID of the trial
        };
        // check function (FYI this is actually now more like an "end trial" function)
          const check = () => {
            const user_response = document.getElementById('inputBox').value.trim();
            let answers_correct = true;
            let answers_filled = true;
            let answers = [user_response];

            if (trial.check_answers && user_response !== trial.correct) {
                document.getElementById('inputBox').style.color = 'red';
                answers_correct = false;
            } else {
                document.getElementById('inputBox').style.color = 'black';
            }
            if (!trial.allow_blanks) {
                if (answers[0] === "") {
                    answers_filled = false;
                }
            }
            if ((trial.check_answers && !answers_correct) || (!trial.allow_blanks && !answers_filled)) {
                  trial.mistake_fn();
            }
            else {
                var trial_data = {
                    response: response.key,
                    rt: response.rt, // response time in ms
                    id: trial.id,
                    anagram: trial.anagram,
                    set: trial.set,
                }; 
                  console.log(trial_data);
                  display_element.innerHTML = "";
                  this.jsPsych.finishTrial(trial_data);
            }
          };
          // look for enter key press to trigger the end of the trial
          function enterPress(p) {
              if (p.key == "Enter") {
                  p.preventDefault();
                    response.key = document.getElementById('inputBox').value; // 
                    response.rt = performance.now() - start_time; //compute rt
                    response.anagram = trial.anagram;

                  check(); // check the answer is valid
              }
          };
          // add event listener for enter key press of an enter key
          display_element.querySelector(".inputBox").addEventListener("keypress", enterPress);
          display_element.querySelector(".inputBox").focus()

      } //thus ends the trial

      // simulate trial (important for testing)
      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();answers
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }
      create_simulation_data(trial, simulation_options) {
        const response = trial.correct || this.jsPsych.randomization.randomWords({ exactly: 1 })[0];
        const default_data = {
            response: response,
            id: trial.id,
            type: trial.type,
            set: trial.set,
            correct: trial.correct,
        };
        return this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
    }
      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          const inputs = display_element.querySelectorAll('input[type="text"]');
          let rt = this.jsPsych.randomization.sampleExGaussian(750, 200, 0.01, true);
          for (let i = 0; i < data.response.length; i++) {
              this.jsPsych.pluginAPI.fillTextInput(inputs[i], data.response[i], rt);
              rt += this.jsPsych.randomization.sampleExGaussian(750, 200, 0.01, true);
          }
          this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#finish_gram_button"), rt);
      }
  }
  GramPlugin.info = info;

  return GramPlugin;

})(jsPsychModule);
