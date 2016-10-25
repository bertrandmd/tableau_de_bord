//map leaflet
//utilise la valeur 'decoded' du token de connexion
(function () {
	var decoded = window.decoded || null

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
		console.log(decoded);
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
		else{console.log('error');}
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
	var info = L.control().setPosition('topleft');
	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};
	info.update = function (props) {
		this._div.innerHTML =  (
			props ? '<b>' + props + '</b>' : '...'
		);
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
		//console.log(e);
		//console.log(e.target.feature.properties);
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
			e.target.feature.properties && e.target.feature.properties.REGION_Nom
		){
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
			var nom = e.target.feature.properties.comcom_nom? (layerCible = "comcom", e.target.feature.properties.comcom_nom)
			:e.target.feature.properties.Dpt_Nom? (layerCible = "dept", e.target.feature.properties.Dpt_Nom)
			:e.target.feature.properties.REGION_Nom? (layerCible = "reg", e.target.feature.properties.REGION_Nom)
			:e.target.feature.properties.NOM? (layerCible = "scot", e.target.feature.properties.NOM)
			:0;
			var nomTitre = nom
		} else {
			var communeSelection = turf.filter(lesCommunes,"Commune",com ).features[0]
			var listeCom = [communeSelection]
			var listeComLight = com
			var nomTitre = 'Commune de ' + nom
			//console.log(listeCom);
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
		//variable globale
		fc = turf.featurecollection(listeCom);


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
	$('#myModal').on('show.bs.modal', function(){
		setTimeout(function() {
			map.invalidateSize();
		}, 10);
	});
	//rajout pour beneficier du scope de 'map'
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
}(window));
