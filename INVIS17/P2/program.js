"use strict";
d3.csv('responses.sofartxt',function(raw_surveydata){
	
	var waves = {3:{},4:{},5:{},6:{}};
		
	var process_data = function(surveydata,restrictions, ages){
		waves = {3:{},4:{},5:{},6:{}};

		var useable_restrict = {Wave:[],Country:[],Sex:[],Age:[],Work:[],Family:[],Trust:[],Police:[],Environment:[],Leisure:[],Politics:[],Religion:[]};
		for (var r in restrictions){
			var part_r = restrictions[r].split(":");
			useable_restrict[part_r[0]].push(part_r[1]);
		}
		
		surveydata.forEach(function(row){
			//var parts = [];
			
			for (var e in row){
				if (e != 'Country' && e != 'Sex'){
					row[e] = parseFloat(row[e]);
				}
				//parts.push(row[e]);
			}	
		
		/*	
			for (var i = 0; i < convert_these.length; ++i){
				if (i !== 2 && i !== 3){
					parts[i] = parseInt(parts[i]);
				}
			}
		*/	
			var wave = waves[row.Wave];
			if (typeof wave[row.Country] === 'undefined' ){
				//wave[parts[2]] = {"participants":0, "val":[0,0,0,0,0,0,0,0,0,0]}
				wave[row.Country] = {"participants":0, "val":[0,0,0,0,0,0,0,0,0,0]};
			}
			//var country = wave[parts[2]];
			var country = wave[row.Country];

			
			/*if (parts[3] == "Male"){
				country["val"][0] += 1;
			}else if (parts[3] == "Female"){
				country["val"][0] += 0;
			}else{
		    		country["val"][0] += 0.5;
			}
			*/
			
			var v = country["val"];
			
			var alim = function(p,mi,ma,el){
			    if (mi <= p && p <= ma){
				return p;
			    }else{
				return el;
			    }
			}

			var bring_along = true;
			for (var rest in useable_restrict){
				var kravur = useable_restrict[rest];
				
				if ( isNaN(ages.From) && isNaN(ages.To)){

				}else if ( !isNaN(ages.To) && parseInt(row.Age) > ages.To){
					bring_along = false;
					break;
				}else if ( !isNaN(ages.From) && parseInt(row.Age) < ages.From){
					bring_along = false;
					break;
				}
				
				if (kravur.length != 0 && kravur.indexOf(""+row[rest]) === -1){
					bring_along = false;
					break;
				}
			}	
			if (bring_along == true){
				if(row.Sex === "Male"){
					country.val[0] += 1;
				}else if (row.Sex === "Female"){
					country.val[0] += 0;
				}else{
					country.val[0] += 0.5;
				}

				v[1]+=row.Age;
				v[2]+=row.Work;
				v[3]+=row.Family;
				v[4]+=row.Trust;
				v[5]+=row.Police;
				v[6]+=row.Environment;
				v[7]+=row.Leisure;
				v[8]+=row.Politics;
				v[9]+=row.Religion;
				country["participants"] += 1
			}





			/*
			v[1]+=parts[4]
			
			//work
			v[2]+=alim(parts[5],1,4,0);
			//Family
			v[3]+=alim(parts[6],1,4,0);
			//trust
			v[4]+=alim(parts[7],1,5,0);
			//police
			v[5]+=alim(parts[8],1,4,0);
			//Environment
			v[6]+=alim(parts[9],1,2,0.5);
			//Leisure
			v[7]+=alim(parts[10],1,4,0);
			//Importance politics
			v[8]+=alim(parts[11],1,4,0);
			//Religion
			v[9]+=alim(parts[12],1,4,0);
			*/
		        //for i in range(len(parts)-4):
		        //   country["val"][i+1] += parts[i+4]
		});		    

		var finals = {3:[],4:[],5:[],6:[]}

		for (var waveID in waves){
			var wave = waves[waveID];
			var iix = 0;
			for (var c in wave){
				var country = wave[c]
				if (country.participants === 0){
					continue;
				}
				country["mean"] = [0,0,0,0,0,0,0,0,0,0]
		    		
				for (var ii = 0; ii < country["val"].length; ++ii){
					country["mean"][ii] = country["val"][ii]/country["participants"]
				}

				var nc = {
					"Wave":waveID,
					"Index":iix,
					"Country":c,
					"Sex":country["mean"][0],
					"Age":country["mean"][1],
					"Work":country["mean"][2],
					"Family":country["mean"][3],
					"Trust":country["mean"][4],
					"Police":country["mean"][5],
					"Environment":country["mean"][6],
					"Leisure":country["mean"][7],
					"Politics":country["mean"][8],
					"Religion":country["mean"][9],
				};

				var d = nc;
				d.Sex=parseFloat(parseInt(100*parseFloat(d.Sex)))/100;
				if (d.Sex < 0){
					d.Sex = -1;
				}
				d.Age=parseFloat(parseInt(100*parseFloat(d.Age)))/100;
				if (d.Age < 0){
					d.Age = -1;
				}
				d.Work=parseFloat(parseInt(100*parseFloat(d.Work)))/100;
				if (d.Work < 1 || d.Work > 4){
					d.Work = 10000;
				}

				d.Family=parseFloat(parseInt(100*parseFloat(d.Family)))/100;
				if (d.Family < 1 || d.Family > 4){
					d.Family = 10000;
				}
				d.Trust=parseFloat(parseInt(100*parseFloat(d.Trust)))/100;
				if (d.Trust < 1){
					d.Trust = -10000;
				}
				d.Police=parseFloat(parseInt(100*parseFloat(d.Police)))/100;
				if (d.Police < 1 || d.Police > 4){
					d.Police = 10000;
				}
				d.Environment=parseFloat(parseInt(100*parseFloat(d.Environment)))/100;
				if (d.Environment < 1 || d.Environment > 2){
					d.Environment = 10000;
				}
				d.Leisure=parseFloat(parseInt(100*parseFloat(d.Leisure)))/100;
				if (d.Leisure < 1 || d.Leisure > 4){
					d.Leisure = 10000;
				}
				d.Politics=parseFloat(parseInt(100*parseFloat(d.Politics)))/100;
				if (d.Politics < 1 || d.Politics > 4){
					d.Politics = 10000;
				}
				d.Religion=parseFloat(parseInt(100*parseFloat(d.Religion)))/100;
				if (d.Religion < 1 || d.Religion > 4){
					d.Religion = 10000;
				}

				iix+=1;
				finals[waveID].push(nc);	
			}
		}
		return finals;

	};
	//var use_data = process_data({});
	var use_data = process_data(raw_surveydata,{},{From:NaN,To:NaN});
	var user_selection = [];


	var createParCoordGrid = function(){

		var question_answers = {"4": {"V36": {"1": "Protecting environment", "2": "Economy growth and <br>creating jobs", "3": "Other answer"}, "V223": {"1": "Male", "2": "Female", "9": "NA"}, "V152": {"4": "None at all", "1": "A great deal", "2": "Quite a lot", "3": "Not very much"}, "V9": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V7": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V25": {"1": "Most people can <br>be trusted", "2": "Need to <br>be very careful"}, "V225": {}, "V8": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V4": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V6": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}}, "6": {"V113": {"4": "None at all", "1": "A great deal", "2": "Quite a lot", "3": "Not very much"}, "V240": {"1": "Male", "2": "Female"}, "V9": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V242": {}, "V7": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V24": {"1": "Most people can <br>be trusted", "2": "Need to be <br>very careful"}, "V81": {"1": "Protecting the <br>environment should <br>be given priority", "2": "Economic growth and <br>creating jobs should <br>be the top priority", "3": "Other answer"}, "V8": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V4": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V6": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}}, "5": {"V23": {"1": "Most people <br>can be trusted", "2": "Need to be <br>very careful"}, "V235": {"1": "Male", "2": "Female"}, "V136": {"4": "None at all", "1": "A great deal", "2": "Quite a <br>lot", "3": "Not very much"}, "V9": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V7": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V104": {"1": "Protecting <br>environment", "2": "Economy growth and <br>creating jobs", "3": "Other answer"}, "V237": {}, "V8": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V4": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V6": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}}, "3": {"V141": {"4": "None at all", "1": "Great deal", "2": "Quite a lot", "3": "Not very much"}, "V9": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V214": {"1": "Male", "2": "Female"}, "V7": {"4": "Not at <br>all important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V41": {"1": "Protecting the <br>environment should be <br>given priority", "2": "Economic growth and <br>creating jobs should be <br>the top priority", "3": "Other answer"}, "V216": {}, "V27": {"1": "Most people can <br>be trusted", "2": "Cant be <br>too careful"}, "V8": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V4": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V6": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}}};
		//d3.csv('meanvals.sofartxt', function(data) {
		var WAVE = 3;
		var q = {} 
		q["3"]= "V214,V216,V8,V4,V27,V141,V41,V6,V7,V9".split(",");
		q["4"]= "V223,V225,V8,V4,V25,V152,V36,V6,V7,V9".split(",");
		q["5"]= "V235,V237,V8,V4,V23,V136,V104,V6,V7,V9".split(",");
		q["6"]= "V240,V242,V8,V4,V24,V113,V81,V6,V7,V9".split(",");

		$("#alternatives").unbind();
	//	$("#alternatives2").unbind();

		$("#alternatives").append(
			$("<div>").html("<h4>Sex</h4>").attr("class","btn-group-vertical btn-group-sm mr-2").attr("id","qsex").append(
				$("<button>").attr("id", "a-Sex:Male").attr("class","btn btn-secondary").attr("role","group").text("Male")
			).append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Sex:Female").text("Female")
			).append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Sex:Other").text("Other")
			)

		);
		
		

		$("#alternatives").append(
			$("<div>").attr("id","qwork").attr("class","btn-group-vertical btn-group-sm mr-2").attr("role","group").html("<h4>Work</h4>")
		);
		$("#alternatives").append(
			$("<div>").attr("id","qfamily").attr("class","btn-group-vertical btn-group-sm mr-2").attr("role","group").html("<h4>Family</h4>")
		);
		$("#alternatives").append(
			$("<div>").attr("id","qtrust").attr("class","btn-group-vertical btn-group-sm mr-2").attr("role","group").html("<h4>Trust in people</h4>")
		);
		$("#alternatives").append(
			$("<div>").attr("id","qpolice").attr("class","btn-group-vertical btn-group-sm mr-2").attr("role","group").html("<h4>Confidence in police</h4>")
		);
		$("#alternatives").append(
			$("<div>").attr("id","qenvironment").attr("class","btn-group-vertical btn-group-sm mr-2").attr("role","group").html("<h4>Save the environment<br>or save the economy?</h4>")
		);
		$("#alternatives").append(
			$("<div>").attr("id","qleisure").attr("class","btn-group-vertical btn-group-sm mr-2").attr("role","group").html("<h4>Free time</h4>")
		);
		$("#alternatives").append(
			$("<div>").attr("id","qpolitics").attr("class","btn-group-vertical btn-group-sm mr-2").attr("role","group").html("<h4>Importance of politics</h4>")
		);
		$("#alternatives").append(
			$("<div>").attr("id","qreligion").attr("class","btn-group-vertical btn-group-sm mr-2").attr("role","group").html("<h4>Importance of religion</h4>")
		);
		
		$.each(question_answers[3]["V8"], function(i,answer){
			$("#alternatives #qwork").append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Work:"+i).html(answer)
			);
		});

		$.each(question_answers[3]["V4"], function(i,answer){
			$("#alternatives #qfamily").append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Family:"+i).html(answer)
			);
		});

		$.each(question_answers[3]["V27"], function(i,answer){
			$("#alternatives #qtrust").append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Trust:"+i).html(answer)
			);
		});

		$.each(question_answers[3]["V141"], function(i,answer){
			$("#alternatives #qpolice").append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Police:"+i).html(answer)
			);
		});


		$.each(question_answers[3]["V41"], function(i,answer){
			$("#alternatives #qenvironment").append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Environment:"+i).html(answer)
			);
		});
		$.each(question_answers[3]["V6"], function(i,answer){
			$("#alternatives #qleisure").append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Leisure:"+i).html(answer)
			);
		});
		$.each(question_answers[3]["V7"], function(i,answer){
			$("#alternatives #qpolitics").append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Politics:"+i).html(answer)
			);
		});
		$.each(question_answers[3]["V9"], function(i,answer){
			$("#alternatives #qreligion").append(
				$("<button>").attr("class","btn btn-secondary").attr("id", "a-Religion:"+i).html(answer)
			);
		});

	/*	$("#alternatives btn").each(function(alt_i, elem){
			$(elem).on("click",function(){
				var parts = $(elem).attr('id').split("-");
				var ind = user_selection.indexOf(parts[1]);
				if (ind === -1){
					$(elem).css("background-color","green");
					user_selection.push(parts[1]);
				}else{
					user_selection.splice(ind,1);
					$(elem).css("background-color","white");
				}
			});
		});

	*/
		$("#alternatives .btn").each(function(alt_i, elem){
			$(elem).on("click",function(){
				var parts = $(elem).attr('id').split("-");
				var ind = user_selection.indexOf(parts[1]);
				if (ind === -1){
					$(elem).toggleClass("btn-secondary");
					$(elem).toggleClass("btn-success");
					//$(elem).css("background-color","green");
					user_selection.push(parts[1]);
				}else{
					user_selection.splice(ind,1);
					$(elem).toggleClass("btn-secondary");
					$(elem).toggleClass("btn-success");
					//$(elem).css("background-color","white");
				}
			});
		});
	

		$("#generateDataset").on("click",function(){
			var age_from = parseInt($("#from").val());
			var age_to = parseInt($("#to").val());

			use_data = process_data(raw_surveydata, user_selection, {From:age_from, To:age_to});
			update_visualization(use_data[WAVE]);
		});















		

		


		var GMCO2 ={3: {'Lithuani': 4.31, 'German': 10.44, 'Cypru': 6.75, 'Franc': 6.73, 'Bulgari': 6.31, 'Guatemal': 0.74, 'Croati': 4.18, 'Malaysi': 5.46, 'Chil': 3.58, 'Banglades': 0.2, 'Swede': 5.98, 'Pakista': 0.7, 'Brazi': 1.77, 'Armeni': 1.01, 'Macedoni': 5.81, 'Kuwai': 31.12, 'Uzbekista': 4.56, 'Hungar': 5.94, 'Azerbaija': 3.92, 'Per': 1.08, 'VietNa': 0.54, 'Jorda': 3.11, 'Algeri': 3.28, 'Tunisi': 1.87, 'Australi': 17.73, 'Romani': 4.98, 'Rwand': 0.1, 'Ghan': 0.34, 'Russi': 10.69, 'Moldov': 1.9, 'Ethiopi': 0.07, 'Finlan': 11.15, 'Morocc': 1.15, 'Kazakhsta': 8.74, 'Taiwa': 8.96, 'Japa': 9.51, 'Mal': 0.0, 'Ital': 7.68, 'Netherland': 22.87, 'Norwa': 8.14, 'Ugand': 0.05, 'Serbi': 4.3, 'Chin': 3.53, 'Venezuel': 6.34, 'Indonesi': 1.18, 'Turke': 3.14, 'Mexic': 3.73, 'Spai': 6.41, 'Ukrain': 7.39, 'Liby': 9.1, 'Lebano': 4.22, 'Egyp': 1.72, 'Zambi': 0.22, 'Indi': 1.03, 'Montenegr': 3.04, 'Andorr': 7.09, 'Philippine': 0.92, 'Ecuado': 1.85, 'Canad': 16.37, 'Latvi': 3.47, 'Singapor': 15.22, 'Bahrai': 28.78, 'Argentin': 3.75, 'Colombi': 1.63, 'Sloveni': 7.66, 'Belaru': 5.79, 'Urugua': 1.71, 'Thailan': 2.96, 'Qata': 61.27, 'Israe': 10.56, 'Albani': 0.67, 'Ira': 23.85, 'Polan': 8.86, 'Zimbabw': 1.24, 'Estoni': 11.86, 'Georgi': 0.82, 'Bosni': 3.53, 'Tanzani': 0.1, 'Switzerlan': 5.73, 'Nigeri': 0.35}, 4: {'Lithuani': 3.73, 'German': 10.12, 'Cypru': 7.26, 'Franc': 6.36, 'Bulgari': 5.68, 'Guatemal': 0.89, 'Croati': 4.73, 'Malaysi': 5.55, 'Chil': 3.63, 'Banglades': 0.23, 'Swede': 5.95, 'Pakista': 0.74, 'Brazi': 1.85, 'Armeni': 1.08, 'Macedoni': 5.76, 'Kuwai': 27.88, 'Uzbekista': 4.87, 'Hungar': 5.69, 'Azerbaija': 3.59, 'Per': 1.07, 'VietNa': 0.78, 'Jorda': 3.27, 'Algeri': 2.89, 'Tunisi': 2.13, 'Australi': 17.2, 'Romani': 4.19, 'Rwand': 0.08, 'Ghan': 0.35, 'Russi': 10.7, 'Moldov': 0.99, 'Ethiopi': 0.07, 'Finlan': 11.33, 'Morocc': 1.24, 'Kazakhsta': 9.33, 'Taiwa': 10.17, 'Japa': 9.65, 'Mal': 0.07, 'Ital': 7.9, 'Netherland': 27.14, 'Norwa': 8.91, 'Ugand': 0.06, 'Serbi': 4.19, 'Chin': 3.59, 'Venezuel': 7.11, 'Indonesi': 1.32, 'Turke': 3.2, 'Mexic': 3.86, 'Spai': 7.38, 'Ukrain': 6.79, 'Liby': 8.88, 'Lebano': 4.33, 'Egyp': 1.94, 'Zambi': 0.18, 'Indi': 1.13, 'Montenegr': 2.96, 'Andorr': 7.83, 'Philippine': 0.9, 'Ecuado': 1.86, 'Canad': 17.09, 'Latvi': 2.84, 'Singapor': 11.46, 'Bahrai': 25.9, 'Argentin': 3.63, 'Colombi': 1.4, 'Sloveni': 7.6, 'Belaru': 5.35, 'Urugua': 1.59, 'Thailan': 3.19, 'Qata': 52.95, 'Israe': 10.41, 'Albani': 1.12, 'Ira': 30.76, 'Polan': 7.96, 'Zimbabw': 1.03, 'Estoni': 11.44, 'Georgi': 0.84, 'Bosni': 5.81, 'Tanzani': 0.09, 'Switzerlan': 5.64, 'Nigeri': 0.62}, 5: {'Lithuani': 4.21, 'German': 9.49, 'Cypru': 7.56, 'Franc': 6.09, 'Bulgari': 6.37, 'Guatemal': 0.91, 'Croati': 5.22, 'Malaysi': 7.17, 'Chil': 4.04, 'Banglades': 0.32, 'Swede': 5.28, 'Pakista': 0.92, 'Brazi': 1.91, 'Armeni': 1.54, 'Macedoni': 5.55, 'Kuwai': 31.2, 'Uzbekista': 4.39, 'Hungar': 5.46, 'Azerbaija': 4.6, 'Per': 1.45, 'VietNa': 1.36, 'Jorda': 3.72, 'Algeri': 3.32, 'Tunisi': 2.36, 'Australi': 17.92, 'Romani': 4.38, 'Rwand': 0.06, 'Ghan': 0.37, 'Russi': 11.5, 'Moldov': 1.3, 'Ethiopi': 0.08, 'Finlan': 11.14, 'Morocc': 1.57, 'Kazakhsta': 13.34, 'Taiwa': 11.38, 'Japa': 9.53, 'Mal': 0.07, 'Ital': 7.58, 'Netherland': 30.96, 'Norwa': 9.69, 'Ugand': 0.1, 'Serbi': 5.16, 'Chin': 2.93, 'Venezuel': 6.53, 'Indonesi': 1.66, 'Turke': 3.85, 'Mexic': 4.12, 'Spai': 7.55, 'Ukrain': 6.79, 'Liby': 9.56, 'Lebano': 4.03, 'Egyp': 2.42, 'Zambi': 0.17, 'Indi': 1.41, 'Montenegr': 3.64, 'Andorr': 6.71, 'Philippine': 0.82, 'Ecuado': 2.17, 'Canad': 16.58, 'Latvi': 3.25, 'Singapor': 5.42, 'Bahrai': 23.69, 'Argentin': 4.5, 'Colombi': 1.46, 'Sloveni': 8.03, 'Belaru': 6.26, 'Urugua': 2.07, 'Thailan': 3.89, 'Qata': 53.66, 'Israe': 9.54, 'Albani': 1.27, 'Ira': 25.99, 'Polan': 8.14, 'Zimbabw': 0.77, 'Estoni': 12.51, 'Georgi': 1.34, 'Bosni': 7.53, 'Tanzani': 0.15, 'Switzerlan': 5.41, 'Nigeri': 0.63}, 6: {}}; 
		
		
		
		
		var GMEMP = {3: {'Georgi': 56.74, 'VietNa': 74.18, 'Tanzani': 86.04, 'Venezuel': 53.16, 'Urugua': 55.82, 'Chin': 62.32, 'Qata': 70.8, 'Albani': 52.4, 'Armeni': 37.58, 'Norwa': 63.06, 'Per': 61.96, 'Banglades': 70.0, 'Uzbekista': 53.06, 'Ethiopi': 75.6, 'Australi': 58.3, 'Morocc': 47.06, 'Colombi': 55.04, 'Indi': 58.24, 'Indonesi': 62.74, 'Romani': 60.44, 'Zambi': 59.74, 'Thailan': 73.36, 'Netherland': 51.0, 'Mexic': 57.78, 'Nigeri': 51.78, 'Kazakhsta': 60.82, 'Switzerlan': 65.78, 'Ukrain': 56.32, 'Croati': 48.68, 'Macedoni': 35.38, 'Zimbabw': 68.82, 'Guatemal': 49.04, 'Algeri': 39.12, 'Jorda': 39.12, 'Estoni': 54.94, 'Cypru': 59.08, 'Ecuado': 55.4, 'Montenegr': 50.42, 'Liby': 46.02, 'Chil': 52.22, 'Lithuani': 52.82, 'Finlan': 52.5, 'Latvi': 51.0, 'Yeme': 38.92, 'Bulgari': 44.42, 'Rwand': 86.06, 'Bosni': 46.8, 'Argentin': 54.54, 'German': 53.24, 'Russi': 53.84, 'Ugand': 84.1, 'Azerbaija': 56.3, 'Kuwai': 67.92, 'Moldov': 53.56, 'Israe': 49.58, 'Ghan': 67.68, 'Belaru': 54.56, 'Canad': 58.86, 'Pakista': 47.4, 'Turke': 50.08, 'Ira': 73.34, 'Mal': 64.8, 'Japa': 60.96, 'Kyrgyzsta': 59.34, 'Polan': 50.38, 'Lebano': 45.94, 'Bahrai': 61.72, 'Ital': 42.14, 'Spai': 41.24, 'Sloveni': 54.48, 'Singapor': 63.0, 'Serbi': 50.42, 'Tunisi': 40.84, 'Taiwa': 55.34, 'Hungar': 44.6, 'Swede': 57.36, 'Egyp': 42.36, 'Malaysi': 60.16, 'Philippine': 60.62, 'Franc': 47.96, 'Brazi': 60.68}, 4: {'Georgi': 57.16, 'VietNa': 72.44, 'Tanzani': 84.14, 'Venezuel': 53.76, 'Urugua': 56.32, 'Chin': 60.5, 'Qata': 71.44, 'Albani': 51.88, 'Armeni': 38.48, 'Norwa': 64.5, 'Per': 64.52, 'Banglades': 68.9, 'Uzbekista': 54.46, 'Ethiopi': 76.18, 'Australi': 59.34, 'Morocc': 45.52, 'Colombi': 58.06, 'Indi': 57.08, 'Indonesi': 62.1, 'Romani': 56.0, 'Zambi': 60.76, 'Thailan': 71.92, 'Netherland': 51.22, 'Mexic': 58.16, 'Nigeri': 51.4, 'Kazakhsta': 62.36, 'Switzerlan': 66.08, 'Ukrain': 50.82, 'Croati': 44.86, 'Macedoni': 35.82, 'Zimbabw': 67.52, 'Guatemal': 52.48, 'Algeri': 40.54, 'Jorda': 37.8, 'Estoni': 52.7, 'Cypru': 58.68, 'Ecuado': 57.24, 'Montenegr': 50.74, 'Liby': 46.76, 'Chil': 50.32, 'Lithuani': 50.48, 'Finlan': 55.5, 'Latvi': 50.1, 'Yeme': 38.36, 'Bulgari': 41.42, 'Rwand': 83.06, 'Bosni': 44.74, 'Argentin': 55.74, 'German': 53.16, 'Russi': 54.72, 'Ugand': 83.84, 'Azerbaija': 57.46, 'Kuwai': 67.92, 'Moldov': 49.2, 'Israe': 49.18, 'Ghan': 66.5, 'Belaru': 53.04, 'Canad': 61.0, 'Pakista': 47.2, 'Turke': 46.14, 'Ira': 74.82, 'Mal': 65.38, 'Japa': 58.88, 'Kyrgyzsta': 58.08, 'Polan': 45.88, 'Lebano': 45.88, 'Bahrai': 61.56, 'Ital': 43.66, 'Spai': 46.54, 'Sloveni': 53.94, 'Singapor': 62.02, 'Serbi': 50.74, 'Tunisi': 40.84, 'Taiwa': 53.88, 'Hungar': 46.68, 'Swede': 59.84, 'Egyp': 42.08, 'Malaysi': 60.54, 'Philippine': 59.6, 'Franc': 49.7, 'Brazi': 61.56}, 5: {}, 6: {}}; 




		var GMEQ = {3: {'Mal': 63.27, 'Georgi': 39.33, 'Ugand': 40.1, 'Zimbabw': 50.1, 'Franc': 32.74, 'Urugua': 42.83, 'Ukrain': 34.46, 'Indonesi': 30.16, 'Pakista': 30.84, 'Brazi': 60.29, 'Morocc': 39.46, 'Kazakhsta': 35.32, 'Azerbaija': 34.96, 'VietNa': 35.52, 'Macedoni': 28.13, 'Yeme': 33.44, 'Argentin': 49.62, 'Romani': 29.44, 'Hungar': 26.35, 'Philippine': 46.16, 'Venezuel': 47.68, 'Uzbekista': 45.28, 'Chin': 43.44, 'Zambi': 51.61, 'Banglades': 33.46, 'Armeni': 40.22, 'Ecuado': 54.34, 'Singapor': 42.48, 'Sloveni': 28.41, 'Nigeri': 46.5, 'Guatemal': 55.8, 'Per': 49.2, 'Ethiopi': 39.96, 'Albani': 29.12, 'Croati': 27.27, 'Netherland': 30.9, 'Mexic': 48.77, 'Russi': 41.8, 'Polan': 32.86, 'Chil': 55.21, 'Malaysi': 48.84, 'Ghan': 40.75, 'Lithuani': 31.23, 'Algeri': 35.33, 'Latvi': 31.97, 'Tunisi': 41.66, 'Estoni': 33.85, 'Bulgari': 28.7, 'Egyp': 30.13, 'Belaru': 29.52, 'Thailan': 42.48, 'Colombi': 57.84, 'Moldov': 38.57, 'Jorda': 36.42, 'Ira': 44.1}, 4: {'Tanzani': 34.62, 'Urugua': 45.86, 'Mal': 40.01, 'Bosni': 28.03, 'Georgi': 40.77, 'Tunisi': 40.81, 'Spai': 34.66, 'Ukrain': 28.43, 'Indonesi': 29.36, 'Pakista': 31.71, 'Turke': 43.06, 'Brazi': 59.53, 'Morocc': 40.05, 'Kazakhsta': 36.64, 'Swede': 25.0, 'Azerbaija': 36.5, 'VietNa': 37.55, 'Switzerlan': 33.68, 'Macedoni': 37.38, 'Israe': 39.2, 'Serbi': 32.78, 'Venezuel': 48.02, 'Argentin': 52.56, 'Romani': 30.84, 'Hungar': 27.21, 'Philippine': 45.28, 'Sloveni': 29.98, 'Uzbekista': 35.63, 'Chin': 40.91, 'Zambi': 42.08, 'Banglades': 33.46, 'Armeni': 35.42, 'Finlan': 26.88, 'Canad': 32.56, 'Ital': 36.03, 'Ugand': 44.42, 'Guatemal': 56.52, 'Per': 54.47, 'Rwand': 51.51, 'Ethiopi': 30.0, 'Albani': 28.15, 'Croati': 30.05, 'Netherland': 30.9, 'Mexic': 50.77, 'Russi': 37.51, 'Polan': 33.22, 'Chil': 54.95, 'Ecuado': 57.26, 'Lithuani': 32.19, 'German': 28.31, 'Latvi': 36.78, 'Estoni': 36.62, 'Norwa': 25.79, 'Bulgari': 31.78, 'Egyp': 32.76, 'Belaru': 30.33, 'Thailan': 42.64, 'Colombi': 58.79, 'Moldov': 37.59, 'Jorda': 38.87}, 5: {'Tanzani': 37.58, 'Mal': 38.99, 'Georgi': 40.72, 'Urugua': 46.65, 'Ukrain': 28.27, 'Indonesi': 34.01, 'Pakista': 31.31, 'Turke': 40.28, 'Brazi': 55.97, 'Morocc': 40.88, 'Kazakhsta': 30.0, 'Azerbaija': 33.71, 'VietNa': 35.66, 'Philippine': 43.51, 'Macedoni': 42.32, 'Yeme': 37.69, 'Argentin': 47.35, 'Romani': 31.39, 'Hungar': 31.18, 'Qata': 41.1, 'Venezuel': 47.12, 'Chin': 42.48, 'Zambi': 54.63, 'Banglades': 33.22, 'Armeni': 32.52, 'Ecuado': 52.34, 'Serbi': 29.68, 'Ugand': 43.46, 'Guatemal': 55.89, 'Per': 50.33, 'Ethiopi': 29.83, 'Jorda': 35.77, 'Albani': 33.77, 'Croati': 33.65, 'Bosni': 36.21, 'Mexic': 48.2, 'Russi': 41.15, 'Polan': 34.27, 'Chil': 51.95, 'Malaysi': 46.11, 'Ghan': 42.76, 'Indi': 33.38, 'Montenegr': 30.07, 'Lithuani': 37.57, 'Latvi': 36.44, 'Tunisi': 41.42, 'Bulgari': 28.19, 'Egyp': 31.45, 'Belaru': 28.13, 'Thailan': 40.96, 'Colombi': 57.51, 'Moldov': 35.4, 'Rwand': 53.09, 'Ira': 30.86}, 6: {}}

		//Hack for defaulting the axes...
		var data  = [];
		var countries = [];
		for (var w in use_data){
			for (var c in use_data[w]){
				if (countries.indexOf(use_data[w][c].Country) === -1){
					countries.push(use_data[w][c].Country);
				}
				data.push(use_data[w][c]);
			}
		}

		
	/*	
		data.forEach(function(d){
			d.Index = countries.indexOf(d.Country);
			d.Wave=parseFloat(d.Wave);
			d.Sex=parseFloat(parseInt(100*parseFloat(d.Sex)))/100;
			if (d.Sex < 0){
				d.Sex = -1;
			}
			d.Age=parseFloat(parseInt(100*parseFloat(d.Age)))/100;
			if (d.Age < 0){
				d.Age = -1;
			}
			d.Work=parseFloat(parseInt(100*parseFloat(d.Work)))/100;
			if (d.Work < 1 || d.Work > 4){
				d.Work = 10000;
			}

			d.Family=parseFloat(parseInt(100*parseFloat(d.Family)))/100;
			if (d.Family < 1 || d.Family > 4){
				d.Family = 10000;
			}
			d.Trust=parseFloat(parseInt(100*parseFloat(d.Trust)))/100;
			if (d.Trust < 1){
				d.Trust = -10000;
			}
			d.Police=parseFloat(parseInt(100*parseFloat(d.Police)))/100;
			if (d.Police < 1 || d.Police > 4){
				d.Police = 10000;
			}
			d.Environment=parseFloat(parseInt(100*parseFloat(d.Environment)))/100;
			if (d.Environment < 1){
				d.Environment = 10000;
			}
			d.Leisure=parseFloat(parseInt(100*parseFloat(d.Leisure)))/100;
			if (d.Leisure < 1 || d.Leisure > 4){
				d.Leisure = 10000;
			}
			d.Politics=parseFloat(parseInt(100*parseFloat(d.Politics)))/100;
			if (d.Politics < 1 || d.Politics > 4){
				d.Politics = 10000;
			}
			d.Religion=parseFloat(parseInt(100*parseFloat(d.Religion)))/100;
			if (d.Religion < 1 || d.Religion > 4){
				d.Religion = 10000;
			}
			
		});
	*/	
		var from_color_to_color  = d3.scale.linear().domain([0,countries.length]).range(["darkolivegreen", "maroon"]).interpolate(d3.interpolateLab);
		var from_color_to_color_brushed  = from_color_to_color; //d3.scale.linear().domain([1,10]).range(["blue", "red"]).interpolate(d3.interpolateLab);


		var color = function(d) {
				if (d != null)
					return from_color_to_color(d.Index);
				return "white";
		};

		var color_brushed = function(d) { 
				return from_color_to_color_brushed(d.Index);
		};
		

		/*
		var use_data = {3:[],4:[],5:[],6:[]};
		for (var i = 0; i < data.length; ++i){
			use_data[data[i].Wave].push(data[i]);
		}
		*/
		//When brushing, we want to remember the country names...	
		var brushed_countries = [];
		
		var pcCreate = function(data){
					//data.sort(function(a,b){ 
			//	return a.Country.localeCompare(b.Country);
			//});
			
			var pc = d3.parcoords()("#example0")
				.data(data)
				//.bundlingStrength(0.5)
				//.smoothness(0.05)
				//.bundleDimension("economy (mpg)")
				
				.dimensions({
					"Country":
						{
							title:"Country",
							//orient:'left',
							type:'string',
							//ticks:countries.length+1,
							tickValues: countries,
						},	
					"Sex":
						{
							title:"Sex",
						//	orient:'left',
							type: 'number',
							ticks:4,
							//innerTickSize: 8,
							yscale:d3.scale.linear().domain([1,0]).range(["0","750"]),
						},
					"Age":
						{
							title:"Age",
						//	orient:'left',
							type: 'number',
							yscale:d3.scale.linear().domain([100,15]).range(["0","750"]),
						},
					"Work":
						{
							title:"Work",
						//	orient:'left',
							type: 'number',
							ticks:4,
							//innerTickSize: 8,
							yscale:d3.scale.linear().domain([1,4]).range(["0","750"]),
						},
					"Family":
						{
							title:"Family",
						//	orient:'left',
							type: 'number',
							ticks:4,
							//innerTickSize: 8,
							yscale:d3.scale.linear().domain([1,4]).range(["0","750"]),
						},
					"Trust":
						{
							title:"Trust",
						//	orient:'left',
							type: 'number',
							ticks:1,
							yscale:d3.scale.linear().domain([1,2]).range(["0","750"]),
						},
					"Police":
						{
							title:"Police",
						//	orient:'left',
							type: 'number',
							ticks:4,
							yscale:d3.scale.linear().domain([1,4]).range(["0","750"]),
						},
					"Environment":
						{
							title:"Environment",
						//	orient:'left',
							type: 'number',
							ticks:1,
							yscale:d3.scale.linear().domain([1,2]).range(["0","750"]),
						},
					"Leisure":
						{
							title:"Leisure time",
						//	orient:'left',
							type: 'number',
							ticks:4,
							yscale:d3.scale.linear().domain([1,4]).range(["0","750"]),
						},
					"Politics":
						{
							title:"Politics",
						//	orient:'left',
							type: 'number',
							ticks:4,
							yscale:d3.scale.linear().domain([1,4]).range(["0","750"]),
						},
					"Religion":
						{
							title:"Religion",
						//	orient:'left',
							type: 'number',
							ticks:4,
							yscale:d3.scale.linear().domain([1,4]).range(["0","750"]),
						},
					
					})
				.hideAxis(["Wave","Index"])
				.margin({
					top: 20,
					left: 20,
					right: 20,
					bottom: 20
				})
				.color(color)
				.render()
				.createAxes()
				.composite("darken")
				.alpha(1)
				.alphaOnBrushed(0.2)
				.brushedColor(color_brushed)
				.reorderable()
			pc.brushMode("1D-axes-multi");
			

			pc.svg.selectAll("text").style("font", "10px sans-serif");
			
			var grid = d3.divgrid();
			grid.columns(["Wave", "Country"])
			var rows = d3.select("#grid")
				.datum([])
				.call(grid)
				.selectAll(".row");

			
			rows.on({
				"mouseover": function(d){
					pc.highlight([d]);
				},
				"mouseout": pc.unhighlight,
			});
			
			d3.select("#resetBrushes").on("click", function(){
				brushed_countries = [];
				pc.brushReset();
				pc.unhighlight();
				$("#resetBrushes").attr("class","btn btn-secondary");
				
				rows = d3.select("#grid")
					.datum([])
					.call(grid)
					.selectAll(".row");

			});
			
				
			pc.on("brush", function(d){
				pc.unhighlight();
					
				$("#resetBrushes").attr("class","btn btn-danger");
				brushed_countries = [];
				d.forEach(function(d){
					brushed_countries.push(d.Country);
				});
				pc.highlight(d);
				rows = d3.select("#grid")
					.datum(d)
					.call(grid)
					.selectAll(".row")
				$("#grid").unbind();
				rows.on({
					"mouseover": function(d){
						pc.highlight([d]);
					},
					"mouseout": pc.unhighlight,
				});
				
				set_hover_boxes(rows);

			});

			return {"parcoord":pc,"divgrid":grid,"rows":rows};	
		};
		


		
		var newsurfaces = pcCreate(data);
		var pc = newsurfaces.parcoord;
		var grid = newsurfaces.divgrid;
		var rows = newsurfaces.rows;	

		var show_popup = function(country){

		}

		var set_hover_boxes = function(locrows){
			locrows.each(function(lr){
				$(this).mouseover(function(eve){
					var country_short = $(this).find(".col-1").text();
					
					var gmEMP = "No data for employment of age 15+ was accumulated (Gapminder)";
					var gmCO2 = "During these years no data for CO2 emissions was collected (Gapminder)";
					var gmEQ = "The equality study was not done these years (Gapminder)";

					if (typeof GMEMP[WAVE] !== 'undefined' && typeof GMEMP[WAVE][country_short] !== 'undefined'){
					       gmEMP = "The employment of aged 15+ this period was "+ GMEMP[WAVE][country_short] +" % (Gapminder)";
					}	
					if (typeof GMEQ[WAVE] !== 'undefined' && typeof GMEQ[WAVE][country_short] !== 'undefined'){
					       gmEQ = country_short+ " got a " + GMEQ[WAVE][country_short] +" score on the equality index study, where 0 is perfect equality and 100 is perfect inequality. (Gapminder)";
					}	
					if (typeof GMCO2[WAVE] !== 'undefined' && typeof GMCO2[WAVE][country_short] !== 'undefined'){
					       gmCO2 = "These years, "+country_short+ " released a mean of " + GMCO2[WAVE][country_short] +" tonnes of CO2 per  person (Gapminder)";
					}	
					/*
					var s = "";
					for (var j = 0; j < groups[i].length; j++){
						s = s + "<li>"+ groups[i][j] + "</li>";
					}
					*/
					
					var s = gmEMP+ ". " + gmCO2+". "+ gmEQ + ".";	
					$('<div>').append($("<div>").html(s)).attr("class","member_blob").css({"font-size": "12px","background-color": "#eaeaea"}) .appendTo('body');
					var posx = eve.pageX+20;
					var posy = eve.pageY+30;	
					$('div.member_blob').css({'position': 'absolute', 'top': posy, 'left': posx, 'z-index':3000});	
					
				}).mouseout(function(eve){
					$('div.member_blob').remove();
				});
			});

		};


		var update_visualization = function(wave){
			$("#grid").unbind();
			$("#example0").unbind();
			pc.brushReset();
			pc.unhighlight();
			pc.data(wave)
				//.updateAxes()
				.render()
				.interactive();

			var new_brush = [];
			wave.forEach(function(d){
				brushed_countries.forEach(function(dd){
					if (dd == d.Country){
						new_brush.push(d);
					}	
				});
			});
			if(new_brush.length>0){
				pc.highlight(new_brush);
				rows = d3.select("#grid")
					.datum(new_brush)
					.call(grid)
					.selectAll(".row")

			}else{
				rows = d3.select("#grid")
					.datum([])
					.call(grid)
					.selectAll(".row")
			}
			rows.on({
				"mouseover": function(d){
					pc.highlight([d]);
				},
				"mouseout": pc.unhighlight,
			});

		};

		
		update_visualization(use_data[3]);
		//update_visualization(gotback[3]);
		
		var reset_buttons = function(b){
			$("#showwave3").attr("class","btn btn-primary");
			$("#showwave4").attr("class","btn btn-primary");
			$("#showwave5").attr("class","btn btn-primary");
			$("#showwave6").attr("class","btn btn-primary");
			$(b.target).attr("class", "btn btn-success");
		}	

		$("#showwave3").on("click", function(b){
			update_visualization(use_data[3]);
			reset_buttons(b);
			WAVE = 3;
			
		});

		$("#showwave4").on("click", function(b){
			update_visualization(use_data[4]);
			reset_buttons(b);
			WAVE = 4
		});
		$("#showwave5").on("click", function(b){
			update_visualization(use_data[5]);
			reset_buttons(b);
			WAVE = 5	
		});
		$("#showwave6").on("click", function(b){
			update_visualization(use_data[6]);
			reset_buttons(b);
			WAVE = 6;
		});
		


		var dimensions = $(".dimension .axis");
		
		dimensions.each(function(i,d){
			if (i > 2){
				var question_code = q[WAVE][i-1] ;
				var answers = question_answers[WAVE][question_code];
				var children = $(d).find(".tick");
				children.each(function(j,c){
					var answer = answers[parseInt($(c).text())];
					$(c).find("text").html(answer);
				});
			}
		});
			
	//});
	};

	createParCoordGrid();
	 
});


