import sys


import sys

categories = ["IVIS", "Stats","Math","Art","Prog","Graphic","HCI","UX"]

values = []
alltext = sys.stdin.read().strip()
for row in alltext.strip().split("\n"):
    r = row.strip().split("\t")
    values.append( [r[1],r[2],r[3]] )

words = {}
for word in alltext.split():
    for t in "<->&%.,()[]{}:;\"\'":
        word = word.replace(t,"")
    word = word.lower()
    if word.isdigit() or len(word) < 4:
        continue
    if word not in words:
        words[word] = 1
    else:
        words[word] += 1

wordlist = list(zip(words.keys(), words.values()))
heatmap = sorted(wordlist,key = lambda x: x[1])

inalphaorder = sorted(heatmap,key = lambda x: x[0])


for w in heatmap:
    print (w[0].ljust(18) + str(w[1]))
print()




