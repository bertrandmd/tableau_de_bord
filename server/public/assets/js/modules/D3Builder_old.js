var D3Builder = {
  initD3 : function(layer){
    var text = svg_.append("text")
    .attr("class", "titre")
    .classed("carte1", true)
    .attr("x", width / 2)
    .style("text-anchor", "middle")
    .attr("y", 10)
    .attr("dy", "1.3em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "22px")
    .attr("fill", "black")
    //.style("text-decoration", "underline")
    .text("Cliquez sur un périmètre pour créer le cadastre");
  },
  generateD32 : function(layer, feature, reset, classe, layerCible){

    var classe = classe || "default";
    //classe === "cadastre" ? alert('yo'):0;
    //parametre pour fixer la projection
    var reset = reset || false;
    var path = d3.geo.path()
    .projection(null);
    var featureCollection = feature;
    var projection = d3.geo.mercator() //=Lambert
    //.scale(75000)
    .scale(1)
    .translate([0, 0]);
    //si reset = true
    if (reset){
      var bounds = d3.geo.bounds(featureCollection);
      var centerX = d3.sum(bounds, function(d) {return d[0];}) / 2,
      centerY = d3.sum(bounds, function(d) {return d[1];}) / 2;
      //.center([centerX, centerY])
      //.translate([width / 2, height / 2]);
      var path = d3.geo.path()
      .projection(projection);
      // Compute the bounds of a feature of interest, then derive scale & translate.
      var b = path.bounds(featureCollection),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
      // Update the projection to use computed scale & translate.
      projection
      .scale(s)
      .translate(t);
      //on les svg dans l'objet
      this.scale = s
      this.translate = t
    } else {
      var path = d3.geo.path()
      .projection(projection);
      projection
      //recupere les param precedents
      .scale(this.scale)
      .translate(this.translate);
    }


    //tooltip
    var focus = svg.append("g")
    .attr("class", "focus")
    .classed("tooltip",true)
    .style("display", "none");
    focus.append("text")
    .attr("x", 90)
    .attr("dy", ".35em");

    //si featurecollection ou juste un seul objet
    var data = featureCollection.type==="Feature"?[featureCollection]:featureCollection.features;

    //Création du layer
    var contour = layer.selectAll("path")
    //.data(featureCollection.features)
    .data(data)
    .enter().append("path")
    .attr("d", path)
    .attr("class", "feature")
    .attr("class", "contour_path")
    .classed(classe,true)
    .classed(layerCible,true)


    /*
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 25;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    tooltip.select("text").text("ee");
  });*/



  var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

  tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

  tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

  //.on("click", function(d){update(d)})
  /*
  .on("mouseover", function(d) {
  focus.select("text").text(d.properties.nox)
  focus.style("display", "inline");
  //focus.text(d3.event.pageX + ", " + d3.event.pageY)
  //.style("left", (d3.event.pageX - 34) + "px")
  //.style("top", (d3.event.pageY - 12) + "px");
  //focus.html(d)
  //.style("left", d3.select(this).attr("cx") + "px")
  //.style("top", d3.select(this).attr("cy") + "px");
})
.on("mouseout", function() { focus.style("display", "none"); })*/



var  parseData = function(data){
  //}, nom) {
  //parseDataHighchartsPie
  var labels = ["AGRISY","EXTREN","RETECI","TROUTE","TR_AUT","INDUST"]; //"NON_FR","UTCF"
  console.log(data);
  var datasets = [];
  //console.log(data);
  //var annee = data.annee_ref;

  /*	var output = {
  label : annee,
  data : []
};
var output = {
name : annee,
data : []
};
*/
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

/*
var nomPol = data.polluant;
//console.log(data.emi[annee][nomPol]);
//output.data = [data['AGRISY'],data['NON_FR'],data['RETECI'],data['TROUTE'],data['AUTREST'],data['INDUST']]
//datasets.push(output)
//i+=1

//datasets.pop()
/*var datafinal = {
title : nom + ' ' + nomPol + ' ' + annee,
labels : labels,
datasets : datasets
}
var datafinal = this.options;
datafinal.title.text = nom + ' ' + nomPol + ' ' + annee;
//datafinal.xAxis.categories = labels;
datafinal.series = [{data : series}];
//console.log(JSON.stringify(datafinal));
return datafinal
*/
var aa = {
  chart: {
    type: 'pie',
    renderTo: 'container2'
  },
  title: {
    text: ''
  },
  subtitle: {
    text: ''
  },
  legend: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'top',
    y: 25
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        color: '#000000',
        formatter: function() {
          return Highcharts.numberFormat(this.percentage, 1) + '%';//' | Record ID ' ;//+ this.point.name + '</b> | ' + Highcharts.numberFormat(this.y, 2);
        }
      },
      showInLegend: true
    }
  },
  credits: {
    text: '© AIR LR | highcharts.com ',
    href: 'http://www.air-lr.org',
    align: 'right'
  }
}

function zoomCityComm(d) {

  //var newdiv = document.createElement("div")
  //newdiv.id = "tooltip";
  //console.log(d);

  //Pie charts
  var options = {
    id : d.properties.gid,
    pol : 'NOX',
    annee : '2012'
  }
  var url = Url.getSecteursParMaille(options)
  ApiRequest.request2('GET', url)
  .then(function (e) {
    var result = JSON.parse(e.target.response)

    var res = parseData(result.data)

    chart = new Highcharts.Chart({
      chart : {
        renderTo: 'tooltip',
        type: 'pie',
        width:200,
        height:200,
        plotBackgroundColor: '#FCFFC5',
        zoomType: 'xy'
      },
      title: {
        text: "TOTO"
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
    });

    //var toto = document.getElementById("tooltip").outerHTML
    //console.log(toto)
    var tool = $('#tooltip .highcharts-container').html()
    return tool
  })
  return tool
}



var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function(d) {
  return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
})

/*
tip = d3.tip().attr('class', 'd3-tip').html(function(d) { //return "<span>" + d + "</span>" })//function(d) {
//Graphs2.setGraph2(chart2, com, currentPol, '2012', currentName);
//Graphs2.setGraph2(chart2, d.properties.gid, 'NOX', '2012');
//return d.properties.gid
//return JSON.stringify(d);
zoomCityComm(d)

});*/
//layer.call(tip)

layer.selectAll("path")
.on('mouseover', function(d){
  tip.show
  //console.log(d);

})
.on('mouseout', tip.hide)

var t = projection.translate(); // the projection's default translation
var s = projection.scale() // the projection's default scale

function redraw() {
  // d3.event.translate (an array) stores the current translation from the parent SVG element
  // t (an array) stores the projection's default translation
  // we add the x and y vales in each array to determine the projection's new translation
  var tx = t[0] * d3.event.scale + d3.event.translate[0];
  var ty = t[1] * d3.event.scale + d3.event.translate[1];
  projection.translate([tx, ty]);

  // now we determine the projection's new scale, but there's a problem:
  // the map doesn't 'zoom onto the mouse point'
  projection.scale(s * d3.event.scale);

  // redraw the map
  contour.selectAll("path").attr("d", path);

  // redraw the x axis
  //xAxis.attr("x1", tx).attr("x2", tx);

  // redraw the y axis
  //yAxis.attr("y1", ty).attr("y2", ty);
}

var drag = d3.behavior.drag()
.origin(function(d) { return d; })
.on("dragstart", dragstarted)
.on("drag", dragged)
.on("dragend", dragended);

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

layer.call(d3.behavior.zoom().on("zoom", redraw));

/*
//tooltip
layer.selectAll("path")
//.on("click", function(d){update(d)})
.on("mouseover", function(d) {
//focus.select("text").text(d.properties.nox)
//focus.style("display", "inline");
var selected = d3.select(this)
selected.style('stroke-width', 2);
})
.on("mouseout", function() {
var selected = d3.select(this)
selected.style('stroke-width', 1);
//focus.style("display", "none");
})
;
*/
//this.projection = projection
//carte3Layer2

//si layer de communes :
if(layer == carte2Layer2 ){
  D3Builder.placeLabels(featureCollection, path, carte2Layer3, layerCible)
}
else if (layer == carte3Layer2 ){
  //bubbleMap, les labels sont déjà ajoutés dans la fonction.
}
else if (layer == carte4Layer2 ){
  D3Builder.placeLabels(featureCollection, path, carte4Layer3, layerCible)
}
else {
  D3Builder.placeLabels(featureCollection, path, layer3, layerCible)
}
//}
//	});
},
generateChoropleth : function (layer, data, colorScale, polluant, nbClasses, bounds, ratio) {
  var rampColor = Colorbrewer[colorScale] ;
  var color = D3Builder.defColor(rampColor, nbClasses, bounds);

  layer.selectAll("path")
  //copy les anciens parametres pour garder la pop et la surf_km de l'objet
  .property("__data2__", function(d){ return d; } )
  .data(data,function(d){
    //bind les data sur la propriété Dcom (code insee)
    return d.Dcom
  })
  .enter()

  layer.selectAll("path")
  .style("fill", function(d){
    //Discrétise les valeurs de polluant en fonction de la surf_km ou de la pop
    return color( d[polluant] * 1000 / this.__data2__.properties[ratio])
  });
  D3Builder.createLegend(layer, bounds, polluant, color)
  return color
},
generateBubble : function (layer, fc, data, polluant, layerCible) {

  layer.selectAll("path")
  //.style("fill", "fff");

  //Etablir la valeur max de la série
  var values = []
  for (var i = 0;i<data.length;i++){
    values.push( data[i][polluant] * 1000 )
  }
  var max = d3.max(values);

  var radius = d3.scale.sqrt()
  //min-max des valeurs de la serie
  .domain([0, max])
  //taille min-max en pixel
  .range([0, 40]);

  //fonction pour trier les valeurs
  function keysrt(key) {
    return function(a,b){
      if (a[key] < b[key]) return 1;
      if (a[key] > b[key]) return -1;
      return 0;
    }
  }

  var featureCollection = fc
  var bounds = d3.geo.bounds(featureCollection);
  var centerX = d3.sum(bounds, function(d) {return d[0];}) / 2,
  centerY = d3.sum(bounds, function(d) {return d[1];}) / 2;

  var projection = d3.geo.mercator()//=Lambert
  //on recupère le scale fixé précedemment
  .scale(this.scale)
  .center([centerX, centerY])
  //fixer les valeurs par rapport à la taille de la fenetre d3, sinon bug (?)
  .translate([document.getElementsByClassName("row")[0].clientWidth / 2, 400 / 2]); //800

  var path = d3.geo.path()
  .projection(projection);

  layer.append("g")
  .attr("class", "bubble")
  .selectAll("circle")
  .data(featureCollection.features)//.sort(function(a, b) { return b.properties.data_SCOT_SO2 - a.properties.data_SCOT_SO2; }))
  .enter().append("circle")
  .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })

  d3.selectAll("circle")
  //bind les data sur la propriété Dcom (code insee)
  .data(data,function(d){return d.Dcom}).exit().remove()

  d3.selectAll("circle")
  .attr("r", function(d) {
    //fixe la taille du cercle sur la valeur du polluant
    return radius( d[polluant] * 1000 );
  })
  .sort(keysrt(polluant));

  var legend = layer.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + (width - 100) + "," + (height - 30) + ")")
  .selectAll("g")
  //fixe le nombre de cercles de la légende
  .data([max,max/2,max/10])
  .enter().append("g");

  legend.append("circle")
  .attr("cy", function(d) { return -radius(d); })
  .attr("class", "bubble")
  .classed("legend",true)
  .attr("r", radius);

  legend.append("text")
  .attr("y", function(d) { return -2 * radius(d); })
  .attr("dy", "1.6em")//"1.3em")
  .text(d3.format("f")); //.2s .2f

  //bind tooltip
  // Define 'div' for tooltips
  if (document.getElementsByClassName('tooltipBubble').length == 1){
    //var parent = document.getElementById("body");
    var element = document.getElementsByClassName('tooltipBubble')[0]
    element.parentNode.removeChild(element)
  }
  var div = d3.select("body")
  .append("div")  // declare the tooltip div
  .attr("class", "tooltipBubble")              // apply the 'tooltip' class
  .style("opacity", 0)                 // set the opacity to nil
  .style('width', "200px")
  .style('height', "200px")

  format = d3.format("0f")
  var tip = d3.tip()
    .attr('class', 'tooltipBubble')
    //.classed("tooltipChoropleth", true)
    .style('width', "100px")
    .style('height', "50px")
    .style('text-align', 'left')
    .style('background-color', 'lightgrey')
    .offset([-10, 0])
    .html(function(d) {
      //console.log(this.__data2__);
      return 'Emissions : <br/><span>' + format(d[polluant]*1000) + ' kg/an</span>' ;
      /*+ this.__data2__.properties.Nom + '</strong></h6>'
      + '<br/>Emissions : <span>' +format(d[polluant])+ ' T/an</span>'
      + '<br/>Soit : <span>' +format(d[polluant]/this.__data2__.properties.Pop2013*1000) + ' kg/hab/an</span>'
      + '<br/>Soit : <span>' +format(d[polluant]/this.__data2__.properties.surf_km*1000) + ' kg/km2/an</span>';*/
    })
    d3.selectAll("circle").call(tip)
    d3.selectAll("circle")
      .on('mouseover',tip.show)
      .on('mouseout', tip.hide)


  D3Builder.placeLabels(featureCollection, path, carte3Layer3, layerCible)

},
placeLabels : function(featureCollection, path, layer, layerCible){
  // Place and label location
  var foci = [],
  labels = [];

  //fixe un nombre max de communes en fonction de layerCible sur la pop
  var min = layerCible !== "comcom" ? (layerCible !== "commune" ? 10000 : 1 ) : 1 ;
  //fc : la featurecollection des com selectionnees
  //met les nom des communes si la featurecollection contient le nom des communes (couches communes)
  if (featureCollection.features && featureCollection.features[0].properties.Nom){
    //active l'option 'draggable'
    var drag = d3.behavior.drag()
    .on('dragstart', function(d) {
      force.stop();
      //d.attr('x',d.x)
      //console.log(d);})//circle.style('fill', 'red'); })
    })
    .on('drag', function(d) {
      d3.select(this).attr('x', d3.event.x)
      .attr('y', d3.event.y); })
      ;//.on('dragend', function() { circle.style('fill', 'black'); });

      // Store the projected coordinates of the places for the foci and the labels
      //featureCollection.features.forEach(function(d, i) {
      featureCollection.features.forEach(function(d, i) {
        if(d.properties.Pop2013 > min){
          var c = path.centroid(d)
          foci.push({x: c[0], y: c[1]});
          labels.push({x: c[0], y: c[1], label: d.properties.Nom})
        }
      });

      // Create the force layout with a slightly weak charge
      var force = d3.layout.force()
      .nodes(labels)
      .charge(-5)
      .gravity(0)
      .size([width, height]);

      // Append the place labels, setting their initial positions to
      // the feature's centroid
      layer.selectAll('.place-label').remove()
      var placeLabels = layer.selectAll('.place-label')
      .data(labels)
      .enter()
      .append('text')
      .attr('id', function(d){ return d.label})
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .attr('r', function(d) { return d.r; })
      .call(drag)
      .attr('class', 'place-label')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('text-anchor', 'middle')
      //.style('font-size','2')
      .text(function(d) { return d.label; });

      force.on("tick", function(e) {
        var k = .1 * e.alpha;
        labels.forEach(function(o, j) {
          // The change in the position is proportional to the distance
          // between the label and the corresponding place (foci)
          o.y += (foci[j].y - o.y) * k;
          o.x += (foci[j].x - o.x) * k;
        });

        // Update the position of the text element
        layer.selectAll("text.place-label")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
      });

      force.start();

    }
  },
  defColor : function(couleur, nbClasses, breaks){
    var nbClasses = nbClasses || 6;
    var color = d3.scale.threshold()
    .domain(breaks.slice(1))
    //.range(colorbrewer.Oranges[5]);
    .range(couleur[nbClasses]);
    return color
  },
  //Classification de Jenks de turf.js (équivalent de Fisher-Jenks)
  //=> on ne l'utilise pas !
  jenksBreaks : function(collection, pol, nbBreaks) {
    var breaks = turf.jenks(collection, pol, nbBreaks);
    breaks[nbBreaks]=breaks[nbBreaks]+0.01;
    //var breaks = [ 0.181942945346236, 230, 972.04708385468, 2822.40190124512, 6888.70623397827, 15169.3244018555, 31067.2280197144, 612374.4192559814 ]
    return breaks
  },
  //Création du cadastre function (layer, data, colorScale, polluant, nbClasses, bounds, ratio)
  choropleth : function(data, colorScale, polluant, nbClasses, bounds, nomPol){
    //Rq : ancienne fonction calculant directement les breaks avec turf.js :
    //function(collection, pol, nbBreaks, nomPol){
    //On n'utilise pas ce qui suit, mais le script python en CGI sur le serveur node
    //var breaks = D3Builder.jenksBreaks(collection, pol, nbBreaks)
    var breaks = bounds

    var rampColor = colorScale

    var color = D3Builder.defColor(rampColor, nbClasses, breaks)

    d3.selectAll(".cadastre").style("fill", function(d) {
      //renvoit la valeur de polluant
      return color( d.properties[polluant]); })
      //svg.selectAll('g.legendEntry').remove()
      D3Builder.createLegend(svg, breaks, nomPol, color)
    },
    createLegend : function(layer, breaks, pol, color) {


      //remove old
      layer.selectAll('g.legendEntry').remove()

      var legend = layer.selectAll('g.legendEntry')
      .data(color.range())//.reverse())
      .enter()
      .append('g').attr('class', 'legendEntry');

      legend.append('rect')
      .attr("x", width - 160)
      .attr("y", function(d, i) {
        return (height - 150) + i * 18;
      })
      .attr("width", 20)
      .attr("height", 12)
      //.style("stroke", "black")
      //.style("stroke-width", 1)
      .style("fill", function(d){return d;});
      //the data objects are the fill colors

      legend.append('text')
      .attr('class', 'legend')
      .attr("x", width - 90) //leave 5 pixel space after the <rect>
      .attr("y", function(d, i) {
        return (height - 150) + i * 18;
      })
      .attr("dy", "0.8em") //place text one line *below* the x,y point
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text(function(d,i) {
        var extent = color.invertExtent(d)
        //extent will be a two-element array, format it however you want:
        if (pol == "BaP" || pol == "Pb"  || pol == "Cd" || pol == "As" || pol == "Ni") {var format = d3.format("0f");}
        else {
          var format = d3.format("f")
        }

        //var format = d3.format("0.1f")
        if (pol == "CO2"){
          if (i==0) { return format(breaks[0]/1000) + " - " + format(extent[1]/1000);}
          else { return format(+extent[0]/1000) + " - " + format(+extent[1]/1000);}
        } else {
          if (i==0) { return format(breaks[0]) + " - " + format(extent[1]);}
          else { return format(+extent[0]) + " - " + format(+extent[1]);}
        }
      });

    },
    addError : function(cadre, layer, pol, nom, type){

      svg.selectAll('g.legendEntry').remove()
      d3.selectAll(".carte1.titre").remove()
      svg.selectAll('.place-label').remove()
      svg.selectAll('.rectangle').remove()

      var pol = pol.replace('_','')
      var titre = "Cadastre des émissions de "
      titre += pol ;
      var text = cadre.append("text")
      var textLabels = text
      .attr("class", "titre")
      .classed("carte1",true)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .attr("y", 10)
      .attr("dy", "1.3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "22px")
      .attr("fill", "black")
      .style("text-decoration", "underline")
      .text(titre);
      var text_suite = layer.append("text")//layer1.append("text") //g.append("text")
      var textLabels = text_suite
      .attr("class", "titre")
      .classed("carte1",true)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .attr("y", 100)//height / 2) //10)
      .attr("dy", "3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "18px")
      .attr("fill", "black")
      //.style("text-decoration", "underline")
      .text(nom)
    },
    addTitre : function(cadre, layer, pol, nom, type, annee){

      var pol = pol.replace('_','')

      //var type = type || "km2";

      var classe = cadre === svg_ ? "carte1" : cadre === carte2svg_ ? "carte2" : cadre == carte3svg_ ?  "carte3" : cadre == carte4svg_ ?  "carte4" : "error"

      var titre = cadre === svg_ ?
      (d3.selectAll(".carte1.titre").remove(),
      "Cadastre des émissions de ")
      : cadre === carte2svg_ ?
      (d3.selectAll(".carte2.titre").remove(),
      "Emissions de ")
      : cadre == carte3svg_ ?
      (d3.selectAll(".carte3.titre").remove(),
      "Emissions de ")
      : cadre == carte4svg_ ?
      (d3.selectAll(".carte4.titre").remove(),
      "Emissions de ")
      : "error";

      //cadre legende
      var rectangle = layer.append("rect")
      .attr('class', 'rectangle')
      .attr("x", width - 170)
      .attr("y", height - 210)
      .attr("width", 140)
      .attr("height", 210)
      .classed("contour", true)
      //.attr("class", "contour");

      //titre principal

      var text = cadre.append("text")
      //var text = layer1.append("text") //g.append("text")
      if (type=="km2") {precision = "par km²"; precisionLegende = "km²"}
      else if (type == "pop2010" || type == "pop2012" || type == "pop2013"){precision = "par habitant" ; precisionLegende = "hab"}
      else { precisionLegende = ""}

      //if (pol == "BENZ" || pol == "Pb"  || pol == "Cd" || pol == "As" || pol == "Ni" || pol ==  "PM25") { pol = nompol[pol]; if (pol == "Benzène" || pol == "Cadmium"){svg.select("rect").attr("width", 160).attr("x", width - 180); }}


      //titre final:
      //si bubblemap pas de precision
      titre += cadre == carte3svg_ ? pol : pol + " " + precision ;
      if(precisionLegende!=="") precisionLegende += "/" ;

      var textLabels = text
      .attr("class", "titre")
      .classed(classe,true)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .attr("y", 10)
      .attr("dy", "1.3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "22px")
      .attr("fill", "black")
      .style("text-decoration", "underline")
      .text(titre);//titre + pol + " " + precision); //cadre !== carte3svg_ ? precision : precision );

      var text_suite = cadre.append("text")//layer1.append("text") //g.append("text")
      var textLabels = text_suite
      .attr("class", "titre")
      .classed(classe,true)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .attr("y", 10)
      .attr("dy", "3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "18px")
      .attr("fill", "black")
      .style("text-decoration", "underline")
      //.text("Territoire du SCOT Cœur d'Hérault");
      .text(nom)

      var text2 = layer.append("text") //g.append("text")
      var text2Labels = text2
      .attr("class", "titre")
      .classed(classe,true)
      .attr("x", width - 170 + 70) //+moitié du rectangle
      .attr("y", height - 210)
      .style("text-anchor", "middle")
      .attr("dy", "1.3em")
      //.attr("dx", "1.3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "black")
      .style("font-weight", "bold")
      .text("Emissions de " + pol);

      var text3 = layer.append("text") //g.append("text")
      var text3Labels = text3
      .attr("class", "titre")
      .classed(classe,true)
      .classed("anneeRef",true)
      .attr("x", width - 170 + 70) //+moitié du rectangle
      .attr("y", height - 210)
      .style("text-anchor", "middle")
      .attr("dy", "2.8em")
      //.attr("dx", "3.3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .text("année "+ annee);

      var text4 = layer.append("text") //g.append("text")
      var text4Labels = text4
      .attr("class", "titre")
      .classed(classe,true)
      .attr("x", width - 170 + 70) //+moitié du rectangle
      .attr("y", height - 210)
      .style("text-anchor", "middle")
      .attr("dy", "4.3em")
      //.attr("dx", "3.3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .text(function(d) {
        if (pol == 'CO2'){return "t/" + precisionLegende + "an";}
        else if (pol == 'GES') { return "en TeqCO2/"+ precisionLegende +"/an"}
        else if (pol == 'Plomb' || pol == 'Cadmium' || pol == 'Arsenic' || pol == 'Nickel' || pol == 'BaP') { return "en g/" + precisionLegende + "an"}
        else { return "en kg/" + precisionLegende + "an";}}
      );

      var text5 = layer.append("text") //g.append("text")
      var text5Labels = text5
      .attr("class", "titre")
      .classed(classe,true)
      .attr("x", width - 170)
      .attr("y", height - 20)
      .attr("dy", "0.8em")
      .attr("dx", "0.3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("font-style", "italic")
      .text("Source : AIR LR 2016");

      var text6 = layer.append("text")
      .text("Inventaire a2012v1")
      .attr("class", "titre")
      .classed(classe,true)
      .attr("x", width - 170)
      .attr("y", height - 10)
      .attr("dy", "0.8em")
      .attr("dx", "0.3em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("font-style", "italic")
    },
    createMapChoropleth : function(layerCible, polluant, ratio, rampColor, nbClasses, dataSet){
        var ratio = ratio==='Pop2013'?'pop2013':ratio;
        var url = 'http://172.16.18.146:3001/cgi/getScale/' + polluant + '?cible=commune&ratio=' + ratio + '&annee='+ currentAnnee
        ApiRequest.request2('GET', url)
        .then(function (e) {
          var result = JSON.parse(e.target.response).data
          var bounds = result
          bounds.unshift(0)
          var last = bounds.length - 1
          bounds[last] ++
        if(ratio=='pop2013'){
          colorAsync2 = new Promise(function(resolve, reject) {
            //generateChoropleth : function (layer, data, colorScale, polluant, nbClasses, bounds, ratio, nomTitre)
            var color = D3_.generateChoropleth(layerCible, dataSet, rampColor, polluant, nbClasses, bounds, "Pop2013")
            resolve(color);
          })
        }
        else {
          colorAsync1 = new Promise(function(resolve, reject) {
            //generateChoropleth : function (layer, data, colorScale, polluant, nbClasses, bounds, ratio, nomTitre)
            var color = D3_.generateChoropleth(layerCible, dataSet, rampColor, polluant, nbClasses, bounds, ratio)
            resolve(color);
          })
        }
        //bind tooltip
        // Define 'div' for tooltips
        if (document.getElementsByClassName('tooltipChoropleth').length == 1){
          //var parent = document.getElementById("body");
          var element = document.getElementsByClassName('tooltipChoropleth')[0]
          element.parentNode.removeChild(element)
        }
        var div = d3.select("body")
        .append("div")  // declare the tooltip div
        .attr("class", "tooltipChoropleth")              // apply the 'tooltip' class
        .style("opacity", 0)                 // set the opacity to nil
        .style('width', "200px")
        .style('height', "200px")

        format = d3.format("0f")
        var tip = d3.tip()
          .attr('class', 'tooltipChoropleth')
          //.classed("tooltipChoropleth", true)
          .style('width', "200px")
          .style('height', "100px")
          .style('text-align', 'left')
          .style('background-color', 'lightgrey')
          .offset([-10, 0])
          .html(function(d) {
            //console.log(this.__data2__);
            return '<h6>Commune de : <strong>' + this.__data2__.properties.Nom + '</strong></h6>'
            + '<br/>Emissions : <span>' +format(d[polluant])+ ' T/an</span>'
            + '<br/>Soit : <span>' +format(d[polluant]/this.__data2__.properties.Pop2013*1000) + ' kg/hab/an</span>'
            + '<br/>Soit : <span>' +format(d[polluant]/this.__data2__.properties.surf_km*1000) + ' kg/km2/an</span>';
          })
          layerCible.selectAll('path').call(tip)
          layerCible.selectAll('path')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
        })

    },
    activateZoomDrag : function(layer, labelLayer, layerCible, fc){
      var select = layer.selectAll("path")
      //drag
      function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
      }
      function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      }
      function dragended(d) {
        d3.select(this).classed("dragging", false);
      }
      var drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", dragstarted)
      .on("drag", dragged)
      .on("dragend", dragended);
      //zoom
      var zoom = d3.behavior.zoom().on("zoom", function() {
        select.attr("transform", "translate(" + d3.event.translate + ")" +
        "scale(" + d3.event.scale + ")");
        //modify labels
        var label = labelLayer.selectAll('.place-label')
        label.attr("transform", "translate(" + d3.event.translate + ")" +
        "scale(" + d3.event.scale + ")");
        //modify bubble
        var bubble = layer.selectAll('.bubble:not(.legend)')
        bubble.attr("transform", "translate(" + d3.event.translate + ")"); //+
        //"scale(" + d3.event.scale + ")");
        //var bubblelegend = layer.selectAll('.bubble.legend')
        //bubblelegend.attr("transform", "scale(" + d3.event.scale + ")");
      });
      select.call(zoom);
      select.call(drag);
    },
    generateD3 : function(layer, feature, reset, classe, layerCible){

      var classe = classe || "default";
      //classe === "cadastre" ? alert('yo'):0;
      //parametre pour fixer la projection
      var reset = reset || false;
      var path = d3.geo.path()
      .projection(null);
      var featureCollection = feature;
      var projection = d3.geo.mercator() //=Lambert
      //.scale(75000)
      .scale(1)
      .translate([0, 0]);
      //si reset = true
      if (reset){
        var bounds = d3.geo.bounds(featureCollection);
        var centerX = d3.sum(bounds, function(d) {return d[0];}) / 2,
        centerY = d3.sum(bounds, function(d) {return d[1];}) / 2;
        //.center([centerX, centerY])
        //.translate([width / 2, height / 2]);
        var path = d3.geo.path()
        .projection(projection);
        // Compute the bounds of a feature of interest, then derive scale & translate.
        var b = path.bounds(featureCollection),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        // Update the projection to use computed scale & translate.
        projection
        .scale(s)
        .translate(t);
        //on les svg dans l'objet
        this.scale = s
        this.translate = t
      } else {
        var path = d3.geo.path()
        .projection(projection);
        projection
        //recupere les param precedents
        .scale(this.scale)
        .translate(this.translate);
      }
      //si featurecollection ou juste un seul objet
      var data = featureCollection.type==="Feature"?[featureCollection]:featureCollection.features;

      //Création du layer
      var contour = layer.selectAll("path")
      //.data(featureCollection.features)
      .data(data)
      .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .attr("class", "contour_path")
      .classed(classe,true)
      .classed(layerCible,true)


      //si layer de communes :
      if(layer == carte2Layer2 ){
        D3Builder.placeLabels(featureCollection, path, carte2Layer3, layerCible)
      }
      else if (layer == carte3Layer2 ){
        //bubbleMap, les labels sont déjà ajoutés dans la fonction.
      }
      else if (layer == carte4Layer2 ){
        D3Builder.placeLabels(featureCollection, path, carte4Layer3, layerCible)
      }
      else {
        D3Builder.placeLabels(featureCollection, path, layer3, layerCible)
      }
      return layer

  }
  }
  module.exports = D3Builder;
