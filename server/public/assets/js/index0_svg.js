/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion du token d'autorisation de l'API inventaire.
var token = document.querySelector('meta[name="token"]')['content']
console.log(token);
var decoded = token !== 'public' ? jwt.decode(token) : undefined ;
if(decoded){
  if(decoded.droits && decoded.droits === '*'){
    //user admin
  }
  else {
  if (decoded.droits && decoded.droits.niveau1) {
    //User EPCI
    var listeNiveau1 = decoded.droits.niveau1.id
    $('#alert_template').append('<br/>Vos Droits : ')
    for (var i=0;i<listeNiveau1.length;i++){
      $('#alert_template').append('<span class="droits niveau1">' + listeNiveau1[i] + '</span>')
    }
  }
  var listeNiveau2 = decoded.droits.niveau2.id
  $('#alert_template').append('<br/>Vos Droits : ')
  for (var i=0;i<listeNiveau2.length;i++){
    if(i%16==0 && i!=0){  $('#alert_template').append('<br/>');}
    $('#alert_template').append('<span class="droits niveau2">' + listeNiveau2[i] + '</span>')
  }
  $('.droits.niveau1').on('click',function(e) {
    var code = parseInt(e.target.innerHTML)
    var data = _.toArray(map._layers)
    var layer = _.find(data,  {feature:{properties:{comcom: code}}});
    layer.fire('click');
  });
  $('.droits.niveau2').on('click',function(e) {
    var code = parseInt(e.target.innerHTML)
    var data = _.toArray(map._layers)
    var layer = _.find(data,  {feature:{properties:{Commune: code}}});
    layer.fire('click');
  });
}
}
//$('#alert_template').append('<br/>Token : ' + token)

//Surcharge de XHR pour intégrer le token au header
XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
// here "this" points to the XMLHttpRequest Object.
var newSend = function(vData) {
  this.setRequestHeader('x-access-token', token);
  this.realSend(vData);
};
XMLHttpRequest.prototype.send = newSend;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration des variables

//adresse du serveur API
var Url = new UrlBuilder('http://172.16.18.146:3001')


//var defautPol = ["NOX","PM10","PM2_5","CO2","CH4","N2O"];
var defautPol = ["NOX","TSP","PM10","PM2_5","GES"];
var currentPol = 'NOX'
var currentAnnee = '2012'
/*
//parametres courants :
var currentNumCom = '34172'
var currentName = 'Montpellier'
*/


//update click event sur graph1 ('crée les sous secteurs'):
var actionUser = function() {
  var com = currentNumCom;
  var pol = this.category==='GES (en kt)'?'GES':this.category;
  var annee = this.series.name;
  var nom = this.series.chart.title.textStr;
  Graphs2.setGraph2(chart2,com, pol, annee, nom);
  //setGraph2(com, 'NOX', '2012');
  //setGraph3(com, pol, annee, nom);
  majSousSecteurs(com,pol,annee,nom)
  /*  for (var i = 0; i < this.series.data.length; i++) {
        this.series.data[i].update({ color: '#ECB631' }, true, false);
    }
    this.update({ color: '#f00' }, true, false)*/
}


function filterData(data,arg,com) {
	function estEgal(element){
		return element[arg] == com;
	}
	var rep = data.filter(estEgal)
	console.log(rep[0]);
	return rep[0];
	/*if(rep[0]!==undefined){
		if(param === 'all'){return rep[0]}
		if(Array.isArray(param)){
			var newRep = {};
			for (val in param){
				//console.log(param[val]);
				var champ = param[val]
				newRep[champ] = rep[0][champ];
			}
			return newRep;
		}
		else {return rep[0][param]}
	}*/
}

graphsConf.hcOptions.plotOptions.series.point.events.click = actionUser

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

//secteur Pie tooltip
//var GraphsTooltip = new GraphsBuilder(graphsConf.hcOptions2)
//chartTooltip new Highcharts.Chart(graphsConf.hcOptions2);

//var histogram = Graphs.setGraph1(chart1, currentNumCom, defautPol, '2010', currentName)
//var pie = Graphs2.setGraph2(chart2, currentNumCom, defautPol[0], '2012', currentName)
//var monoChromPie = Graphs4.setGraph4(chart4, currentNumCom, defautPol[0], '2012', currentName,'TROUTE','container4','chart4')
//var stakedBar = Graphs5.setGraph5(chart5, currentNumCom, defautPol, '2012', currentName)
//d3.select(".highcharts-container > svg > g.highcharts-legend").attr('transform', 'translate(0,340)')

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


//majSousSecteurs(currentNumCom, currentPol, '2012',currentName);







//url building exemple
var tutu = Url.getSecteursParCommunes({
  id : '30001',
  pol : defautPol,
  annee : '2012',
  nom : 'Nimes'
})


//var bobi = Graphs.setGraph1(chart, '30001', defautPol, '2010', currentName)

//console.log(bobi);

function showData(data) {
	//console.log(data);
}

/*promise
toto = Promise_.promisify(Url.getSecteursParCommunes, Url);
toto2 = Promise_.promisifyAll(ApiRequest);
toto2.requestAsync(tutu, showData, 'yo')
.then(function (datums) {
  console.log(datums);
})
.catch(function (err) {
  console.error('Augh, there was an error!', err.statusText);
});
*/
/*
ApiRequest.request2('GET', tutu)
    .then(function (e) {

      var zgeg = JSON.parse(e.target.response);
    }, function (e) {
        // handle errors
    }).finally(console.log(zgeg.data))
    .catch(function (err) {
      console.error('Augh, there was an error!', err.statusText);
    })
    ;*/

/*
requestAsync(tutu, showData, 'mydata')
  .then("C'est bon !!");
*/


function MajTableau(polluant, listeComLight, nomTitre, layerCible, annee) {
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

  //rajout des ratios par entitées supérieures

  //url decode
  for (var i = 0; i < response.length ; i++ ){
    response[i].entite = decodeURI(response[i].entite).replace(/\%27/g, "'")
  }
  //response.id
  var data = {
      entites : response
    }
  console.log(data);
  var html = template(data);
  // insert the HTML into the page
  $('#matable').html(html);
  $('#nomPol').html(currentPol);
  $('#nomAnnee').html(currentAnnee);
});

//var addrTableau = Url.getTableauParEntite(options)
//ApiRequest.request(addrTableau, function(data){
  //var url = 'http://172.16.18.146:3001/cgi/getScale/' + polluant + '?cible=commune&ratio=surf_km&annee='+currentAnnee
  var url = "http://172.16.18.146:3001/api/getBigPie/"+listeComLight+"?id="+listeComLight+"&pol="+currentPol+"&annee=" + currentAnnee
  ApiRequest.request2('GET', url)
  .then(function (e) {
    var result = JSON.parse(e.target.response)
    console.log(result);
    var data = result.data.data

  var  secteurData = [],
   sousSecteurData = [],
   i,
   j,

   drillDataLen
  dataLen = data.length

  var result = function (data) {

     // Build the data arrays
     for (i = 0; i < dataLen; i += 1) {

         // add secteurs data
         secteurData.push({
             name: data[i].drilldown.name,
             y: data[i].y,
         });

         // add Sous-Secteur data
         drillDataLen = data[i].drilldown.data.length;
         for (j = 0; j < drillDataLen; j += 1) {
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

var result = result(data)

var data = result.sousSecteurData
var remarquable = function (data) {
  var sorted = data.sort(function(a, b) { return b.y - a.y; }) //reverse sort
  var val = sorted.slice(0,3)//on prend les 3 principales
  var sum = data.reduce(function (acc, obj) { return acc + obj.y; }, 0);
  console.log(val);
  console.log(sum);
  var rep = []
  for (var i =0; i<val.length;i++){
    rep.push({
      name : val[i].name,
      value : val[i].y,
      prct : val[i].y/sum*100
    })
  }
  console.log(rep);
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
  d3.selectAll("#map33 > svg > g > path").remove();


  //création de la choropleth
  d3.selectAll("#map32 > svg > g > path").remove();


  //genere le contour des communes du perimetre pour la deuxieme carte
  D3_.generateD3(carte2Layer2, fc, true, 'init', layerCible)

  D3_.generateD3(carte4Layer2, fc, true, 'init', layerCible)

  var url = Url.getPolluantparAnneeToutesCommunes({
      id : currentNumCom,
      pol : defautPol,
      nom : currentName,
      annee : currentAnnee
    })
    ApiRequest.request(url, function(data){
      var response = JSON.parse(data)
      //alert(data)
      toto = response.data
      for (i=0;i<toto.length;i++){toto[i].Dcom = toto[i].numcom};

///
      var url = 'http://172.16.18.146:3001/cgi/getScale/' + polluant + '?cible=commune&ratio=surf_km&annee='+currentAnnee
      ApiRequest.request2('GET', url)
      .then(function (e) {
        console.log(e.target.response);
        var result = JSON.parse(e.target.response).data
        console.log(result);
      tutu = toto

      //var bounds = [174,366,699,1230,2261,4741,22654]
      var bounds = result
      bounds.unshift(0)

      //D3_.generateD3(carte2Layer3, fc, true, 'init')

      //var applicationFunction = Promise_.promisify(D3_.generateChoropleth);

      function getUserDataAsync() {
          return new Promise(function(resolve, reject) {
              // Put all your code here, this section is throw-safe.
              //resolve(bob);
          });
      }


      colorAsync1 = new Promise(function(resolve, reject) {
      //generateChoropleth : function (layer, data, colorScale, polluant, nbClasses, bounds, ratio, nomTitre)
        var color = D3_.generateChoropleth(carte4Layer2, toto, 'Purples', polluant,  7, bounds, 'surf_km')
        resolve(color);
      })


      //alert(nomTitre)
      D3_.addTitre(carte4svg_, carte4Layer3, polluant, nomTitre, 'km2', currentAnnee)//km2
      })

///
      var url = 'http://172.16.18.146:3001/cgi/getScale/' + polluant + '?cible=commune&ratio=pop2013&annee='+currentAnnee
      ApiRequest.request2('GET', url)
      .then(function (e) {
        console.log(e.target.response);
        var result = JSON.parse(e.target.response).data
        console.log(result);
      tutu = toto

      //var bounds = [174,366,699,1230,2261,4741,22654]
      var bounds = result
      bounds.unshift(0)

      //D3_.generateD3(carte2Layer3, fc, true, 'init')
      //generateChoropleth : function (layer, data, colorScale, polluant, nbClasses, bounds, ratio, nomTitre)

      colorAsync2 = new Promise(function(resolve, reject) {
      //generateChoropleth : function (layer, data, colorScale, polluant, nbClasses, bounds, ratio, nomTitre)
        var color = D3_.generateChoropleth(carte2Layer2, toto, 'Greens', polluant,  7, bounds, 'Pop2013')
        resolve(color);
      })


      //D3_.generateChoropleth(carte2Layer2, toto, 'Greens', polluant,  7, bounds, 'Pop2013')
      //alert(nomTitre)
      D3_.addTitre(carte2svg_, carte2Layer3, polluant, nomTitre, 'pop2013',currentAnnee)//km2
      })
      .then(function (e) {
        D3_.generateD3(carte3Layer2, fc, true, 'init')
        //carte3Layer2.selectAll("path").data(toto,function(d){return d.Dcom}).exit().remove()
        D3_.generateBubble(carte3Layer2, fc, toto, polluant, layerCible);
        //D3_.generateD3(carte3Layer1, fc, true, 'init', layerCible)
        D3_.addTitre(carte3svg_, carte3Layer3, polluant, nomTitre,'pop2013',currentAnnee)

      });
  });

  //Création du cadastre
  d3.selectAll("#map3 > svg > g > path").remove();//"#map3 > svg
  //d3.selectAll("svg > *").remove();
  //avec layer au lieu de container "#map3"
  //genere le perimetre
  D3_.generateD3(layer3, obj, false, true, layerCible)
  //genere le contour des communes du perimetre
  D3_.generateD3(layer2, fc, false, true, layerCible)

  //cadastre
  GnOrRd = {7 : ['#00aa00','#54c62a','#a9e254','#ffff7f','#ffaa54','#ff542a','#B2112C'] } //ff0000

  var addrGrille = Url.getGrille(com, polluant)

  ApiRequest.request(addrGrille, function(data){
    var response = JSON.parse(data)
    var result = response.data.row_to_json
    window['cadastre'] = result
    var url = 'http://172.16.18.146:3001/cgi/getScale/' + polluant + '?cible=cadastre&annee='+currentAnnee
    ApiRequest.request2('GET', url)
    .then(function (e) {
      //le pollunat n est pas dans la table cadastre
      if (JSON.parse(e.target.response).data === null){
        D3_.addError(svg_, layer3, polluant, 'Ce polluant n\'est pas disponible sous forme de cadastre', 'km2')
        svg.selectAll('.place-label').remove()
      }
      else {
        var resultBounds = JSON.parse(e.target.response).data
        //var bounds = [ 0.181942945346236, 230, 972.04708385468, 2822.40190124512, 6888.70623397827, 15169.3244018555, 31067.2280197144, 612374.4192559814 ]
        var bounds = resultBounds
        bounds.unshift(0)
        D3_.generateD3(layer1, result, false, "cadastre", layerCible)
        D3_.choropleth(result, GnOrRd, polluant, 7, bounds, polluant)
        D3_.addTitre(svg_, layer3, polluant, nomTitre, 'km2',currentAnnee)

        console.log(d3.select("tooltip2"));
        if (document.getElementsByClassName('tooltipX').length == 1){
          //var parent = document.getElementById("body");
          var element = document.getElementsByClassName('tooltipX')[0]
          element.parentNode.removeChild(element)
      }
        // Define 'div' for tooltips
        var div = d3.select("body")
          .append("div")  // declare the tooltip div
          .attr("class", "tooltipX")              // apply the 'tooltip' class
          .style("opacity", 0)                 // set the opacity to nil
          .style('width', "200px")
          .style('height', "200px")
          .attr("id", "tooltip2")
//} else {var div = document.getElementsByClassName('tooltipX')[0]}

        layer1.selectAll("path")
        //.on("mouseout", function(d) {
        //div.style("opacity", 0)})
        // Tooltip stuff after this
	    .on("click", function(d) {
          //  div.transition()
				//.duration(500)
			//	.style("opacity", 0);
			div.transition()
				.duration(200)
				.style("opacity", .9)
		//	div	.html(
			//	'<a href= "http://google.com">' + // The first <a> tag
				//formatTime(d.date) +
			//	"</a>" +                          // closing </a> tag
			//	"<br/>"  + d.close)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY ) + "px");
      /*.on("click", function(d) {
          d3.select("map3").append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");
          var toto = svg.append("div")
          .attr("x", 15)
            .attr("id", "tooltip2")
            .style('width', "300px")
		.style('height', "300px")
    .text('pd')*/


/*
    .on("mouseover", function(){return tooltip.style("visibility", "visible");})
    .on("mousemove", function(){return tooltip.style("top",
        (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
*/
            var  parseData = function(data){
              var labels = ["AGRISY","EXTREN","RETECI","TROUTE","TR_AUT","INDUST"]; //"NON_FR","UTCF"
              console.log(data);
              var datasets = [];
                var series = [];

                for (var i = 0; i < labels.length; i++){
                  var value = data[labels[i]]?data[labels[i]]:null;
                  var output = {
                    name : labels[i],
                    y : value
                  }
                  //console.log(output);
                  series.push(output);
                }
                console.log(series);
                return series
              }

            var options = {
              id : d.properties.gid,
              pol : currentPol,
              annee : currentAnnee
            }
            var url = Url.getSecteursParMaille(options)
            ApiRequest.request2('GET', url)
            .then(function (e) {
              var result = JSON.parse(e.target.response)

              var res = parseData(result.data)

            chart = new Highcharts.Chart({
            chart : {
                renderTo: 'tooltip2',
                type: 'pie',
                width:200,
                height:200,
                //plotBackgroundColor: '#FCFFC5',
                zoomType: 'xy'
                },
                title: {
                text: 'Sur la maille : '
            },
            legend: {
             enabled: false
            }
            ,
            labels: {
                style: {
                color: '#4572A7'
                }
            },


        series:[{color: '#4572A7',data: res}]
      ,
      exporting: {
                  buttons: {
                      contextButton: {
                          enabled: false
                      },
                      customButton: {
                          text: 'X',
                          _titleKey: 'Fermer le graphique',
                          onclick: function() {
                              div.style("opacity", 0)
                          }
                      }
                  }
              }
    });


        })
      })
      }
    })
  })
//fin fonction CreateMap()
}

//map d3
//def generales:
var width = document.getElementsByClassName("row")[0].clientWidth,//800,
		height = 400,
		height_ = 75;

var test = d3.select("#mapTest").append("svg")
.attr("width", width)
.attr("height", height);

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

D3_.initD3(layer3);

//2e Carte :
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


//3e Carte :
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

//3e Carte :
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

//map leaflet

//style
var myStyle = {
		"weight": 1.5,
		"opacity": 1,
		"fillOpacity": 0.1
		};

//layers :
var communes = L.geoJson(null,{
	onEachFeature:onEachFeature,
	style:myStyle
});
//chargement asynchrone, pour être utilisé avec D3
L.Util.ajax("data/communes_wgs84.geojson").then(function(data){
		communes.addData(data);
		//generateD3(layer2, data, false, "init") //"#map3"
		window.lesCommunes = data;
    //doStuff(data);
    //init toutes les interactions en simulant un click sur le layer correspondant à Montpellier
    //map._layers[2637].fire('click');
}).then(function(){
    if (decoded){
      if(decoded.droits && decoded.droits === '*'){
        var data = _.toArray(map._layers)
        var randomId = _.random(0, data.length);
        var layer = data[randomId]
        layer.fire('click');
      } else if (decoded.droits && decoded.droits.niveau1){
        switch (decoded.droits.niveau1.type) {
          case 'epci':
          map.addLayer(comcom);
          var code = parseInt(decoded.droits.niveau1.id[0])
          var data = _.toArray(map._layers)
          var layer = _.find(data,  {feature:{properties:{comcom: code}}});
          layer.fire('click');
          break;
          case 'scot':
          map.addLayer(scot);
          var code = parseInt(decoded.droits.niveau1.id[0])
          var data = _.toArray(map._layers)
          var layer = _.find(data,  {feature:{properties:{ID_SCOT: code}}});
          layer.fire('click');
          break;
        }
      }
      else {
        var code = parseInt(decoded.droits.niveau2.id[0])
        var data = _.toArray(map._layers)
        var layer = _.find(data,  {feature:{properties:{Commune: code}}});
        layer.fire('click');
      }
      currentLayer = layer
    }
  });
var comcom2017 = L.geoJson.ajax("data/comcom_LR_2017.geojson",{ //"data/comcom_wgs84.geojson",{
	nom: "comcom2017",
	style: myStyle,
	onEachFeature:onEachFeature
});
var comcom = L.geoJson.ajax("data/comcom_wgs84.geojson",{
	nom: "comcom2016",
	style: myStyle,
	onEachFeature:onEachFeature
});
var scot = L.geoJson.ajax("data/scot_wgs84.geojson",{
	nom: "SCOT",
	style: myStyle,
	onEachFeature:onEachFeature
});
var dpt =  L.geoJson.ajax("data/departements_wgs84.geojson",{
	nom: "region",
	style: myStyle,
	onEachFeature:onEachFeature
});
var reg =  L.geoJson.ajax("data/region_wgs84.geojson",{
	nom: "region",
	style: myStyle,
	onEachFeature:onEachFeature
});
//layer de points pour jointures spatiales avec turf.js
//possibilité de le générer à la volée, mais prend trop de ressources
//donc à générer en amont (1 points par communes, le point devant être obligatoirement à l'intérieur du polygone de la commune (! : pas centroide))
var communesPoints = L.geoJson.ajax("data/communesPoints_wgs84.geojson",{
});
var overlayMaps = {
		"communes" : communes,
		"Com. de Com.": comcom,
    "Com. de Com. 2017": comcom2017,
    "SCOT" : scot,
		"Départements": dpt,
		"Région": reg
};
//Base Maps
var osm = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png');

//Info box
info = L.control().setPosition('topleft');
info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
};
info.update = function (props) {
		this._div.innerHTML =  (props ?
				'<b>' + props + '</b>'
				: '...');
};

//control layer :
var control = L.control.layers(overlayMaps,{}, {
		collapsed:false
});

//Initialisation de la map
var map = L.map('map', {
	//center: [43.58238046828168,3.900146484375],
	//zoom: 5
	layers : [osm,communes]
});
var center = [43.667871610117494,3.2684326171875]
map.setView(center, 8);
control.addTo(map)
info.addTo(map);

//interaction :
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click : onClick
  });
}
function highlightFeature(e) {
  var layer = e.target;
  //maj de l'infobox
  if (layer.feature.properties && layer.feature.properties.REGION_Nom){ var nom_entite = layer.feature.properties.REGION_Nom}
  else if (layer.feature.properties && layer.feature.properties.NOM){ var nom_entite = layer.feature.properties.NOM}
  else if (layer.feature.properties && layer.feature.properties.NomUU){ var nom_entite = layer.feature.properties.NomUU}
  else if (layer.feature.properties && layer.feature.properties.Nom){ var nom_entite = layer.feature.properties.Nom}
  else if (layer.feature.properties && layer.feature.properties.comcom_nom){ var nom_entite = layer.feature.properties.comcom_nom}
  else if (layer.feature.properties && layer.feature.properties.Dpt_Nom){ var nom_entite = layer.feature.properties.Dpt_Nom}
  else {var nom_entite = 'erreur'}
  info.update(nom_entite);
  //Style 'survol'
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
}
function resetHighlight(e) {
  var layer = e.target;
  //maj de l'infobox (sans paramètres)
  info.update();
  communes.resetStyle(e.target);
}

//Coeur de l'application, avec actions
function onClick(e) {
  $('#myModal').modal('hide');
  console.log(e);
  console.log(e.target.feature.properties);
  //recupere les properties depuis le geoJson
  var com = e.target.feature.properties.Commune
  var nom = e.target.feature.properties.Nom
  var pop2010 = e.target.feature.properties.Pop2010
  var pop2012 = e.target.feature.properties.Pop2012
  var surf = e.target.feature.properties.surf_km

  //Si le layer est différent de communes :
  if(
    e.target.feature.properties && e.target.feature.properties.comcom_nom ||
    e.target.feature.properties && e.target.feature.properties.NOM ||
    e.target.feature.properties && e.target.feature.properties.Dpt_Nom  && !e.target.feature.properties.Commune ||
    e.target.feature.properties && e.target.feature.properties.REGION_Nom){
    //
    var listeCom = []; //<-- {objet} communes du périmètre
    var listeComLight = []; //<-- code insee des communes du périmètre
    var comPoint = communesPoints.toGeoJSON();
    for (point in comPoint.features){
      if (turf.inside(comPoint.features[point],e.target.feature) == true){
        listeCom.push(turf.filter(lesCommunes,"Dcom", comPoint.features[point].properties.insee_com  ).features[0])
        //listeCom.push(comPoint.features[point]);// <-- recupere toutes les communes sous forme d'objet (plus lourd)
        listeComLight.push(comPoint.features[point].properties.insee_com);// <-- recupere que le code insee de la commune
      }
    }
    //console.log(listeComLight);
    //console.log(listeCom);
    com = listeComLight;
    //Recup du nom de l'entitée selon ses properties et fixe le layer cible
    //var layerCible;
    nom = e.target.feature.properties.comcom_nom? (layerCible = "comcom", e.target.feature.properties.comcom_nom)
      :e.target.feature.properties.Dpt_Nom? (layerCible = "dept", e.target.feature.properties.Dpt_Nom)
      :e.target.feature.properties.REGION_Nom? (layerCible = "region", e.target.feature.properties.REGION_Nom)
      :e.target.feature.properties.NOM? (layerCible = "comcom", e.target.feature.properties.NOM)
      :0;
    var nomTitre = nom
  } else {
    var communeSelection = turf.filter(lesCommunes,"Commune",com ).features[0]
    var listeCom = [communeSelection]
    var listeComLight = com
    var nomTitre = 'Commune de ' + nom
    console.log(listeCom);
    layerCible = "commune"
  }
  //var mesCommunes = filterData(mydata2010,"numcom",com);
  //alert(com)
  //maj des valeurs courantes => pour la maj via le dropdown (à améliorer)
  currentNumCom = com ;
  //pour gerer les single quote
  currentName = encodeURI(nom.replace(/'/g, "%27")) ;

  //currentName = encodeURI(currentName.replace(/ /g, "%20")) ;

  //recupere l'objet cliqué
  obj = e.target.feature;
  //console.log(JSON.stringify(obj));

  //rajout d'un identifiant pour d3
  for (i=0;i<listeCom.length;i++){listeCom[i].Dcom = listeCom[i].properties.Dcom};

   fc = turf.featurecollection(listeCom);
  //console.log(fc);
  //console.log(obj);

  //on modifie le titre de la page
 $('.title-zone').text(nomTitre)

  var polluant = currentPol
CreateMap(polluant, layerCible, obj, nomTitre, com)

MajTableau(polluant, listeComLight, decodeURI(currentName.replace("%27",/'/g)), layerCible, currentAnnee) //nomTitre



//secteurs :
Graphs.setGraph1(chart1, com, defautPol, currentAnnee, currentName);


//secteurs :
Graphs2.setGraph2(chart2, com, currentPol, currentAnnee, currentName);

//console.log(valueCom);
//setGraph3(com, 'NOX', '2012',nom);



Graphs5.setGraph5(chart5, com, defautPol, currentAnnee, currentName);

//setGraph4(com, 'NOX', '2012',nom,'AGRISY','container4','chart4');
//setGraph4(com, 'NOX', '2012',nom,'TROUTE','container5','chart5');
//setGraph4(com, 'NOX', '2012',nom,'RETECI','container6','chart6');
majSousSecteurs(com, currentPol, currentAnnee, currentName);


//var data2 = parseData2(commune2,nom);
//var data3 = parseData3(commune2,nom);
//console.log(data2);
//graph1.destroy()
//graph1 = createBar(ctx, data, options)
//graph2.destroy()
//graph2 = createRadar(ctx2, data2, options2)
//graph3.destroy()
//graph3 = createDonut(ctx3, data3, options2)
//majIndicateurs(commune2010,commune2012,pop2010,pop2012,surf,"NOX",nom)
currentLayer = e.target
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

$('#myModal').on('show.bs.modal', function(){
setTimeout(function() {
map.invalidateSize();
}, 10);
});
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
