# Description: Test cases for json_utils.py
from json_utils import load_stimulus_json

def test_load_stimulus_json():
    json_file = 'stimuli.js'
    json_data = load_stimulus_json(json_file)

    assert json_data is not None
    assert isinstance(json_data, list)
    

