# Do the following, 
# 1. read the javascript file that contains the json object 
# 2. parse the json object
# 3. print the json object

import json

def load_stimulus_json(json_file):
    with open(json_file, 'r') as f:
        data = f.read()
    start = data.find('{')
    end = data.rfind('}') + 1
    print(__name__)
    json_data = data[start:end]
    json_data = '[\n' + json_data + '\n]'
    return json.loads(json_data)

if __name__ == "__main__":
    json_file = 'stimuli.js'
    json_data = load_stimulus_json(json_file)
    

