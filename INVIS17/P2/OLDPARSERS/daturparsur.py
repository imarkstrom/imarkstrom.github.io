import sys
import json 

# questions are importance in life: work, then family
# 


#State of health                                  W3_11  W4_12  W5_11  W6_11  W7_
#Feeling of happiness                             W3_10  W4_11  W5_10  W6_10  W7_
#Satisfacttion in financial household yadayada    W3_64  W4_80  W5_68  W6_59  W7_
#Satisfacttion with life                          W3_65  W4_81  W5_22  W6_23  W7_
#How much freedom of control and choice           W3_66  W4_82  W5_46  W6_55  W7_
#Income equality                                  W3_125 W4_141 W5_116 W6_96  W7_
#Confidence in major companies                    W3_146 W4_157 W5_142 W6_120 W7_
#Confidence in women movement                     W3_148 W4_159 W5_144 W6_123 W7_
#Meaning of life?                                 W3_177 W4_182 W5_184 W6_143 W7_



#####Live up to friends expectations W3_71 W4_114 W5_66
#######Wiimmenn being independendd W4_IV88
#####WIMMENENN biing sociable W4_IV91
####Drinking alcohol W4_167
#######Good human relationships W3_48 W4_38
############Men should have more rights to work W4_78



q = {} 
q["3"]= "V214,V216,V8,V4,V27,V141,V41,V6,V7,V9,V11,V10,V64,V65,V66,V125,V146,V148,V177".split(",")
q["4"]= "V223,V225,V8,V4,V25,V152,V36,V6,V7,V9,V12,V11,V80,V81,V82,V141,V157,V159,V182".split(",")
q["5"]= "V235,V237,V8,V4,V23,V136,V104,V6,V7,V9,V11,V10,V68,V22,V46,V116,V142,V144,V184".split(",")
q["6"]= "V240,V242,V8,V4,V24,V113,V81,V6,V7,V9,V11,V10,V59,V23,V55,V96,V120,V123,V143".split(",")

dimensions = len(q["3"])
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
    with open("DATA/WV"+i+".sts","r", encoding="utf-8") as f:
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
        print(questions)



            

##print (q_i)






#print(json.dumps(questions_all))
with open("questions.sofartxt", "w") as questOut:
    questOut.write(json.dumps(questions_all))






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
                try:
                    if parts[q_i[wave][ii][1]] != '':
                        person[int(ii)+3] = int(float( parts[ q_i[wave][ii][1]]))
                except Exception:
                    print("bork" , wave)
            
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
with open("newdata.sofartxt", "w") as datOut:
    datOut.write("Wave,Id,Country,Sex,Age,Work,Family,Trust,Police,Environment,Leisure,Politics,Religion,")
    datOut.write("(sr sf)Happiness,(sr sf)Household economy,(sr sf)Life,Freedom Control and choice,Income Equality,Confidence major companies,Confidence women movement,Contemplating meaning of life,")
    for wave in waves:
        if wave in countries:
            for row in countries[wave]:
                datOut.write(",".join([str(p) for p in row]) + ",\n")
                #for e in row:
                    #print(e, end =";")
