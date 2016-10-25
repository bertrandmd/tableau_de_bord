/**
 * Grid-light theme for Highcharts JS
 * @author Torstein Honsi
 */

// Load the fonts
Highcharts.createElement('link', {
	href: 'http://fonts.googleapis.com/css?family=Dosis:400,600',
	rel: 'stylesheet',
	type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
	
	
	
	colors: ["#90ee7e", "#F4FA58", "#f7a35c", "#7798BF",  "#aaeeee", "#DF5353", "#0B3B0B", "#FE2EC8", "#A4A4A4", "#0000FF", "#61210B"],
	chart: {
		backgroundColor: null,
		style: {
			fontFamily: "Dosis, sans-serif"
		}
	},
	title: {
		style: {
			fontSize: '14px',
			fontWeight: 'bold',
			textTransform: 'none'
		}
	},
	tooltip: {
		borderWidth: 0,
		backgroundColor: 'rgba(219,219,216,0.8)',
		shadow: true
		//yDecimals: 0 // If you want to add 2 decimals
	},
	lang: {
        decimalPoint: '.',
        thousandsSep: ' '
    },
	legend: {
		layout: 'vertical',
		itemStyle: {
			 fontSize:'9px',
			 font: '9pt Trebuchet MS, Verdana, sans-serif',
			 color: '#A0A0A0'
		},
		itemHoverStyle: {
			color: '#000'
		},
		itemHiddenStyle: {
			color: '#CACACA'
		}
	},
	xAxis: {
		gridLineWidth: 1,
		labels: {
			style: {
				fontSize: '12px'
			}
		}
	},
	yAxis: {
		minorTickInterval: 'auto',
		title: {
			style: {
				textTransform: 'uppercase'
			}
		},
		labels: {
			style: {
				fontSize: '12px'
			}
		}
	},
	plotOptions: {
		candlestick: {
			lineColor: '#404048'
		}
	},


	// General
	background2: '#F0F0EA'
	
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
