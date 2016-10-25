//La carte leaflet se génère dans une iife (modules/map.js)
//appelée dans le script principal

//la gestion de l'authentication par token se fait dans une iife (modules/authentication.js)

//Déclaration des variables

//adresse du serveur API
var Url = new UrlBuilder('http://172.16.18.146:3001')

//var defautPol = ["NOX","PM10","PM2_5","CO2","CH4","N2O"];
var defautPol = ["NOX","TSP","PM10","PM2_5","GES"];
var currentPol = 'NOX'
var currentAnnee = '2012'

//création des graphes
//histogram
var Graphs = new GraphsBuilder(graphsConf.hcOptions)
chart1 = new Highcharts.Chart(graphsConf.hcOptions);

//secteur Pie
var Graphs2 = new GraphsBuilder(graphsConf.hcOptions2)
chart2 = new Highcharts.Chart(graphsConf.hcOptions2);

//sous secteurs pie
var Graphs4 = new GraphsBuilder(graphsConf.hcOptions4)
chart4 = new Highcharts.Chart(graphsConf.hcOptions4);

//stacked Bar
var Graphs5 = new GraphsBuilder(graphsConf.hcOptions5)
chart5 = new Highcharts.Chart(graphsConf.hcOptions5);

//BigPie
var GraphsBigPie = new GraphsBuilder(graphsConf.hcOptionsBigPie)
chartBigPie = new Highcharts.Chart(graphsConf.hcOptionsBigPie);

//map d3
//def generales:
var width = document.getElementsByClassName("row")[0].clientWidth,//800,
height = 400,
height_ = 75;

//1ere carte : Cadastre
var svg_ = d3.select("#map3").append("svg")
.attr("width", width)
.attr("height", height_);
//rajout d'une box
var svg = d3.select("#map3").append("svg")
.attr("width", width)
.attr("height", height);
//cadastre
var layer1 = svg.append('g');
//communes
var layer2 = svg.append('g');
//commune
var layer3 = svg.append('g');


//2e Carte : Emissions par habitant
var carte2svg_ = d3.select("#map32").append("svg")
.attr("width", width)
.attr("height", height_);
//rajout d'une box
var carte2svg = d3.select("#map32").append("svg")
.attr("width", width)
.attr("height", height);
//cadastre
var carte2Layer1 = carte2svg.append('g');
//communes
var carte2Layer2 = carte2svg.append('g');
//commune
var carte2Layer3 = carte2svg.append('g');


//3e Carte : Bubble Map
var carte3svg_ = d3.select("#map33").append("svg")
.attr("width", width)
.attr("height", height_);
//rajout d'une box
var carte3svg = d3.select("#map33").append("svg")
.attr("width", width)
.attr("height", height);
//cadastre
var carte3Layer1 = carte3svg.append('g');
//communes
var carte3Layer2 = carte3svg.append('g');
//commune
var carte3Layer3 = carte3svg.append('g');

//4e Carte : Emissions par km2
var carte4svg_ = d3.select("#map34").append("svg")
.attr("width", width)
.attr("height", height_);
//rajout d'une box
var carte4svg = d3.select("#map34").append("svg")
.attr("width", width)
.attr("height", height);
//cadastre
var carte4Layer1 = carte4svg.append('g');
//communes
var carte4Layer2 = carte4svg.append('g');
//commune
var carte4Layer3 = carte4svg.append('g');

//leaflet
//-> map.js

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//functions
function majSousSecteurs(com,pol,annee,nom){
	Graphs4.setGraph4(chart4,com, pol, annee, nom,'AGRISY','container4','chart4');
	Graphs4.setGraph4(chart4,com, pol, annee, nom,'TROUTE','container5','chart6');
	Graphs4.setGraph4(chart4,com, pol, annee, nom,'RETECI','container6','chart7');
	Graphs4.setGraph4(chart4,com, pol, annee, nom,'EXTREN','container7','chart8');
	Graphs4.setGraph4(chart4,com, pol, annee, nom,'INDUST','container8','chart9');
	Graphs4.setGraph4(chart4,com, pol, annee, nom,'TR_AUT','container9','chart12');
	//Graphs4.setGraph4(chart4,com, pol, annee, nom,'NON_FR','container10','chart10');
	//Graphs4.setGraph4(chart4,com, pol, annee, nom,'UTCF','container11','chart11');
	GraphsBigPie.setGraphBigPie('containerBigPie',{
		id : com,
		pol : pol,
		nom : nom,
		annee : annee
	});
}

function MajTableau(polluant, listeComLight, nomTitre, layerCible, annee) {
	var layerCible = layerCible=="scot"?"comcom":layerCible;
	//maj tableau
	var options = {
		pol : polluant,
		id : listeComLight,
		nom : nomTitre,
		layer : layerCible,
		annee : annee
	}
	var addrTableau = Url.getTableauParEntite(options)
	ApiRequest.request(addrTableau, function(data){
		var response = JSON.parse(data).data
		response.sort(function(a, b){
			return a.id-b.id
		})
		//rajout des ratios par entitées supérieures
		for(var i=0; i<1; i++){
			if (response.length < 2){ break;}
			response[1]['ratioReg'] = response[1].emi / response[0].emi * 100
			if (response.length < 3){ break;}
			response[2]['ratioReg'] = response[2].emi / response[0].emi * 100
			response[2]['ratioDept'] = response[2].emi / response[1].emi * 100
			if (response.length < 4){ break;}
			response[3]['ratioReg'] = response[3].emi / response[0].emi * 100
			response[3]['ratioDept'] = response[3].emi / response[1].emi * 100
			response[3]['ratioEpci'] = response[3].emi / response[2].emi * 100
		}
		//url decode
		for (var i = 0; i < response.length ; i++ ){
			response[i].entite = decodeURI(response[i].entite).replace(/\%27/g, "'")
		}
		//response.id
		var data = {
			entites : response
		}
		var html = template(data);
		// insert the HTML into the page
		$('#matable').html(html);
		$('#nomPol').html(currentPol);
		$('#nomAnnee').html(currentAnnee);
	});
	//maj tableau2
	var options2 = {
		pol : currentPol,
		id : listeComLight,
		annee : currentAnnee
	}
	var addrTableau2 = Url.getBigPie(options2)
	//var url = "http://172.16.18.146:3001/api/getBigPie/"+listeComLight+"?id="+listeComLight+"&pol="+currentPol+"&annee=" + currentAnnee
	ApiRequest.request2('GET', addrTableau2)
	.then(function (e) {
		var result = JSON.parse(e.target.response)
		var data = result.data.data
		var  secteurData = [],
		sousSecteurData = [],
		drillDataLen,
		dataLen = data.length;
		var result = function (data) {
			// Build the data arrays
			for (var i = 0; i < dataLen; i++) {
				// add secteurs data
				secteurData.push({
					name: data[i].drilldown.name,
					y: data[i].y,
				});
				// add Sous-Secteur data
				drillDataLen = data[i].drilldown.data.length;
				for (var j = 0; j < drillDataLen; j++) {
					sousSecteurData.push({
						name: data[i].drilldown.categories[j],
						y: data[i].drilldown.data[j],
					});
				}
			}
			return {
				secteurData : secteurData,
				sousSecteurData : sousSecteurData
			}
		}
		//parse data
		var result = result(data)
		var data = result.sousSecteurData
		var remarquable = function (data) {
			var sorted = data.sort(function(a, b) { return b.y - a.y; }) //reverse sort
			var val = sorted.slice(0,3)//on prend les 3 principales
			var sum = data.reduce(function (acc, obj) { return acc + obj.y; }, 0);
			var rep = [];
			for (var i =0; i<val.length;i++){
				rep.push({
					name : val[i].name,
					value : val[i].y,
					prct : val[i].y/sum*100
				})
			}
			return rep
		}
		var data = {
			entites : remarquable(data)
		}
		var html = template2(data);
		$('#remarquable').html(html);
	});
}

//Fonction pour generer les 3 cartes :
function CreateMap(polluant, layerCible, obj, nomTitre, com){

	d3.selectAll("#map34 > svg > g > path").remove();
	//création de la bubble
	d3.selectAll("#map33 > svg > g > bubble").remove();
	d3.selectAll("#map33 > svg > g > .legend").remove();
	d3.selectAll("#map33 > svg > g > path").remove();
	//création de la choropleth
	d3.selectAll("#map32 > svg > g > path").remove();

	//appel des données a l'api
	var options = {
		id : currentNumCom,
		pol : defautPol,
		nom : currentName,
		annee : currentAnnee
	}
	var url = Url.getPolluantparAnneeToutesCommunes(options)
	//ApiRequest.request(url, function(data){
	ApiRequest.request2('GET', url)
	.then(function (e) {
		//console.log(data);
		var response = JSON.parse(e.target.response)
		//var response = JSON.parse(data)
		var dataSet = response.data
		for (i=0;i<dataSet.length;i++){
			dataSet[i].Dcom = dataSet[i].numcom
		}
		return dataSet;
	}).then(function(dataSet){
		//genere le contour des communes du perimetre pour les deux cartes choroplethes
		D3_.generateD3(carte2Layer2, fc, true, 'init', layerCible)
		D3_.generateD3(carte4Layer2, fc, true, 'init', layerCible)

		//genere la carte chororoplethe par km2, et cree une variable globale 'colorAsync1' qui contient la promise avec la fonction 'color()'
		D3_.createMapChoropleth(carte4Layer2, polluant, 'surf_km', 'Blues', 7, dataSet )
		D3_.addTitre(carte4svg_, carte4Layer3, polluant, nomTitre, 'km2', currentAnnee)
		D3_.activateZoomDrag(carte4Layer2, carte4Layer3, layerCible, fc)

		//genere la carte chororoplethe par habitant, et cree une variable globale 'colorAsync2' qui contient la promise avec la fonction 'color()'
		D3_.createMapChoropleth(carte2Layer2, polluant, 'Pop2013', 'Greens', 7, dataSet)
		D3_.addTitre(carte2svg_, carte2Layer3, polluant, nomTitre, 'pop2013', currentAnnee)
		D3_.activateZoomDrag(carte2Layer2, carte2Layer3, layerCible, fc)

		D3_.generateD3(carte3Layer2, fc, true, 'cercle', layerCible)
		//carte3Layer2.selectAll("path").data(toto,function(d){return d.Dcom}).exit().remove()
		D3_.generateBubble(carte3Layer2, fc, dataSet, polluant, layerCible);
		//D3_.generateD3(carte3Layer1, fc, true, 'init', layerCible)
		D3_.addTitre(carte3svg_, carte3Layer3, polluant, nomTitre,'pop2013',currentAnnee)
		//D3_.activateZoomDrag(carte3Layer2, carte3Layer3, layerCible, fc)
	});

	//Création du cadastre
	d3.selectAll("#map3 > svg > g > path").remove();//"#map3 > svg
	//d3.selectAll("svg > *").remove();
	//avec layer au lieu de container "#map3"
	//genere le perimetre
	try {
		//async, donc plus apres les autres, donc reset = true
		D3_.generateD3(layer3, obj, true, true, layerCible)
	} catch (e) {
		console.log(e);
	} finally {
	}
	//D3_.generateD3(layer3, obj, false, true, layerCible)
	//genere le contour des communes du perimetre
	D3_.generateD3(layer2, fc, true, 'communes', layerCible)

	var GnOrRd = {7 : ['#00aa00','#54c62a','#a9e254','#ffff7f','#ffaa54','#ff542a','#B2112C'] } //ff0000
	var options = {
		cadreTitre : svg_,
		cadre : svg,
		layerCadastre : layer1,
		layerComCom  : layer2,
		layerCom : layer3,
		layerCible : layerCible,
		polluant : polluant,
		currentAnnee : currentAnnee,
		nomTitre : nomTitre
	}
	D3_.createMapCadastre(layer3, com, GnOrRd, 7, options)
	//D3_.activateZoomDrag(layer1, layer2, layerCible, fc)
	//fin fonction CreateMap()
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// asynchronously load the template
$.get('js/handlebars/matable.hbs', function(source){
	template = Handlebars.compile(source);
	$('#nomPol').html(currentPol);
	$('#nomAnnee').html(currentAnnee);
})
$.get('js/handlebars/valeursRemarquable.hbs', function(source){
	template2 = Handlebars.compile(source);

	var html2 = template2();
	// insert the HTML into the page
	$('#remarquable').html(html2);/*
	tri : .sort(function(a, b) { return a - b; })
	5 derniers de l''array : _.takeRight(arr, 5);
	max : var b = arr.reduce(function(previous,current){
	return previous > current ? previous:current
});
sum : temp1.sousSecteurData.reduce(function (acc, obj) { return acc + obj.y; }, 0);
filter : temp1.sousSecteurData.filter(a=>a.y/but>0.1)
.slice(0,3)*/
})


//active les onglets des cartes d3
$(document).ready(function(){
	$("#myTab li:eq(0) a").tab('show');
});
//Dropdown menu
var arr =  ["CO2BIO","HCHO","NI","HAP","BBF","CO","FLUORA","C6H6","HCB","PM2_5","COBALT","HG","CD","AS","GES","PM10","BAP","PT","SB","PCDDF","BJF","CR3CR6","NO2","HCL","CR3","SE","BAA","ICDP","TOLUENE","CO2","SF6","DAHA","CU","CR","PB","TSP","STYRENE","CH4","ZN","CO2TOT","BAHA","HF","SOX","MN","NH3","COV","INDPY","NOX","CR6","BKF","PFC","N2O","V","PCB","BGHIPE","COVNM","XYLENE","HFC","SO2","PM1","BUTADIENE"
].sort();

var modd = []
for (pol in arr) {
	if(defautPol.indexOf(arr[pol])>=0){modd.push({ label:arr[pol] , title :  arr[pol],  value: arr[pol], selected : true})}
	else {modd.push({ label:arr[pol] , title :  arr[pol],  value: arr[pol]})}
}

$('#dropdown-polluants').multiselect({
	numberDisplayed: 10,
	onChange :  function(event) {
		var newArr = $('#dropdown-polluants').val()

		$('#choixPolUnique').empty().append(resetButton(newArr))
		//rebind les events
		$(".btn-group.polUnique button").click(
			actionChoixPol
		);
		//active les boutons sous forme de toggle
		$(".btn-group.polUnique > .btn").click(function(){
			$(".btn-group.polUnique > .btn").removeClass("active");
			$(this).addClass("active");
		});
	},
	onDropdownHide: function(event) {
		var newArr = $('#dropdown-polluants').val()
		defautPol = newArr;
		Graphs5.setGraph5(chart5, currentNumCom, defautPol, currentAnnee, currentName);
		Graphs.setGraph1(chart1, currentNumCom, defautPol, currentAnnee, currentName);
	}
});
$('#dropdown-polluants').multiselect('dataprovider', modd);
//maj de la barre de boutons "polluants"
function resetButton(defautPol){
	var htmlButton = '<div class="btn-group polUnique" id="group-button-polluants">'
	for (pol in defautPol) {
		if (defautPol[pol] == currentPol){
			htmlButton += '<button type="button" class="btn btn-primary myButton active">' + defautPol[pol] + '</button>'
		}
		else {
			htmlButton += '<button type="button" class="btn btn-primary myButton">' + defautPol[pol] + '</button>'
		}
	}
	return htmlButton
}
$('#choixPolUnique').empty().append(resetButton(defautPol))
//choix du polluant unique :
var actionChoixPol = function () {
	//alert(currentName)
	var polluant = $(this).text()
	currentPol = polluant
	Graphs2.setGraph2(chart2, currentNumCom, polluant, currentAnnee, currentName);
	//MajTableau(polluant, listeComLight, nomTitre, layerCible)
	//var layerCible = layerCible || 'commune'

	currentName = decodeURI(currentName).replace(/\%27/g, "'")
	//currentName = encodeURI(nom.replace(/'/g, "%27")) ;
	//alert(currentName)
	MajTableau(polluant, currentNumCom, currentName, layerCible, currentAnnee)
	majSousSecteurs(currentNumCom, polluant, currentAnnee,currentName);
	CreateMap(polluant, 'commune', obj, currentName, currentNumCom)
}

$(".btn-group.polUnique button").click(
	actionChoixPol
);
$(".btn-group.btn-annee button").click(function(){
	var annee = $(this).text()
	currentAnnee = annee
	currentLayer.fire('click');
});
$(".btn-group.color button").click(function(){
	var color = $(this).text()
	var ratio = $("ul#myTab li.active a").attr("href")==="#sectionA"?'Pop2013':'surf_km';
	var layer = $("ul#myTab li.active a").attr("href")==="#sectionA"?carte2Layer2:carte4Layer2;
	var colorPromise = $("ul#myTab li.active a").attr("href")==="#sectionA"?colorAsync2:colorAsync1;
	colorPromise.then(function(res) {
		//change la couleur
		res.range(Colorbrewer[color][7]);
		//applique la couleur à la carte
		layer.selectAll("path")
		.style("fill", function(d){
			//Discrétise les valeurs de polluant en fonction de la surf_km ou de la pop
			return res( d[currentPol] * 1000 / this.__data2__.properties[ratio])
		});
		layer.selectAll('g.legendEntry > rect')
		.data(res.range())
		.style("fill", function(d){return d;});
	});
});
$(".btn-group.circleColor button").click(function(){
	var color = $(this).css("background-color")
	d3.selectAll(".bubble").style("fill",color)
});


//active les boutons sous forme de toggle
$(".btn-group.polUnique > .btn").click(function(){
	$(".btn-group.polUnique > .btn").removeClass("active");
	$(this).addClass("active");
});
$(".btn-group.btn-annee > .btn").click(function(){
	$(".btn-group.btn-annee > .btn").removeClass("active");
	$(this).addClass("active");
});

$("button#submitPost").click(function(){
	$('#administration').modal('hide');
	ApiRequest.request3('POST', '/setup', $('form.contact').serialize())
	.then(function (e) {
		var result = JSON.parse(e.target.response);
		if (!result.success){
			$('#alert_message').removeClass("alert-success").addClass("alert-danger");
		} else {
			$('#alert_message').removeClass("alert-danger").addClass("alert-success");
		}
		$('#alert_message .message').html(result.message.toString())
		$('#alert_message').show();
	});
});
$("button#submitPut").click(function(){
	$('#administration').modal('hide');
	ApiRequest.request3('PUT', '/setup', $('form.contact').serialize())
	.then(function (e) {
		var result = JSON.parse(e.target.response);
		if (!result.success){
			$('#alert_message').removeClass("alert-success").addClass("alert-danger");
		} else {
			$('#alert_message').removeClass("alert-danger").addClass("alert-success");
		}
		$('#alert_message .message').html(result.message.toString())
		$('#alert_message').show();
	});
});
