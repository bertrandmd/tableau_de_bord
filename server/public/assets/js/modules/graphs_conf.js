var source = 'Source : AIR LR, Inventaire régional des émissions 2012v1'

//Highcharts
Highcharts.setOptions({
    lang: {
        decimalPoint: ',',
        thousandsSep: ' ',
				noData: "Données non disponibles pour ce secteur"
    },
    exporting: {
      csv : {itemDelimiter : ";"}
    }
});


var hcOptions = {
	chart: {
			type: 'column',
			renderTo: 'container'
	},
	legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'top',
  		y: 35//25
  },
	title: {
			text: ''
	},
  subtitle: {
  	text: source
  },
	xAxis: {
			categories: [],//listepolluants
			crosshair: true
	},
	yAxis: {
			min: 0,
			title: {
					text: 'Emissions totales (en T/an)'
			}
	},
	tooltip: {
		backgroundColor : '#fff',
  	shared: true,
		shape : 'callout',
  	formatter: function() {
			var unite = this.x == 'GES (en kt)' ? 'kTeqCO2' : 'T' ;
			if (!this.points[1]) {
				console.log(this.name);
				var tooltip = '<b>' + this.x + '</b>';
				tooltip += '<br/>' + Highcharts.numberFormat(this.y,2) + ' ' + unite + '/an';
				return tooltip
			}
			else {
	    	var s= this.points[1].y - this.points[0].y;
				var prct = s / this.points[0].y * 100
				var tooltip = '<b>' + this.x + '</b>';
				tooltip += '<br/>' + '<span style="color:' + this.points[0].series.color + ' ; font-weight: bold;">' + this.points[0].series.name +  '</span>' + ' : ' +  Highcharts.numberFormat(this.points[0].y,2) + ' ' + unite + '/an';
				tooltip += '<br/>' + '<span style="color:' + this.points[1].series.color + ' ; font-weight: bold;">' + this.points[1].series.name +  '</span>' + ' : ' +  Highcharts.numberFormat(this.points[1].y,2) + ' ' + unite + '/an';
				var ee = prct > 0 ? "+" : "" ;
				tooltip += '<br/> soit ' + ee  + Highcharts.numberFormat(prct, 1) + ' %';
	      return tooltip;
    	}
		}
  },
	/*
	tooltip: {
		valueDecimals: 0,
		valuePrefix: '',
		valueSuffix: ' t/an',//' t eqCO<sub>2</sub>/an en 2010 ',
		pointFormat: '{series.name} : <b> {point.y:.2f} </b> t/an'
	},*/
	plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: null /*function() {
													var com = currentNumCom;
													var pol = this.category==='GES (en kt)'?'GES':this.category;
													var annee = this.series.name;
													var nom = this.series.chart.title.textStr;
													Graphs2.setGraph2(com, pol, annee, nom);
													//setGraph2(com, 'NOX', '2012');
													//setGraph3(com, pol, annee, nom);
													majSousSecteurs(com,pol,annee,nom)
                          /*  for (var i = 0; i < this.series.data.length; i++) {
                                this.series.data[i].update({ color: '#ECB631' }, true, false);
                            }
                            this.update({ color: '#f00' }, true, false)*/
                        //}*/
                    }
                }
            },
						column: {
								events: {
									legendItemClick: function () {
										//console.log(this);
										//this.tooltipOptions.shared = false
										//this.tooltipOptions.formatter = null
										//return false; // <== returning false will cancel the default action
									}
								}
							}
        },
				credits: {
					text: '© AIR LR | highcharts.com ',
					href: 'http://www.air-lr.org',
					align: 'right'
				}
}
//Pie Graph
var hcOptions2 = {
	chart: {
			type: 'pie',
			renderTo: 'container2'
	},
	title: {
			text: ''
	},
  subtitle: {
  		text: source
  },
	legend: {
      //layout: 'horizontal',
      //align: 'center',
      //verticalAlign: 'top',
  		//y: 25,
			x : 10
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
    	showInLegend: true,
    	events: {
					legendItemClick: function () {
						return false; // <== returning false will cancel the default action
					}
				}
			}
  },
	tooltip: {
			    //pointFormat: '{point.percentage:.1f} % des émissions</b><br/>Soit {point.y:.2f} T/an'
					formatter: function() {
						var unite = this.series.chart.options.title.pol == 'GES' ? 'kTeqCO2' : 'T' ;
						var tooltip = '<b>' + this.key + '</b>';
						tooltip += '<br/>' + Highcharts.numberFormat(this.percentage, 1) + '% des émissions<br/>Soit ' + Highcharts.numberFormat(this.y, 2) + ' ' + unite + '/an'
						return tooltip
					}
			  },
				credits: {
					text: '© AIR LR | highcharts.com ',
					href: 'http://www.air-lr.org',
					align: 'right'
				}
}
//monochrom pie
// Make monochrome colors and set them as default for all pies
/*var colors = [],
i;
for (i = 0; i < 10; i += 1) {
	// Start out with a darkened base color (negative brighten), and end
  // up with a much brighter color
  colors.push(Highcharts.Color('".$couleurs[$secteur_id_pere]."').brighten((i - 2) / 7).get());
}

*/
var hcOptions4 = {
	chart: {
  	plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
		renderTo: 'container4'
	},
	//colors : ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  title: {
    text: ''
  },
  subtitle: {
    text: source
  },
	tooltip: {
			    //pointFormat: '{point.percentage:.1f} % des émissions</b><br/>Soit {point.y:.2f} T/an'
					formatter: function() {
						var unite = this.series.chart.options.title.pol == 'GES' ? 'kTeqCO2' : 'T' ;
						var tooltip = '<b>' + this.key + '</b>';
						tooltip += '<br/>' + Highcharts.numberFormat(this.percentage, 1) + '% des émissions<br/>Soit ' + Highcharts.numberFormat(this.y, 2) + ' ' + unite + '/an'
						return tooltip
					}
  },
  plotOptions: {
    pie: {
    	allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
	      enabled: true,
	      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	      style: {
	      	//color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	      }
  		},
			minSize : 180,
			size: 180
  	}
  },
	credits: {
		text: '© AIR LR | highcharts.com ',
		href: 'http://www.air-lr.org',
		align: 'right'
	}
}

var hcOptions4Default = {
	chart: {
    type: 'pie'
	},
	title: {
			text: ''
	},
  subtitle: {
    text: source
  },
	credits: {
		text: '© AIR LR | highcharts.com ',
		href: 'http://www.air-lr.org',
		align: 'right'
	}
}


//BigPie
var hcOptionsBigPie = {
  chart: {
		type: 'pie',
		renderTo : 'containerBigPie'
	},
	title: {
		text: ''
	},
	subtitle: {
		text: source
	},
	/*yAxis: {
		title: {
			text: 'Total percent market share'
		}
	},*/
	plotOptions: {
		pie: {
			shadow: false,
			center: ['50%', '50%'],
      showInLegend: true //active la legende
		}
	},
	tooltip: {
		formatter: function () {
		// display only if larger than 1
			return this.percentage > 1 ? '<b>' + this.point.name + ':</b> ' + Math.round(this.percentage) + '%' : null;
		}
	},
	series: [{
		name: 'Secteur',
		//data: browserData,
		size: '60%',
    dataLabels: {
      enabled: false //pas d'étiquette pour ce graph
    }/*,
		dataLabels: {
	 		style: {
				fontWeight: 'bold',
		 		textShadow: '0px 0px 6px black'
	 		},
			formatter: function () {
				return this.percentage > 1 ? this.point.name : null;
			},
			color: '#ffffff',
			distance: -40
		}*/
	},{
		name: 'Sous-Secteur',
		//data: versionsData,
		size: '80%',
		innerSize: '60%',
    showInLegend: false, //pas détaillé dans la légende
		dataLabels: {
			formatter: function () {
			// display only if larger than 1
				return this.percentage > 1 ? '<b>' + this.point.name + ':</b> ' + Math.round(this.percentage) + '%' : null;
			}
		}
	}],
 	credits: {
		text: '© AIR LR | highcharts.com ',
	 	href: 'http://www.air-lr.org',
	 	align: 'right'
	},
  legend: {
    layout: 'horizontal',//'vertical',
    reversed: false,
    width:400,
    itemWidth:100,
    itemStyle: {
      width:400
    }
  }
};


//Highcharts stack bar column percent
var hcOptions5 = {
				chart: {
					type: 'column',
					renderTo: 'container_bars_2',
    			alignTicks: false //bug 125%
				},
        title: {
            text: ''
        },
        subtitle: {
          text: source
        },
        xAxis: {
          categories: []
        },
				yAxis: {
					min: 0,
					max : 100,
					title: {
						text: 'Emissions 2012'//'En t eqCO<sub>2</sub>/An'
					}
				},
				tooltip: {
					valueDecimals: 0,
					valuePrefix: '',
					valueSuffix: ' t/an',//' t eqCO<sub>2</sub>/an en 2010 ',
					pointFormat: '{series.name} : <b> {point.y} </b> soit <b>{point.percentage:.1f}% </b>'
				},
				legend: {
					layout: 'horizontal',//'vertical',
					reversed: false,
					width:400,
        	itemWidth:200,
        	itemStyle: {
          	width:400
        	}
				},
				plotOptions: {
					series: {
						enabled:true,
						stacking: 'percent', //'normal',
						dataLabels: {
							enabled: true,
							align: 'right',
							x: 0,
							color: 'black',
							//format :'{point.percentage:.0f}%',
							style: { fontWeight: 'bold', paddingleft:'5px' },
							formatter: function() {
								if (this.percentage < 7 && this.x!='Lozère' ) {
									return null;
								} else if (this.x!='Lozère' ) {
									return Math.round(this.percentage)+'%';
								}
							}
						}
					},
					column: {
							events: {
								legendItemClick: function () {
									return false; // <== returning false will cancel the default action
								}
							}
						}

				},
				credits: {
					text: '© AIR LR | highcharts.com ',
					href: 'http://www.air-lr.org',
					align: 'right'
				}
				//,exporting: { enabled: false	}
			};

module.exports = {
  hcOptions : hcOptions,
  hcOptions2 : hcOptions2,
  hcOptions4 : hcOptions4,
  hcOptions5 : hcOptions5,
	hcOptions4Default : hcOptions4Default,
	hcOptionsBigPie: hcOptionsBigPie
}
