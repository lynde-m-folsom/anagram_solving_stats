/**
* anagramer instructions plugin, modeled off the two-step instructrions plugin from jsPsych by Zorowitz, Breyers, Karni
* Lynde Folsom, 2024
**/

jsPsych.plugins["anagram-instructions"] = (function() {
    var plugin = {};
    plugin.info = {
        name: 'anagram-instructions',
        parameters: {
            pages: {
                type: jsPsych.plugins.parameterType.HTML_STRING,
                pretty_name: 'Pages',
                array: true,
                description: 'The array of pages to display.'
            },
            key_forward: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Key forward',
                default: 'rightarrow',
                description: 'The key to press to go to the next page.'
            },
            key_backward: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Key backward',
                default: 'leftarrow',
                description: 'The key to press to return to the previous page.'
            },
            allow_backward: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Allow backward',
                default: true,
                description: 'If true, the subject can return to the previous page of the instructions.'
            },
            allow_keys: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Allow keys',
                default: true,
                description: 'If true, the subject can use keyboard keys to navigate the pages.'
            }
        }
    }
    plugin.trial = function(display_element, trial) {
     // define html
     // define ccss
     var new_html = '';
     new_html += `<style>
        body {
            height: 100vh;
            max-height: 100vh;
            overflow: hidden;
            position: fixed;
        }
        .jspsych-content-wrapper {
            background: #606060;
            z-index: -1;
        }
        .jspsych-instructions-nav {
            position: absolute;
            bottom: 0%;
            left: 50%;
            -webkit-transform: translate(-50%, 0%);
            transform: translate(-50%, 0%);
            padding: 10px 0px;
        }
        .jspsych-instructions-nav .jspsych-btn {
            padding: 4px 12px;
            font-size: 15px;
        }
        .jspsych-instructions-nav .jspsych-btn:focus {
            outline: none;
        }
        .instructions-box {
            position: absolute;
            bottom: calc(0.60 * var(--height));
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, 0%);
            width: 600px;
            height: 150px;
            background: white;
            border: 2px solid grey;
            border-radius: 12px;
        }
        .instructions {
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: 95%;
        }
        .instructions p {
            font-size: 17px;
            line-height: 1.5em;
            margin-block-start: 0.5em;
            margin-block-end: 0.5em;
        }
        </style>`;
        
     // Draw instructions
     new_html += '<div class="instructions-box"><div class="instructions"></div></div>';

     // Draw buttons
     new_html += '<div class="jspsych-instructions-nav">';
     new_html += '<button id="jspsych-instructions-back" class="jspsych-btn" style="position: absolute; left: 45%; bottom: 8%; -webkit-transform: translateX(-100%); transform: translateX(-100%)">&lt; Prev</button>';
     new_html += '<button id="jspsych-instructions-next" class="jspsych-btn" style="position: absolute; left: 55%; bottom: 8%; -webkit-transform: translateX(0%); transform: translateX(0%)">Next &gt;</button>';
     new_html += '</div>';

     // Close
     new_html += '</div>';
     display_element.innerHTML = new_html;


     // response handling
     // Initialize variables.
     var current_page = 0;
     var view_history = [];
     var start_time = performance.now();
     var last_page_update_time = start_time;

     // Initialize event listeners.
     function btnListener(evt) {
      evt.target.removeEventListener('click', btnListener);
      if(this.id === "jspsych-instructions-back"){
        back();
      }
      else if(this.id === 'jspsych-instructions-next'){
        next();
      }
     }

    // Display current page.
    function show_current_page() {

        // Define base HTML.
        display_element.innerHTML = new_html;
  
        // Update instructions text.
        display_element.querySelector('.instructions').innerHTML = `<p>${trial.pages[current_page]}</p>`;
        // Update prev button
        if (current_page != 0) {
          display_element.querySelector('#jspsych-instructions-back').disabled = false;
          display_element.querySelector('#jspsych-instructions-back').addEventListener('click', btnListener);
        } else {
          display_element.querySelector('#jspsych-instructions-back').disabled = true;
        }
  
        // Update next button
        display_element.querySelector('#jspsych-instructions-next').addEventListener('click', btnListener);
  
      }

     function next() {

        add_current_page_to_view_history()
    
        current_page++;
    
        // if done, finish up...
        if (current_page >= trial.pages.length) {
            endTrial();
        } else {
            show_current_page();
        }
    
        }

     function back() {
        add_current_page_to_view_history()
        current_page--;
        show_current_page();
        }

     function add_current_page_to_view_history() {
        var current_time = performance.now();
        var page_view_time = current_time - last_page_update_time;
        view_history.push({

            viewing_time: page_view_time
        });

        last_page_update_time = current_time;

        }

     function endTrial() {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
        display_element.innerHTML = '';
        var trial_data = {
            "view_history": JSON.stringify(view_history),
            "rt": performance.now() - start_time
        };
        jsPsych.finishTrial(trial_data);
        }

     var after_response = function(info) {
        // have to reinitialize this instead of letting it persist to prevent accidental skips of pages by holding down keys too long
        keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: [trial.key_forward, trial.key_backward],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });
        // check if key is forwards or backwards and update page
        if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward)) {
            if (current_page !== 0) {
            back();
            }
        }
    
        if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
            next();
        }
    
        };

    show_current_page();

    var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: 'performance',
        persist: false
    });
 };
    
  return plugin;
})();

        