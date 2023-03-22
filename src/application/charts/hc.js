var yAxe = function(p){
	return {
		minPadding: 0,
		maxPadding: 0,
		offset: 10,
		//floor: true,
		title: {
			enabled: false,
			text: '',
			style: {
				'fontSize': 10 * p.sizeRatio + 'px',
				"color": "rgb(30, 35, 40)"
			}
		},
		startOfWeek : 0,
		lineWidth: 0,
		lineColor: 'transparent',
		minorTickLength: 0,
		minorGridLineWidth: 1,
		gridLineColor: "rgb(228, 221, 222)",
		gridLineWidth: 1,
		//tickInterval: 5,
		tickLength: 0,
		tickPixelInterval: 100 * p.sizeRatio,
		opposite: true,

		labels: {
			enabled: true,
			style: {
				'fontSize': 11 * p.sizeRatio + 'px',
				'color': "#27a9e6"
			},

			padding: 5 * p.sizeRatio,
			distance: -25 * p.sizeRatio,
			y: 3 * p.sizeRatio,

		},
							   
		tickColor: 'rgb(228, 221, 222)',
	}
}

var options = function(p){

	if(!p) p = {};

	if (p.print) p.sizeRatio = 4

		p.sizeRatio || (p.sizeRatio = 1)

	

	var options = {
		colors : [
			 
		],
		chart: {
			style: {
	         	fontFamily: "'Segoe UI', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif"
	      	},
			backgroundColor: 'transparent',
			spacing: [8 * p.sizeRatio, 8 * p.sizeRatio, 8 * p.sizeRatio, 8 * p.sizeRatio],
			type : 'spline'
			//
		},
		
	    rangeSelector: {
	        inputEnabled: false, 
	        selected: 3 // all
	    },
		title: {
			text: '',
			style : {
				fontSize : 18 * p.sizeRatio + 'px'
			}
		},
		subtitle: {
			text: ''
		},
		exporting: {
	        enabled: false
	    },
		xAxis: {
			crosshair: true,
			labels: {
				enabled: true,
				distance: 15 * p.sizeRatio,
				padding: 5 * p.sizeRatio,
				//step : 1 * p.sizeRatio,
				style: {
					'fontSize': 11 * p.sizeRatio + 'px',
					'color': "#27a9e6"
				}
			},
			lineWidth: 0,
			minorGridLineColor: 'transparent',
			minorGridLineWidth: 0,
			gridLineColor: "rgb(228, 221, 222)",
			gridLineWidth: 0,
			minorTickLength: 2 * p.sizeRatio,
			tickWidth: 1 * p.sizeRatio,
			tickColor: 'transparent',
			title: {
				enabled: false,
				text: 'Date',
				y: 10 * p.sizeRatio,
				style: {

					'fontSize': 10 * p.sizeRatio + 'px',
					"color": "rgb(30, 35, 40)"
				}
			},
			minPadding: 0.04,
			maxPadding: 0.04,
			offset: 20 * p.sizeRatio,
			tickPixelInterval: 100 * p.sizeRatio,
			
		},
		yAxis: [yAxe(p)],

		tooltip: {
			backgroundColor: "rgba(247,247,247,1)",
			crosshairs: true,
			
			shared: true,
			useHTML: true,
			style : {
				"zIndex" : '500',
			}
		},
		legend: {

			enabled : true,

			itemStyle: {
				'fontSize': 10 * p.sizeRatio + 'px',
				'font-weight': '500',
				"padding": 10 * p.sizeRatio

			},
			symbolHeight: 14 * p.sizeRatio,
			symbolWidth: 14 * p.sizeRatio,
			padding: 8 * p.sizeRatio,
			lineHeight: 16 * p.sizeRatio,
			margin: 24 * p.sizeRatio,
			symbolPadding: 2 * p.sizeRatio,
			itemDistance: 50 * p.sizeRatio,
			align: 'center',
			labelFormatter : function(){

				return this.name;

			}
			//enabled : false,
		},
		plotOptions: {
			bar: {
				dataLabels: {
					enabled: true
				},
				pointPadding : 0.1,
				groupPadding : 0.1,
				animation : false,

				borderColor : "rgba(52, 100, 166, 0.8)",
				color : "rgba(52, 100, 166, 0.3)",
			},
			pie : {
				size : '65%',
				dataLabels : {
					connectorWidth : 1 * p.sizeRatio,	
					distance :  10 * p.sizeRatio,	
					connectorPadding : 10 * p.sizeRatio,	
					padding : 10 * p.sizeRatio,
					style : {
						fontSize : 8 * p.sizeRatio + 'px'
					}
				}
			},
			column: {
				animation: false,
			},
			bubble : {
				animation: false,
				lineWidth : 0,
				minSize : '4%',
				maxSize : '10%',
				//softThreshold : true
			},
			columnrange: {
				animation: false,
				color : 'rgba(33,33,33, 0.3)',
				borderColor : 'transparent'
			},
			spline: {
				animation: false,
				lineWidth: 1 * p.sizeRatio,
				marker: {
					enabled: true,
					lineColor: 'transparent',
					radius: 2 * p.sizeRatio,
					//symbol: "circle",
					states: {
						hover: {
							lineWidthPlus: 0
						}
					}
				},
				states: {
					hover: {
						lineWidth: 1 * p.sizeRatio,

						lineWidthPlus: 0,
						marker: {
							fillColor: "#000",
							lineColor: "#000"
						},
						halo: {
							opacity: 0
						}
					},
					
				},
				dataLabels : {
					style : {
						fontSize : 10 * p.sizeRatio + 'px'
					}
				}
			},
			areaspline: {
				lineWidth: 1 * p.sizeRatio,

				marker: {
					enabled: true,
					lineColor: 'transparent',
					radius: 2 * p.sizeRatio,
					//symbol: "circle",
					states: {
						hover: {
							lineWidthPlus: 0
						}
					}
				},
				states: {
					hover: {
						lineWidth: 1 * p.sizeRatio,

						lineWidthPlus: 0,
						marker: {
							fillColor: "#000",
							lineColor: "#000"
						},
						halo: {
							opacity: 0
						}
					},			        			
				},
				dataLabels : {
					style : {
						fontSize : 10 * p.sizeRatio + 'px'
					}
				}
			},
			areasplinerange : {
				animation: false,
				fillOpacity : 0.2,
				dashStyle : 'dot',

				marker: {
					enabled: false,
					
				},
				
			},

			series : {
				marker : {}
			}

		},
		labels : {
			style : {
				fontSize : 8 * p.sizeRatio + 'px'
			}
		},
		credits: {
	    	enabled: false
	   	},

	   	navigation: { buttonOptions: { enabled: false } }
	}

	if (!p.print)
	{
		options.xAxis.title.style['font-weight'] = "700";
		options.yAxis[0].title.style['font-weight'] = "700";
		options.legend.itemStyle['font-weight'] = "700";
	}
	else
	{
		options.plotOptions.pie.size = '85%';
		options.legend.enabled = true;
		options.chart.backgroundColor = "#fff";
	}

	if(p.yAxisMultiple){
		options.yAxis.push(yAxe(p))
	}

	return options;

}

export default options