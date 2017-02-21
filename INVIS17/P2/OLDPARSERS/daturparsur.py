import sys
import json 

# questions are importance in life: work, then family
# 

dimensions = 10

q = {} 
q["3"]= "V214,V216,V8,V4,V27,V141,V41,V6,V7,V9".split(",")
q["4"]= "V223,V225,V8,V4,V25,V152,V36,V6,V7,V9".split(",")
q["5"]= "V235,V237,V8,V4,V23,V136,V104,V6,V7,V9".split(",")
q["6"]= "V240,V242,V8,V4,V24,V113,V81,V6,V7,V9".split(",")

q_i = {}
q_i["3"] = []
q_i["4"] = []
q_i["5"] = []
q_i["6"] = []

country_starts = {"3":1,"4":1,"5":3,"6":1}
country_vars = [3,2,2,2]
country_codes_all = {}

questions_all = {}


interview_numbers = {}

waves = "3456"

for i in waves:
    with open("DATA/WV"+i+".sts","r") as f:
        questions = {}
        all_lines = f.readlines()[8:]
        ii = 0
        country_codes = []


        for ii in range(len(all_lines)):
            if "VALUE LABELS" in all_lines[ii]:
                break
            parts = [l.lstrip().rstrip() for l in all_lines[ii].lstrip().rstrip().split("\t")]
            
            if parts[0] == "V3":
                interview_numbers[i] = ii
#                print(ii)

            if parts[0] in q[i]:
                q_i[i].append( (q[i].index(parts[0]), ii, parts[4]) ) 
                #print(parts)
        q_i[i].sort()
        
 
        while True:
            while "\\V2" not in all_lines[ii]:
                #print(all_lines[ii])
                ii += 1

            dataset = all_lines[ii].lstrip().rstrip()
            country_dict = {}
            
            ii += 1
            parts = all_lines[ii].lstrip().rstrip().split()
            #print(parts)
            while len(parts) > 1:
                country_dict[int(parts[0])] = "".join(parts[1:])
                ii += 1
                parts = all_lines[ii].lstrip().rstrip().split()
            
            ii += 1
            
            country_codes.append(country_dict)
            if "\\V3" in all_lines[ii]:
                break


       

        while ii < len(all_lines):
            qnum = all_lines[ii].rstrip().lstrip()[1:]
            if qnum in q[i]:
                questions[qnum] = {}
                ii += 1
                row = all_lines[ii].lstrip().rstrip().split()
                while len(row) > 0:
#                    print(row, ii)
                    if int(float(row[0])) >= 0:
                        questions[qnum][row[0]] = " ".join(row[1:]) 
                    row = all_lines[ii].lstrip().rstrip().split()
                    ii += 1
            else:
                ii += 1
        country_codes_all[i] = country_codes
        questions_all[i] = questions



            

##print (q_i)

print(json.dumps(questions_all))

#for key in questions_all:
#    one_round = questions_all[key]
#    print(key)
#    for quest in one_round:
#        print("    ",quest, one_round[quest])
countries = {}
#print() 
#print()
#print(interview_numbers)

for wave in waves:
    with open("DATA/WV"+wave+".dat","r") as f:
        country_codes = country_codes_all[wave] 
        all_lines = f.readlines()
        for line in all_lines:
            #print(".",end = "")
            parts = line.split(",")
            if parts[0] not in countries:
                countries[parts[0]] = []

            person = [-1]*(dimensions+3) # {"Wave":wave,"Country":parts[0],"Id":parts[4]}
            
            #Country and id
            person[0] = int(wave)
            
            for ci in range(len(country_codes)):
                #print(ci)
                if parts[country_starts[wave]+ci] == '':
#                    print("TEHUNTHOUNT")
                    continue

                ccc = int(float(parts[country_starts[wave]+ci])) #.split(".")[0])
                if ccc >= 0 and ccc in country_codes[ci]:
                    person[2] = country_codes[ci][ccc][1:-2]
                    break

            if person[2] == -1:
                person[2] = "Unknown"

    #        if int(parts[2]) < 0
    #
    #        if int(parts[2]) in country_codes[2] and  country_codes[2][int(parts[1])] < 0 and country_codes[2][int(parts[2])] < 0:
    #            person[0] = country_codes[2][int(parts[3])]
    ##        elif int(parts[1]) in country_codes[1] and country_codes[1][int(parts[1])] < 0 :
    #            person[0] = country_codes[1][int(parts[2])]
    #        else:
    #            person[0] = country_codes[0][int(parts[1])]

            person[1] = int(float(parts[interview_numbers[wave]]))
            

            for ii in range(dimensions):
                if parts[q_i[wave][ii][1]] != '':
                    person[int(ii)+3] = int(float( parts[ q_i[wave][ii][1]]))
            
            if person[3] == 1:
                person[3] = 'Male'
            elif person[3] == 2:
                person[3] = 'Female'
            else:
                person[3] = 'Unknown' + str(person[3])
            
            #nonstr = [2,3]
            #for nsc in range(len(person)):
            #    if nsc not in nonstr:
            #        person[nsc] = int(person[nsc])
            
             

            countries[parts[0]].append( person)
             
       
       
countries[wave].sort(key=lambda x : x[1]) 
for wave in "3456":
    if wave in countries:
        for row in countries[wave]:
            for e in row:
                print(e, end =";")
            print()
