
import sys


import sys


values = []
allrows = sys.stdin.readlines()[1:]
for row in allrows:
    r = row.strip().split("\t")
    interests = r[11:]
    print(interests)
    for i in range(len(interests)):
        values.append(r[0:11]+[interests[i]])

with open("useDataData.tsv","w") as f:
    for w in values:
        for a in w:
            f.write(a+"\t")
        f.write("\n")
print()




