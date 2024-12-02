// Consent as a JS script called in the experiment timeline- uses the jspychinstructions plugin. LMF 2024

const debrief = {
      type: 'jsPsychInstructions', //name type of plugin
      pages: [
            "<p>Thank you for participating in our experiment,</p><p> please use the left and right keys to progress through the following consent form.</p>",
            "</p><p>  If you have any questions, concerns or complaints about this research, its procedures, risks and benefits, contact the Protocol Director, Dr. Russell Poldrack, at 650-497-8488.  </p><p> Independent Contact: </p><p> If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906, or email at irbnonmed@stanford.edu. </p><p>  You can also write to the Stanford IRB, Stanford University, 1705 El Camino Real, Palo Alto, CA 94306. </p><p>Please print a copy of this form for your records. </p><p> If you agree to participate in this research, please proceed to the study tasks.</p>"
       ],      
      // Define the button response
      key_forward: 'right', // Define the key to move forward
      key_backward: 'left', // Define the key to move backward
      allow_backward: true, // Allow the participant to move backward
      button_label_previous: 'Back', // Define the label for the next button
      button_label_next: 'Next', // Define the label for the back button
      // Get the button response
      on_finish: function(data) {
          data.category = 'debrief'
      }
};

      