/** The plugin will use this file to give the instructions */

//---------------------------------------//
// Define instructions parameters
//---------------------------------------//

// Define comprehension thresholds.
const max_errors = 0;
const max_loops = 10;
//var n_loops = 0;
var n_errors = 0;

//---------------------------------------//
// Consent form-- why it's in this file is a long story
//---------------------------------------//
// Content from 2023 Russ Poldrack lab exp by LMF//
const readconsent = {
    type: 'anagram-instructions',
    pages: [
      "<p>Thank you for participating in our experiment,</p><p> please use the left and right keys to progress through the following consent form.</p>",
      "<p><b>STUDY TITLE:</b></p><p>Behavioral studies of decision making and executive function.</b></p><p>FOR QUESTIONS ABOUT THE STUDY, CONTACT: Dr. Russell Poldrack at [650-497-8488]</p><p><b>DESCRIPTION:</b></p><p>You are invited to participate in a research study that aims to understand human decision making, executive control (the management and coordination of cognitive processes), learning, and memory.  </p><p> We hope to learn more about the brain and cognitive mechanisms that support these cognitive abilities. As a young, healthy volunteer, you have been asked to participate in this study because our objective is to understand the cognitive functions supported by the healthy human brain. You will be asked to verify that you are between 18-50 years of age. You will be asked to attend to stimuli presented from a computer (usually visual or auditory) and then make a response (usually with hands or with saccadic eye movements) based upon the stimuli.</p>",
      "<p><i>You will be asked to make responses in one or more of the following conditions:</i></p><p> 1. Respond based upon your preferences between different presented options.</p><p> 2. Respond as quickly and accurately as possible to stimuli that are presented in succession.</p><p> 3. Learn a set of stimuli and later respond based upon your memory of the stimuli that you learned.</p><p> As your participation in the experiment is voluntary, you are free to discontinue the experiment at any point. At the discretion of the protocol director subjects may be taken out of this study due to unanticipated circumstances.</p><p><i> Some possible reasons for withdrawal are:</i></p><p> - failure to follow instructions</p><p>- the investigator decides that continuation would be harmful to you </p><p>-the study is canceled</p><p>-not meeting inclusion criteria</p>",
      "<p><b>TIME INVOLVEMENT:</b></p><p> Your participation in this experiment will take approximately 30-60minutes. Longer studies will be broken up across multiple study sessions. The specific length of the study that you will be completing will be in your study description.</p><p><b> RISKS AND BENEFITS:</b></p><p>There are no known risks associated with participation in this study. We cannot and do not guarantee or promise that you will receive any benefits from this study.</p><p><b>PAYMENTS:</b></p><p> As compensation for your participation, you will be paid at the rate listed on prolific at the end of the testing session.</p><p> There is no cost to you for this study.</p><p> There may be the potential to earn bonus pay based upon performance, or completion of the entire group of tasks. </p>",
      "<p><b>PARTICIPANT'S RIGHTS:</b></p><p> If you have read this form and have decided to participate in this project, please understand your participation is voluntary and you have the right to withdraw your consent or discontinue participation at any time without penalty or loss of benefits to which you are otherwise entitled. The alternative is not to participate. </p><p> You have the right to refuse to answer particular questions. The results of this research study may be presented at scientific or professional meetings or published in scientific journals.</p><p> Your individual privacy will be maintained in all published and written data resulting from the study. Identifiers might be removed from identifiable private information and, after such removal, the information could be used for future research studies or distributed to another investigator for future research studies without additional informed consent from you.",
      "<p><b>CONTACT INFORMATION:</b> </p><p> Questions: </p><p>  If you have any questions, concerns or complaints about this research, its procedures, risks and benefits, contact the Protocol Director, Dr. Russell Poldrack, at 650-497-8488.  </p><p> Independent Contact: </p><p> If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906, or email at irbnonmed@stanford.edu. </p><p>  You can also write to the Stanford IRB, Stanford University, 1705 El Camino Real, Palo Alto, CA 94306. </p><p>Please print a copy of this form for your records. </p><p> If you agree to participate in this research, please proceed to the study tasks.</p>"
      ]
  }
  
  const signconsent = {
    type: 'survey-html-form',
    preamble: '<p>By entering your prolific ID below you are affirming that you have read the consent form and consent to participating in this study:</p>',
    html: '<p>Your ID # <input type="text" id="prolific-id" name="prolific-id" size="10" /></p>',
  }
  var CONSENT = { 
    timeline: [readconsent, signconsent],
  }


// Define instructions
const instructions = {
    type: 'anagram-instructions',
    pages: [
        "<p>In this task, you will be presented with a series of words that are scrambled. </p><p>Your task is to unscramble the letters in the second word to form a new word. For example, if you see the word 'lumedbj', you should type 'jumbled' into the text box.</p>",
        "<p>We will not peanlize incorrect answers nor will the solutions be shown. </p>",
        "<p>We do understand that these anagrams could be solved very easily with a search or a computer, please refrian from using these tools for this task as we are seeking human response data, not computer response data.</p>",
        "<p>We thank you for your honesty and contributions to our study, next lets try a couple practice anagrams.</p>"
    ],
    on_start: function(trial) {

        // if first loop, include additional messages.
        if (jsPsych.data.get().filter({instructions: 1}).count() == 0) {
          trial.pages.unshift(
            "<p>We are now beginning the first set of practice trials.</p><p>Use the buttons below, or your keyboard's arrow keys,to<br>navigate the instructions.</p>"
          )
        }
    
      }
}
var INSTRUCTIONS = {
    timeline: [instructions]
  }

// Define practice trials//
// prac 1
const practice_anagram_1 = {
    type: 'anagram-trial',
    questions: [{prompt: 'lumedbj', name: 'response', required: true}],
    data: {practice: 0, correct_response: 'jumbled'},
    on_finish: function(data) {
        if(data.response.response !== data.correct_response) {
            n_errors++;
        }
    }
}
// prac 2
const practice_anagram_2 = {
    type: 'anagram-trial',
    questions: [{prompt: 'cetrpaci', name: 'response', required: true}],
    data: {practice: 1, correct_response: 'practice'},
    on_finish: function(data) {
        if(data.response.response !== data.correct_response) {
            n_errors++;
        }
    }
}
// prac 3
const practice_anagram_3 = {
    type: 'anagram-trial',
    questions: [{prompt: 'xnet', name: 'response', required: true}],
    data: {practice: 2, correct_response: 'next'},
    on_finish: function(data) {
        if(data.response.response !== data.correct_response) {
            n_errors++;
        }
    }
}
const practice_trials = {
    timeline: [practice_anagram_1, practice_anagram_2, practice_anagram_3],
    loop_function: function() {
        n_loops++;
        if (n_errors > max_errors && n_loops < max_loops) {
            n_errors = 0; // Reset errors for the next loop
            return true; // Continue the loop
        } else {
            return false; // Exit the loop
        }
    }
}


//---------------------------------------//
// Main timeline -- here we define the timeline and handling of the instruction part of the experiment
//---------------------------------------//
var timeline = [];

timeline.push(CONSENT);
timeline.push(INSTRUCTIONS);
timeline.push(practice_trials);

// Initialize jsPsych
jsPsych.init({
    timeline: timeline,
    override_safe_mode: true, // Add /remove this line to override safe mode
    on_finish: function() {
        jsPsych.data.displayData();
    }
});


// end experiment early if participant exceeds maximum instructions loops
var end_experiment = {
    type: 'call-function',
    func: function() {
      if (n_loops >= max_loops) {
        low_quality = true;
        jsPsych.endExperiment();
      }
    }
  }
  