import sys

with open(sys.argv[1] , "r") as f:
    waves = {}
    
    waves[3] = {}
    waves[4] = {}
    waves[5] = {}
    waves[6] = {}


    for row in f:
        parts = row.strip(";\n").split(";")
        print(parts)
        for i in range(len(parts)):
            if i not in [2,3]:
                parts[i] = int(parts[i])


        wave = waves[parts[0]]

        if parts[2] not in wave:
            wave[parts[2]] = {"participants":0, "val":[0]*10}
        country = wave[parts[2]]


        country["participants"] += 1
        if parts[3] == "Male":
            country["val"][0] += 1
        elif parts[3] == "Female":
            country["val"][0] += 0
        else:
            country["val"][0] += 0.5
       
        v = country["val"]
        
        def alim(p,mi,ma,el):
            if mi<=p<=ma:
                return p
            else:
                return el
        #ag.
        v[1]+=parts[4]
        
        #work
        v[2]+=alim(parts[5],1,4,0);
        #Family
        v[3]+=alim(parts[6],1,4,0);
        #trust
        v[4]+=alim(parts[7],1,5,0);
        #police
        v[5]+=alim(parts[8],1,4,0);
        #Environment
        v[6]+=alim(parts[9],1,2,0.5);
        #Leisure
        v[7]+=alim(parts[10],1,4,0);
        #Importance politics
        v[8]+=alim(parts[11],1,4,0);
        #Religion
        v[9]+=alim(parts[12],1,4,0);

#        for i in range(len(parts)-4):
#            country["val"][i+1] += parts[i+4]
    

    
    for wave in waves:
        wave = waves[wave]
        for c in wave:
            country = wave[c]
            country["mean"] = [0]*10
            
            for i in range(len(country["val"])):
                country["mean"][i] = country["val"][i]/country["participants"]


    print("Wave,Country,Sex,Age,Work,Family,Trust,Police,Environment,Leisure,Politics,Religion") 
    for w in waves:
        for c in waves[w]:
            country = waves[w][c]
            print(str(w)+","+c, end =",")
            for vi in range(len(country["mean"])):
                print(country["mean"][vi], end = "")
                if vi+1 < len(country["mean"]):
                    print(",",end="")
            print()

