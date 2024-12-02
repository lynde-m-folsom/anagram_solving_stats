// This is a general purpose plugin to call in html strings such that you can have a file of strings
// that can be tabbed through with a button. This is useful for consent forms, instructions, etc.
// The structure is similar to the jsPysch html button plugin but I'm coding it to have pages in the place of stimuli that can be tabbed through. @author Lynde Folsom
// ------------------- ------------------- //
//  define the function
//  define the params
//  define the data objects
//  return the plugin
// ------------------- Plugin Functioning ------------------- //

var page_plugin = (function(jsPsych) {
    'use scrict';
    
    const info = {
        name: "page-plugin",
        parameters: {
            /** The html string to be displayed */
            pages: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "pages",
                default: undefined,
            },
            /** The key to continue to the next page. */
            cont_key: {
                type: jspsych.ParameterType.KEY,
                pretty_name: "Continue key",
                default: null,
            },
            /** The button to continue to the next page. */
            cont_btn: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Continue button",
                default: null,
            },
            /** Function to check whether user is allowed to continue after clicking cont_key or clicking cont_btn */
            check_fn: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Check function",
                default: () => true,
            },
            /** Whether or not to force a page refresh. */
            force_refresh: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Force refresh",
                default: false,
            },
            /** If execute_Script == true, then all JavasScript code on the external page will be executed. */
            execute_script: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Execute scripts",
                default: false,
            },
        },
    };



 // ------------------- Class definitions ------------------- //
    /**
     * Page Plugin
     * @author Lynde Folsom
     * Similar to the jspysch html plugin for buttons but addeded the ability to tab through pages of html strings
     */
     
 class PagePlugin {

    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
        var html = '<div id="jspsych-html-button-response-btngroup">';

    }
    simulate(trial, simulation_mode, simulation_options, load_callback){

    }
    create_simulation_data(trial, simulation_options){

    }
    simulate_data_only(trial, simulation_options){

    }
    simulate_visual(trial, simulation_options, load_callback){

    }
    }   
    
    PagePlugin.info = info;
    
    return PagePlugin;

})(jsPsychModule);