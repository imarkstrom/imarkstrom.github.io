import sys

country_list=["Romani", "Argentin", "Mexic", "Sloveni", "Urugua", "Bulgari", "Ukrain", "Hungar", "NewZealan", "German", "ElSalvado", "Slovaki", "Pakista", "Colombi", "Armeni", "Estoni", "Japa", "Australi", "Lithuani", "Chil", "PuertoRic", "Belaru", "Chin", "Nigeri", "Philippine", "GreatBritai", "Switzerlan", "CzechRep", "Norwa", "Banglades", "Latvi", "Azerbaija", "Per", "Georgi", "Bosni", "Venezuel", "UnitedState", "Polan", "Taiwa", "SouthKore", "Russi", "Serbi", "Albani", "DominicanRep", "Croati", "Turke", "Swede", "Spai", "SouthAfric", "Finlan", "Moldov", "Indi", "Montenegr", "Macedoni", "Egyp", "Ugand", "Ira", "SaudiArabi", "Algeri", "Indonesi", "Singapor", "Israe", "Tanzani", "Canad", "Jorda", "VietNa", "Morocc", "Zimbabw", "Kyrgyzsta", "BurkinaFas", "Brazi", "Franc", "Ghan", "Ethiopi", "Malaysi", "Rwand", "Netherland", "Zambi", "Ital", "Guatemal", "Mal", "Andorr", "TrinidadandTobag", "SerbiaandMontenegr", "Thailan", "Cypru", "HongKon", "Uzbekista", "Qata", "Kazakhsta", "Tunisi", "Palestin", "Bahrai", "Ecuado", "Kuwai", "Liby", "Lebano", "Yeme"]


countries = {}
WAVES = {3:{},4:{},5:{},6:{}}

for country in country_list:
    countries[country] = ""

with open(sys.argv[1], "r") as f:
    lines = f.readlines()
    
    years = lines[0].strip("\n").split(";")
    wave_i = 0
    wi =  {3:0,4:0,5:0,6:0};

    find_w = {"1995":3, "1999":4, "2005":5, "2010":6}
    
    for i in range(len(years)):
        if years[i] in find_w:
            wi[find_w[years[i]]] = i

    for line in lines[1:]:
        parts = line.strip("\n").split(";")
        
        for w in range(3,7):
            useable = 0
            if wi[w] == 0:
                continue
            if wi[w]+5 >= len(parts):
                continue
            for p in parts[wi[w]:wi[w]+5]:
                if len(p) != 0:
                    useable += 1
            if useable == 0:
                continue
            
            for c in country_list:
                if c.lower() in parts[0].lower():
                    w_d = 0
                    for p_i in range(wi[w],wi[w]+5):
                        if len(parts[p_i]) > 0:
                            w_d += float(parts[p_i])

                    w_d = w_d / useable
                    WAVES[w][c] = round(w_d,2)

    print(WAVES)
