function GraphsBuilder(options){
  this.options = options;
}

GraphsBuilder.prototype = {

  setGraph1 : function(chart,com,pol,annee,nom){
    //Bar charts
    //this.chart = chart
    var result = [] ;
    var options = {
      id : com,
      pol : pol,
      nom : nom
    }
    var id = options.id;
    options.annee = '2010';
    var url2010 = Url.getPolluantsParAnneeParCommunes(options);
    options.annee = '2012';
    options.id = id;
    var url2012 = Url.getPolluantsParAnneeParCommunes(options);

    ApiRequest.request2('GET', url2010)
    .then(function (e) {
      var result2010 = JSON.parse(e.target.response)
      result.push(result2010.data)
      return ApiRequest.request2('GET', url2012);
    })
    .then(function (e) {
      var result2012 = JSON.parse(e.target.response)
      result.push(result2012.data)
      //return result
      var data = Graphs.parseDataGraph1(result,decodeURI(nom).replace("%27","'"));
      chart1.destroy()
      chart1 = new Highcharts.Chart(data);
    })
  },
  setGraphToolTip : function(chart, com,pol,annee,nom){
    //Pie charts
    var options = {
      id : com,
      pol : pol,
      nom : nom,
      annee : annee
    }
    var url = Url.getSecteursParMaille(options)
    ApiRequest.request2('GET', url)
    .then(function (e) {
      var result = JSON.parse(e.target.response)
      var data = GraphsTooltip.parseDataGraph2(result.data,decodeURI(nom).replace("%27","'"));
      chartTooltip.destroy()
      chartTooltip = new Highcharts.Chart(data);
    })
  },
  setGraph2 : function(chart, com,pol,annee,nom){
    //Pie charts
    var options = {
      id : com,
      pol : pol,
      nom : nom,
      annee : annee
    }
    var url = Url.getSecteursParCommunes(options)
    ApiRequest.request2('GET', url)
    .then(function (e) {
      var result = JSON.parse(e.target.response)
      var data = Graphs2.parseDataGraph2(result.data,decodeURI(nom).replace("%27","'"));
      chart2.destroy()
      chart2 = new Highcharts.Chart(data);
    })
  },
  setGraph4 : function(chart, com,pol,annee,nom,secteur,container,chartId){
    //Mono Chrom Pie charts
    if (window[chartId]){
      try {
        window[chartId].destroy()
      } catch (e) {
        console.log('error !!');
      }
    }
    var options = {
      id : com,
      pol : pol,
      nom : nom,
      annee : annee,
      secteur : secteur
    }
    var url = Url.getSousSecteurParSecteurParPolluantParCommune(options)
    ApiRequest.request2('GET', url)
    .then(function (e) {
      try {
        var result = JSON.parse(e.target.response)
        var nom = decodeURI(options.nom).replace("%27","'")
        var data = Graphs4.parseDataGraph4(result.data,nom);
        //chart4.destroy()
        //chart4 = new Highcharts.Chart(data);
        data.chart.renderTo = container
        window[chartId] = new Highcharts.Chart(data);
      } catch (e) {
        //pas de données pour ce sous secteur
        console.log('erreur : pas de données pour ce sous secteur');
        var data = graphsConf.hcOptions4Default
        var nom = decodeURI(options.nom).replace("%27","'")
        var secteurs = {
          "AGRISY": {nom : 'Agriculture & sylviculture', color : "#90ee7e"},
          "INDUST":{nom : 'Industrie & traitement des déchets', color : "#DF5353"},
          "RETECI": {nom : 'Résidentiel & tertiaire', color : "#f28537" },//"#f7a35c"},
          "TROUTE": {nom : 'Transport routier', color : "#7798BF"},
          "TR_AUT": {nom : 'Transports autres que routier', color : "#aaeeee"},
          "EXTREN": {nom : 'Production & distribution d\'énergie', color : "#F4FA58"}
        }

        data.title.text = nom + '<br/>' + secteurs[options.secteur].nom + '<br/>' + options.pol + ' ' + options.annee ;
        data.chart.renderTo = container
        window[chartId] = new Highcharts.Chart(data);
        //document.getElementById(container).innerHTML = "error"
        //console.log(e);
      }
    })
  },
  setGraphBigPie : function (container, options) {

    var colors = Highcharts.getOptions().colors,
    // categories = [\"".$titresSecteurs."\"],
    // data = ".json_encode($data_comm_donut).",
    secteurData = [],
    sousSecteurData = [],
    i,
    j,
    drillDataLen,
    brightness;

    var secteurs = {
      "AGRISY": {nom : 'Agriculture & sylviculture', color : "#90ee7e"},
      "INDUST":{nom : 'Industrie & traitement des déchets', color : "#DF5353"},
      "RETECI": {nom : 'Résidentiel & tertiaire', color : "#f28537" },//"#f7a35c"},
      "TROUTE": {nom : 'Transport routier', color : "#7798BF"},
      "TR_AUT": {nom : 'Transports autres que routier', color : "#aaeeee"},
      "EXTREN": {nom : 'Production & distribution d\'énergie', color : "#F4FA58"}
    }
    var url = Url.getBigPie(options)
    ApiRequest.request2('GET', url)
    .then(function (e) {
      var result = JSON.parse(e.target.response)
      var data = result.data.data;
      var dataLen = data.length;
      var result = function (data) {
        // Build the data arrays
        for (i = 0; i < dataLen; i += 1) {
          // add secteurs data
          secteurData.push({
            name: data[i].drilldown.name,
            y: data[i].y,
            color: data[i].color
          });
          // add Sous-Secteur data
          drillDataLen = data[i].drilldown.data.length;
          for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            sousSecteurData.push({
              name: data[i].drilldown.categories[j],
              y: data[i].drilldown.data[j],
              color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
          }
        }
        return {
          secteurData : secteurData,
          sousSecteurData : sousSecteurData
        }
      }
      var result = result(data)
      var data = GraphsBigPie.options
      var nom = decodeURI(options.nom).replace("%27","'")
      data.chart.renderTo = container
      data.series[0].data = result.secteurData
      data.series[1].data = result.sousSecteurData
      data.title.text = 'Détail tous sous-secteurs cumulés<br/>' + nom + '<br/>' + options.pol + ' ' + options.annee
      chartBigPie.destroy()
      chartBigPie = new Highcharts.Chart(data);
    })
  },

  setGraph5 : function(chart, com,pol,annee,nom){
    //Stacked Bar Charts en pourcentage
    this.chart = chart
    var options = {
      id : com,
      pol : pol,
      nom : nom,
      annee : annee
    }
    var url = Url.getSecteursParPolluantParCommunes(options)
    ApiRequest.request2('GET', url)
    .then(function (e) {
      var result = JSON.parse(e.target.response)
      var data = Graphs5.parseDataGraph5(result.data,decodeURI(nom).replace("%27","'"));
      chart5.destroy()
      chart5 = new Highcharts.Chart(data);
      //d3.select(".highcharts-container > svg > g.highcharts-legend").attr('transform', 'translate(0,340)')
    })
  },
  parseDataGraph2 : function(data, nom) {
    //parseDataHighchartsPie
    var labels = ["AGRISY","EXTREN","RETECI","TROUTE","TR_AUT","INDUST"]; //"NON_FR","UTCF"
    var secteurs = {
      "AGRISY": {nom : 'Agriculture & sylviculture', color : "#90ee7e"},
      "INDUST":{nom : 'Industrie & traitement des déchets', color : "#DF5353"},
      "RETECI": {nom : 'Résidentiel & tertiaire', color : "#f28537" },//"#f7a35c"},
      "TROUTE": {nom : 'Transport routier', color : "#7798BF"},
      "TR_AUT": {nom : 'Transports autres que routier', color : "#aaeeee"},
      "EXTREN": {nom : 'Production & distribution d\'énergie', color : "#F4FA58"}
    }
    var datasets = [];
    //console.log(data);
    var annee = data.annee_ref;
    var series = [];

    for (var i = 0; i < labels.length; i++){
      var value = data[labels[i]]?data[labels[i]]:null;
      var output = {
        name : secteurs[labels[i]].nom,
        y : value
      }
      //console.log(output);
      series.push(output);
    }
    var nomPol = data.polluant;
    var datafinal = this.options;
    datafinal.title.text = nom + '<br/>' + nomPol + ' ' + annee ;
    datafinal.title.pol = nomPol //pour adapter unité
    //datafinal.xAxis.categories = labels;
    datafinal.series = [{data : series}];
    return datafinal
  },
  parseDataGraph4 : function (data,nom){
    //var parseDataHighchartsMonochrom = function(data,nom){//},listeSousSecteurs) {
    var secteurs = {
      "AGRISY": {nom : 'Agriculture & sylviculture', color : "#90ee7e"},
      "INDUST":{nom : 'Industrie & traitement des déchets', color : "#DF5353"},
      "RETECI": {nom : 'Résidentiel & tertiaire', color : "#f28537" },//"#f7a35c"},
      "TROUTE": {nom : 'Transport routier', color : "#7798BF"},
      "TR_AUT": {nom : 'Transports autres que routier', color : "#aaeeee"},
      "EXTREN": {nom : 'Production & distribution d\'énergie', color : "#F4FA58"}
    }
    var labels = data.liste_sousSecteurs
    var datasets = [];
    var annee = data.annee_ref;
    var series = [];

    for (var i = 0; i < labels.length; i++){
      var value = data[labels[i]]?data[labels[i]]:null;
      var output = {
        name : labels[i],
        y : value
      }
      series.push(output);
    }
    var nomSecten = data.secten_n1;
    var nomComplet = secteurs[data.secten_n1].nom
    var nomPol = data.polluant;

    var datafinal = this.options;
    datafinal.title.text = nom + '<br/>' + nomComplet + '<br/>' + nomPol + ' ' + annee ;
    datafinal.title.pol = nomPol //pour adapter unité
    datafinal.series = [{data : series}];

    //adapte la couleur au secteur:
    /*$couleurs = array( 4 => "#90ee7e", 2 =>"#F4FA58", 3 =>"#f7a35c", 5 =>"#7798BF", 6 =>"#aaeeee", 1 =>"#DF5353", 7 =>"#0B3B0B", 8 =>"#FE2EC8");
    //definitions des couleurs et ordre secteurs
    $secteurs = array(	4=> 'Agriculture, sylviculture et aquaculture hors UTCF',	//vert
    2=> 'Industrie manufacturière, traitement des déchets', //jaune
    3=> 'Résidentiel, tertiaire, commercial, institutionnel', //orange
    5=> 'Transport <br /> routier', //bleu
    6=> 'Modes de transports autres que routier', //bleu clair
    1 => "Extraction, transformation et distribution d'énergie", //rouge
    7=> 'Utilisation des Terres, leur Changement et la Forêt', //vert foncé
    8=> 'Emetteurs non inclus dans le total France'); //rose
    $titresSecteurs = 'Agriculture", "Industrie et traitement des déchets", "Résidentiel et tertiaire", "Transport routier", "Autres modes de transports", "Transf. et distrib. de l\'énergie", "UTCF", "Emetteurs hors France';
    */

    var colors = [];
    for ( var i = 0; i < labels.length; i ++) {
      // Start out with a darkened base color (negative brighten), and end
      // up with a much brighter color
      colors.push(Highcharts.Color(secteurs[data.secten_n1].color).brighten((i/2) / labels.length).get()); //brighten((i - 2) / 7).get());
    }
    datafinal.colors = colors
    return datafinal
  },
  parseDataGraph5 : function(data, nom) {
    //parseDataHighchartsStackedColumn(valueCom,nom);
    // => recuperer l'array du dropdown
    var labels = defautPol;
    var nomSecteur = {
      "AGRISY": 'Agriculture & sylviculture',
      "INDUST":'Industrie & traitement des déchets',
      "RETECI": 'Résidentiel & tertiaire',
      "TROUTE": 'Transport routier',
      "TR_AUT": 'Transports autres que routier',
      "EXTREN": 'Production & distribution d\'énergie'
    }
    var datasets = [];
    var i = 0;
    var ordreSecteur = ["AGRISY","EXTREN","RETECI","TROUTE","TR_AUT","INDUST"] //pour garder les meme couleurs
    for (secteur in ordreSecteur){
      var output = {
        name : nomSecteur[ordreSecteur[secteur]],
        // pas besoin : idcom : data[annee].numcom,
        data : []
      };
      for (line in data){
        if (ordreSecteur[secteur] == data[line].secten_n1){
          for (pol in labels){
            //labels[pol]=='CO2'?output.data.push(data[annee][labels[pol]]/1000):
            output.data.push(data[line][labels[pol]]);
          }
        }
        //output.backgroundColor = optColor[i];
      }
      datasets.push(output)
      i+=1
    }
    /*var datafinal = {
    title : nom,
    labels : labels,
    datasets : datasets
    }*/
    var annee = data[0].annee_ref;
    var nomfinal = nom + '<br> Année '+ annee
    var datafinal5 = this.options;
    datafinal5.title.text = nomfinal;
    datafinal5.xAxis.categories = labels;
    datafinal5.series = datasets;
    return datafinal5
  },
  parseDataGraph1 : function(data,nom){
    // => recuperer l'array du dropdown
    var labels = defautPol.slice();
    var datasets = [];
    var i = 0;
    for (annee in data){
      var output = {
        name : data[annee].annee_ref,
        idcom : data[annee].numcom,
        data : []
      };
      for (pol in defautPol){
        labels[pol]=='CO2'?output.data.push(data[annee][labels[pol]]/1000): //passe en kt
        labels[pol]=='GES'?(output.data.push(data[annee][labels[pol]]/1000),annee==1?labels[pol] += ' (en kt)':0): //passe en kt
        labels[pol]=='C6H6'?output.data.push(data[annee][labels[pol]]/1000): // passe en t
        output.data.push(data[annee][labels[pol]]);
      }
      //output.backgroundColor = optColor[i];
      datasets.push(output)
      i+=1
    }
    /*var datafinal = {
    title : nom,
    labels : labels,
    datasets : datasets
    }*/
    var nomfinal = nom
    var datafinal = this.options;
    datafinal.title.text = nomfinal;
    datafinal.xAxis.categories = labels;
    datafinal.series = datasets;
    return datafinal
  }
}

module.exports = GraphsBuilder;
