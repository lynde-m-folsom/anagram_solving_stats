/**
 * Modeled from js-psych studies by de Leeuw (2015)
 * Lynde Folsom 2024
 * 
 * script is for the consent form used in the anagram task
 */

jsPsych.plugins['anagram-consent'] = (function() {
  var plugin = {};
 
  plugin.info = {
      name: 'anagram-consent',
      description: '',
      parameters: {
          pages: {
              type: jsPsych.plugins.parameterType.HTML_STRING,
              pretty_name: 'Pages',
              array: true,
              description: 'Each element of the array is the content for a single page.'
          },
          key_forward: { 
              type: jsPsych.plugins.parameterType.KEYCODE,
              pretty_name: 'Key forward',
              default: 'ArrowRight',
              description: 'The key the subject can press in order to advance to the next page.'
          },
          key_backward: {
              type: jsPsych.plugins.parameterType.KEYCODE,
              pretty_name: 'Key backward',
              default: 'ArrowLeft',
              description: 'The key that the subject can press to return to the previous page.'
          },
      }
  }

  // defining htmls //
  plugin.trial = function(display_element, trial) {
      //---------------------------//
      // css styling
      //---------------------------//
      
      var new_html = '';
      new_html += `<style>
      body {
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
          position: fixed;
      }
      .jspsych-content-wrapper {
          background: white;
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
          top: 10%;
          bottom: calc(0.60 * var(--height));
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, 0%);
          width: 1000px;
          height: 600px;
          background: white;
          border: 2px solid white;
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

      //---------------------------------------//
      // Section 2: Response handling. from the two step task.
      //---------------------------------------//

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
              page_index: current_page,
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
