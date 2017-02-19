"use strict";

d3.csv('meanvals.sofartxt', function(data) {
	var WAVE = 3;
  	var q = {} 
	q["3"]= "V214,V216,V8,V4,V27,V141,V41,V6,V7,V9".split(",");
	q["4"]= "V223,V225,V8,V4,V25,V152,V36,V6,V7,V9".split(",");
	q["5"]= "V235,V237,V8,V4,V23,V136,V104,V6,V7,V9".split(",");
	q["6"]= "V240,V242,V8,V4,V24,V113,V81,V6,V7,V9".split(",");
	
	var question_answers = {"4": {"V36": {"1": "Protecting environment", "2": "Economy growth and <br>creating jobs", "3": "Other answer"}, "V223": {"1": "Male", "2": "Female", "9": "NA"}, "V152": {"4": "None at all", "1": "A great deal", "2": "Quite a lot", "3": "Not very much"}, "V9": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V7": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V25": {"1": "Most people can <br>be trusted", "2": "Need to <br>be very careful"}, "V225": {}, "V8": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V4": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V6": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}}, "6": {"V113": {"4": "None at all", "1": "A great deal", "2": "Quite a lot", "3": "Not very much"}, "V240": {"1": "Male", "2": "Female"}, "V9": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V242": {}, "V7": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V24": {"1": "Most people can <br>be trusted", "2": "Need to be <br>very careful"}, "V81": {"1": "Protecting the <br>environment should <br>be given priority", "2": "Economic growth and <br>creating jobs should <br>be the top priority", "3": "Other answer"}, "V8": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V4": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V6": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}}, "5": {"V23": {"1": "Most people <br>can be trusted", "2": "Need to be <br>very careful"}, "V235": {"1": "Male", "2": "Female"}, "V136": {"4": "None at all", "1": "A great deal", "2": "Quite a <br>lot", "3": "Not very much"}, "V9": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V7": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V104": {"1": "Protecting <br>environment", "2": "Economy growth and <br>creating jobs", "3": "Other answer"}, "V237": {}, "V8": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V4": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V6": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}}, "3": {"V141": {"4": "None at all", "1": "Great deal", "2": "Quite a lot", "3": "Not very much"}, "V9": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V214": {"1": "Male", "2": "Female"}, "V7": {"4": "Not at <br>all important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}, "V41": {"1": "Protecting the <br>environment should be <br>given priority, even if", "2": "Economic growth and <br>creating jobs should be <br>the top priority", "3": "Other answer"}, "V216": {}, "V27": {"1": "Most people can <br>be trusted", "2": "Cant be <br>too careful"}, "V8": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V4": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very important"}, "V6": {"4": "Not at all <br>important", "1": "Very important", "2": "Rather important", "3": "Not very <br>important"}}}

	console.log(question_answers);

	data.forEach(function(d){
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

	var from_color_to_color  = d3.scale.linear().domain([3,4,5,6]).range(["darkolivegreen", "maroon","chocolate","mediumpurple"]).interpolate(d3.interpolateLab);
	var from_color_to_color_brushed  = from_color_to_color; //d3.scale.linear().domain([1,10]).range(["blue", "red"]).interpolate(d3.interpolateLab);


	var color = function(d) {
			if (d != null)
				return from_color_to_color(d.Wave);
			return "white";
	};

	var color_brushed = function(d) { 
			return from_color_to_color_brushed(d.Wave);
	};

	var use_data = {3:[],4:[],5:[],6:[]};
	for (var i = 0; i < data.length; ++i){
		use_data[data[i].Wave].push(data[i]);
	}
	
	//When brushing, we want to remember the country names...	
	var brushed_countries = [];

	var countries = [];
	console.log(data);
	
	
	data.forEach(function(c){
		console.log(c);
		if (countries.indexOf(c.Country) === -1){
			countries.push(c.Country);
		}
	});
	
	console.log(countries);
	
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
						yscale:d3.scale.linear().domain([70,25]).range(["0","750"]),
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
						title:"Leisure",
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
			.hideAxis(["Wave"])
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

		});

		return {"parcoord":pc,"divgrid":grid,"rows":rows};	
	};
	


	
	var newsurfaces = pcCreate(data);
	var pc = newsurfaces.parcoord;
	var grid = newsurfaces.divgrid;
	var rows = newsurfaces.rows;	

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
	
//	console.log(q);
//	console.log(question_answers);
	var dimensions = $(".dimension .axis");
//	console.log(dimensions);
	
	dimensions.each(function(i,d){
		if (i > 2){
			var question_code = q[WAVE][i-1] ;
			var answers = question_answers[WAVE][question_code];
//			console.log(question_code);
//			console.log(answers);
			var children = $(d).find(".tick");
//			console.log(children);
			children.each(function(j,c){
				var answer = answers[parseInt($(c).text())];
//				console.log(answer);
				$(c).find("text").html(answer);
			});
		}
	});
		
	/*
	for (var iii = 3; iii < dimensions.length; ++iii){
		var tickboxes = $(dimensions[iii]).find(".tick");
		
		
		console.log(tickboxes);
		var question_code = q[WAVE][ parseInt(iii-3) ] ;
		console.log(question_code);
		var answers = question_answers[WAVE][question_code];
		console.log(answers);
		for (var iiii = 0; iiii < tickboxes.length; ++iiii){
			var tickbox = tickboxes[iiii];
			var answer = answers[ $(tickbox).text() ];
			console.log( answer );
			if (typeof answer !== undefined){
				$(tickbox).text(answer);
			}	
			else{
				$(tickbox).text("");
			}
				
		}		
	}*/
});

