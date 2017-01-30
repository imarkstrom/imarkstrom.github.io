import sys

categories = ["IVIS", "Stats","Math","Art","Prog","Graphic","HCI","UX"]

values = []
maxval = [0]*8
sumval = [0]*8
menval = [0]*8
print(maxval)
for row in sys.stdin.readlines():
    r = row.strip().split()
    values.append( [r[1],int(r[2]),int(r[3]),int(r[4]),int(r[5]),int(r[6]),int(r[7]),int(r[8]),int(r[9])])
    for  i in range(len(maxval)):
        if values[-1][i+1] > maxval[i]:
            maxval[i] = values[-1][i+1]
    for i in range(len(sumval)):
        sumval[i] += values[-1][i+1]

for r in values:
    print (r)
print()
print(maxval)

numstuds = len(values)
for i in range(len(maxval)):
    menval[i] = sumval[i] / numstuds


for i in range(len(menval)):
    print(categories[i].rjust(10), end = "")
print()
print("Max: ")
for i in range(len(menval)):
    print("%10.2f" % (maxval[i]), end = "")
print()
print("Average: ")
for i in range(len(menval)):
    print("%10.2f" % (menval[i]), end = "")

