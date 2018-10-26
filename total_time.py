import json
from fuzzywuzzy import fuzz
import os
import sys
import pandas as pd


def get_total_time(str1, str2):
    time1 = str1.split(':')
    time2 = str2.split(':')
    total = 0
    if str1!='' and str2!='':
        total += (int(time2[0]) - int(time1[0])) * 3600
        total += (int(time2[1]) - int(time1[1])) * 60
        total += (int(time2[2]) - int(time1[2])) * 1
    return total


def longest_pause(timestamps):
    pauses = []
    for i in range(len(timestamps) - 1):
        pauses.append(get_total_time(timestamps[i][:-1], timestamps[i + 1][:-1]))
    return max(pauses)


def accuracy(target, input):
    return fuzz.ratio(target, input)


if __name__ == "__main__":
    users = []
    types = []
    modes = []
    total_times = []
    longest_pauses = []
    accuracies = []
    movements = []
    for filename in os.listdir(sys.argv[1]):
        with open('./' + sys.argv[1] + '/' + filename) as f:
            if filename!='.DS_Store':
                data = json.load(f)
                times = data['timestamps'].split(' ')
                movements.append(data['movement'])
                users.append(data['user'])
                types.append(data['type'])
                modes.append(data['mode'])
                total_times.append(get_total_time(times[1][:-1], times[-1][:-1]))
                longest_pauses.append(longest_pause(times[1:]))
                accuracies.append(accuracy(data['targetPhrase'], data['inputPhrase']))
    dataframe = {'Userid': users, 'Keyboard Type': types, 'Input type': modes, 'Movement': movements,
                 'Total Time': total_times, 'Longest Pause': longest_pauses, 'Accuracy': accuracies}
    df = pd.DataFrame(dataframe)
    print(df)
    print(len(df.loc[df['Userid']=='p2']))
