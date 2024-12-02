//---------- Description: Utility functions for the anagram stats experiment. ----------//
//This experiment design uses unique sets of stimuli assigned to a participant group
//The stimuli total 30 anagrams, 10 of each type: Four-Letter, Five-Letter, Six-Letter for a block
//There are 3 blocks in total assigned to each participant set group
//Thus there are 90 unique stimuli (30 in each block) in each of 4 sets
// In TV array, we call from the stimuli jason object which has all 360+ stimuli
// We then use the set name assigned in the experiment js to filter the stimuli down to 90
// this way it can be sliced into blocks of 30 which will have 10 of each type
// ie, it should look like this: [Four-Letter 0:10, Five-Letter 10:20, Six-Letter 20:30, Four-Letter 30:40, Five-Letter 40:50, Six-Letter 50:60, Four-Letter 60:70, Five-Letter 70:80, Six-Letter 80:90]
// Now that will be in this order to be sliced into blocks of 30 in the experiment js 
// The array IN the block is then shuffled so that it doesn't sequently increase in difficulty
// further this will make every block unique and not repeat for any participant

//---------- Function to create the TV array ----------//
function create_tv_array(json_object, set_run) {
    let tv_array = [];

    // Filter stimuli based on the set run
    let filtered_stimuli = json_object.filter(item => item.setRun === set_run);

    // Iterate over the filtered stimuli in the order they appear
    filtered_stimuli.forEach(stimulus => {
        let obj = {};
        obj.text = stimulus.anagram;  // The anagram is shown as the stimulus
        obj.setRun = stimulus.setRun;  // The set run is used to filter the stimuli
        obj.set = stimulus.set;  // The set name is used to filter the stimuli
        obj.type = stimulus.type;  // The type of the anagram
        obj.correct = stimulus.correct;  // The correct answer to the anagram
        obj.id = stimulus.id;  // The unique ID of the trial
        obj.data = {
            id: stimulus.id,
            type: stimulus.type,
            anagram: stimulus.anagram,
            correct: stimulus.correct,
            set: stimulus.set,
            text: stimulus.anagram,  // The anagram is shown as the stimulus
            setRun: stimulus.setRun,
        };
        tv_array.push(obj);
    });

    return tv_array;
}

/// Function to check for duplicates in the TV array ///
// Suffle array is depreciated, temporarily leaving in
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
 }

function check_dupes(tv_array) {
    let tv_array_modded = shuffleArray(tv_array);
    console.log("TEST: "+tv_array_modded);
    let final_array = [];
    let unique_list = [];
    for (let i = 0; i < tv_array_modded.length; i++) {
        if (!unique_list.includes(tv_array_modded[i].data.item)) {
            // console.log(tv_array_modded[i].data.item);
            final_array.push(tv_array_modded[i]);
            unique_list.push(tv_array_modded[i].data.item);
        }
    }
    return final_array;
}
