  /**
       * Column names mapped to a style rule.
       * @type {Object}
       * @const
       */
    var tableid_state = '1i8nHdYi3atZfKiSvQtgNj5SkoZlmVDHOMmguT-N_';   
    var tableid_institution = '15m1sXehRhp2EtEUUlRRSXc-t8z5FSyE02Bl8yEjI';

    function addCommas(nStr) {
      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    }    
      
    $(document).ready(function(){
      $.colorbox({inline:true, href:".ajax", width:"300px"});
      $.ajax("https://www.googleapis.com/fusiontables/v1/tables/" + tableid_state + "/columns?key=AIzaSyCpHwlJzky3GlrccTkbttPb1DPkb2RXVRs",
      { dataType: "json" }
      ).done(function ( data ) {        
        var rows = data['items'];            
        for (var i in rows) {            
            if(i >3 && i < 8){
              var optionFrom = $('<option />').val(rows[i].name).text(rows[i].name);
              $("#selector").append(optionFrom);
              //console.log(rows[i].name)
            }
           }  
      });

      $.ajax("https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Carnegie FROM " + tableid_state + "&key=AIzaSyCpHwlJzky3GlrccTkbttPb1DPkb2RXVRs",
      { dataType: "json" }
      ).done(function ( data ) {
            var arrayCarnegieGHG = []; // array for building the selection menu   
            var rows = data['rows'];               
            for (var i in rows) {             
              arrayCarnegieGHG.push(rows[i][0])                                      
            }
            var uniqueArray = [];
              uniqueArray = arrayCarnegieGHG.filter(function(elem, pos) {
              return arrayCarnegieGHG.indexOf(elem) == pos;
            })
            uniqueArray.sort();
            $.each(uniqueArray, function( i, item ) {                    
              // add the carnegie category to the selection menu
              var optionFrom = $('<option />').val(item).text(item);
              $("#carnegieGHG").append(optionFrom);
            });      
      });  
      });
      var COLUMN_STYLES = {
        'Gross Emissions': [
          {
            'min': 1641,
            'max': 60000,
            'color': "#1a9641"
          },
          {
            'min': 60000,
            'max': 200000,
            'color': "#a6d96a"
          },
          {
            'min': 200000,
            'max': 400000,
            'color': "#ffffbf"
          },
          {
            'min': 400000,
            'max': 800000,
            'color': "#fdae61"
          },
          {
            'min': 800000,
            'max': 2000000,
            'color': "#d7191c"
          }
        ],
        'Change Gross Emissions': [
          {
            'min': -400000,
            'max': -100000,
            'color': "#1a9641"
          },
          {
            'min': -100000,
            'max': -25000,
            'color': "#a6d96a"
          },
          {
            'min': -25000,
            'max': 25000,
            'color': "#ffffbf"
          },
          {
            'min': 25000,
            'max': 100000,
            'color': "#fdae61"
          },
          {
            'min': 100000,
            'max': 500000,
            'color': "#d7191c"
          }

        ],
        'Change Gross Emissions/FTE': [
          {
            'min': -70,
            'max': -6,
            'color': "#1a9641"           
          },
          {
            'min': -6,
            'max': -2,
            'color': "#a6d96a"           
          },
          {
            'min': -2,
            'max': 2,
            'color': "#ffffbf"          
          },
           {
            'min': 2,
            'max': 4,
            'color': "#fdae61"
          },
          {
            'min': 4,
            'max': 7,
            'color': "#d7191c"
          }

        ],
        'Change Gross Emissions/sqft': [
          {
            'min': -180,
            'max': -10,
            'color': "#1a9641"  
          },
          {
            'min': -10,
            'max': -2,
            'color': "#a6d96a"
          },
          {
            'min': -2,
            'max': 2,
            'color': "#ffffbf" 
          },
          {
            'min': 2,
            'max': 10,
            'color': "#fdae61"
          },
          {
            'min': 10,
            'max': 150,
            'color': "#d7191c"
          }

        ]
      };
      
      var map, layer, layer_institution;

      function initialize() {
        map = new google.maps.Map(document.getElementById('main'), {
          center: new google.maps.LatLng(38,-98),
          zoom: 5,
          //mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          //mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
          zoomControl: true,
          zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL},
          //mapTypeId: maptype,
          streetViewControl: false,
          panControl: false,
          scaleControl: true
        });

        var style = [{"featureType": "all","stylers": [{"saturation": -100},{"gamma": 0.5}]}]
    
        var styledMapType = new google.maps.StyledMapType(style, {
          map: map,
          name: 'Styled Map'
        });
        
        map.mapTypes.set('map-style', styledMapType);
        map.setMapTypeId('map-style');           

        layer = new google.maps.FusionTablesLayer({
          query: {
            select: 'Gross Emissions',
            from: tableid_state,
            where: "'Carnegie' = 'All Schools'"
          },
           styles: [{
              where: "'Gross Emissions' < 60000 ", 
               polygonOptions: {
                  fillColor: '#1a9641',
                  fillOpacity: 0.8
              }},
              {where: "'Gross Emissions' > 60000 AND 'Gross Emissions' < 200000", 
               polygonOptions: {
                  fillColor: '#a6d96a',
                  fillOpacity: 0.8
              }},
              {where: "'Gross Emissions' > 200000 AND 'Gross Emissions' < 400000", 
               polygonOptions: {
                  fillColor: '#ffffbf',
                  fillOpacity: 0.8
              }},
              {where: "'Gross Emissions' > 400000 AND 'Gross Emissions' < 800000", 
               polygonOptions: {
                  fillColor: '#fdae61',
                  fillOpacity: 0.8
              }},
              {where: "'Gross Emissions' > 800000 AND 'Gross Emissions' < 2000000", 
               polygonOptions: {
                  fillColor: '#d7191c',
                  fillOpacity: 0.8
              }}   

            ]
 
        });

        layer.setMap(map);
               
        layer_institution = new google.maps.FusionTablesLayer({
          query: {
            select: 'Carnegie',
            from: tableid_institution,
            //where: "'Carnegie' = 'Assoc/Pub-R-L: Associate\\'s Public Rural-serving Large'"
          },
          styles:[{where: "'Gross Emissions < 60000'",markerOptions: {iconName: "grn_blank"}},
                   {where: "'Gross Emissions' > 60000 AND 'Gross Emissions' < 200000", markerOptions: {iconName: "ylw_blank"}},
                   {where: "'Gross Emissions' > 200000 AND 'Gross Emissions' < 400000", markerOptions: {iconName: "wht_blank"}},
                   {where: "'Gross Emissions' > 400000 AND 'Gross Emissions' < 800000", markerOptions: {iconName: "orange_blank"}},
                   {where: "'Gross Emissions' > 800000 AND 'Gross Emissions' < 2000000", markerOptions: {iconName: "red_blank"}}
            ]             
        });

        // layer_institution.setMap(map);
                        
        for (column in COLUMN_STYLES) {
          break;
        }       
        
        addLegend(map);        

        google.maps.event.addDomListener(document.getElementById('selector'),'change', function() {                                 
            applyStyle(map, layer, layer_institution, this.value);
            updateLegend(this.value);
        });

        google.maps.event.addDomListener(document.getElementById('carnegieGHG'),'change', function() {                          
              applyStyle(map, layer, layer_institution, document.getElementById('selector').value, this.value);                            
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {
          console.log(map.getZoom());
          if (map.getZoom() <= 5) {layer.setMap(map); layer_institution.setMap(null); document.getElementById("carnegieGHG").disabled = false;}
          else {layer.setMap(null); layer_institution.setMap(map); document.getElementById("carnegieGHG").disabled = true;}
        }); 

        google.maps.event.addListener(layer, 'click', function(e) {
          // Change the content of the InfoWindow
          e.infoWindowHtml = "State: " + e.row['STATE_NAME'].value + "<br>Number of Schools : " + addCommas(parseFloat(e.row['Schools_count'].value)) + "<br>Gross Emissions: " + addCommas(parseFloat(e.row['Gross Emissions'].value)) + "<br>Change Gross Emissions: " + addCommas(e.row['Change Gross Emissions'].value) 
          + "<br>Change Gross Emissions/FTE: " + addCommas(e.row['Change Gross Emissions/FTE'].value) + "<br>Change Gross Emissions/sqft: " + addCommas(parseFloat(e.row['Change Gross Emissions/sqft'].value));
          
        });

        google.maps.event.addListener(layer_institution, 'click', function(e) {
          // Change the content of the InfoWindow
          e.infoWindowHtml = "ACUPCC Signatory: " + e.row['ACUPCC'].value + "<br>Carnegie Classification: " + e.row['Carnegie'].value + "<br>Total Gross Emissions: " + addCommas(e.row['Gross Emissions'].value) + "<br>Change in Total Gross Emissions: " + addCommas(e.row['Change Gross Emissions'].value)  
          + "<br>Change in Total Gross Emissions/FTE: " + addCommas(e.row['Change Gross Emissions/FTE'].value) + "<br>Change in Total Gross Emissions/sqft: " + addCommas(parseFloat(e.row['Change Gross Emissions/sqft'].value))           
          + "<br>FTE Student Enrollment: " + addCommas(e.row['FTEStudent'].value) + "<br>Gross Sq Ft of Building Space: " + addCommas(parseFloat(e.row['GEsqft'].value))
          + "<br>Baseline GHG Report Year: " + e.row['BaselineYear'].value + "<br>Most Current GHG Report Year: " + e.row['MostYear'].value;          
        });
      }

      // Apply the style to the layer & generate corresponding legend
      function applyStyle(map, layer, layer_institution, column, row) {
        var columnStyle = COLUMN_STYLES[column];
        var styles = [];

        for (var i in columnStyle) {
          var style = columnStyle[i];
          styles.push({
            where: generateWhere(column, style.min, style.max),
            polygonOptions: {
              fillColor: style.color,
              fillOpacity: style.opacity ? style.opacity : 0.8
            }
          });          
        }
         
        var row = document.getElementById('carnegieGHG').value;      
        row = row.replace(/'/g, "\\'");
      
        layer.setOptions({
          query: {
            select: 'geometry',            
            from: tableid_state,
            where: "'Carnegie' = '" + row + "'"            
          }
        });

        layer.set('styles', styles);

        var pinGE = [{where: "'Gross Emissions < 60000'",markerOptions: {iconName: "grn_blank"}},
                   {where: "'Gross Emissions' > 60000 AND 'Gross Emissions' < 200000",markerOptions: {iconName: "ylw_blank"}},
                   {where: "'Gross Emissions' > 200000 AND 'Gross Emissions' < 400000",markerOptions: {iconName: "wht_blank"}},
                   {where: "'Gross Emissions' > 400000 AND 'Gross Emissions' < 800000",markerOptions: {iconName: "orange_blank"}},
                   {where: "'Gross Emissions' > 800000 AND 'Gross Emissions' < 2000000",markerOptions: {iconName: "red_blank"}}
                  ];

        var pinChangeGE = [{where: "'Change Gross Emissions < -100000'",markerOptions: {iconName: "grn_blank"}},
                   {where: "'Change Gross Emissions' > -100000 AND 'Change Gross Emissions' < -25000",markerOptions: {iconName: "ylw_blank"}},
                   {where: "'Change Gross Emissions' > -25000 AND 'Change Gross Emissions' < 25000",markerOptions: {iconName: "wht_blank"}},
                   {where: "'Change Gross Emissions' > 25000 AND 'Change Gross Emissions' < 100000",markerOptions: {iconName: "orange_blank"}},
                   {where: "'Change Gross Emissions' > 100000 AND 'Change Gross Emissions' < 500000",markerOptions: {iconName: "red_blank"}}
            ];          

        var pinChangeGEfte = [{where: "'Change Gross Emissions/FTE < -6'",markerOptions: {iconName: "grn_blank"}},
                   {where: "'Change Gross Emissions/FTE' > -6 AND 'Change Gross Emissions/FTE' < -2",markerOptions: {iconName: "ylw_blank"}},
                   {where: "'Change Gross Emissions/FTE' > -2 AND 'Change Gross Emissions/FTE' < 2",markerOptions: {iconName: "wht_blank"}},
                   {where: "'Change Gross Emissions/FTE' > 2 AND 'Change Gross Emissions/FTE' < 4",markerOptions: {iconName: "orange_blank"}},
                   {where: "'Change Gross Emissions/FTE' > 4 AND 'Change Gross Emissions/FTE' < 7",markerOptions: {iconName: "red_blank"}}
                  ];
        var pinChangeGEsqft = [{where: "'Change Gross Emissions/sqft < -10'",markerOptions: {iconName: "grn_blank"}},
                   {where: "'Change Gross Emissions/sqft' > -10 AND 'Change Gross Emissions/sqft' < -2",markerOptions: {iconName: "ylw_blank"}},
                   {where: "'Change Gross Emissions/sqft' > -2 AND 'Change Gross Emissions/sqft' < 2",markerOptions: {iconName: "wht_blank"}},
                   {where: "'Change Gross Emissions/sqft' > 2 AND 'Change Gross Emissions/sqft' < 10",markerOptions: {iconName: "orange_blank"}},
                   {where: "'Change Gross Emissions/sqft' > 10 AND 'Change Gross Emissions/sqft' < 150",markerOptions: {iconName: "red_blank"}}
                  ];

        layer_institution.setOptions({
          query: {
            select: 'Carnegie',
            from: tableid_institution
            //where: "'Carnegie' = '" + row + "'"  
          }        
        });

        if(column == 'Gross Emissions'){layer_institution.set('styles', pinGE);}
        else if(column == 'Change Gross Emissions'){layer_institution.set('styles', pinChangeGE);}
        else if(column == 'Change Gross Emissions/FTE'){layer_institution.set('styles', pinChangeGEfte);}
        else{layer_institution.set('styles', pinChangeGEsqft);} 
        

      }

      // Create the where clause
      function generateWhere(columnName, low, high) {
        var whereClause = [];
        whereClause.push("'");
        whereClause.push(columnName);
        whereClause.push("' >= ");
        whereClause.push(low);
        whereClause.push(" AND '");
        whereClause.push(columnName);
        whereClause.push("' < ");
        whereClause.push(high);        
        console.log(whereClause.join(''))
        return whereClause.join('');
      }

      // Initialize the legend
      function addLegend(map) {
        var legendWrapper = document.createElement('div');
        legendWrapper.id = 'legendWrapper';
        legendWrapper.index = 1;
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
            legendWrapper);
        legendContent(legendWrapper, column);
      }

      // Update the legend content
      function updateLegend(column) {
        var legendWrapper = document.getElementById('legendWrapper');
        var legend = document.getElementById('legend');
        legendWrapper.removeChild(legend);
        legendContent(legendWrapper, column);
      }

      // Generate the content for the legend
      function legendContent(legendWrapper, column) {
        var legend = document.createElement('div');
        legend.id = 'legend';

        var title = document.createElement('p');
        //title.innerHTML = column;
        //console.log(column)
        if(column == 'Change Gross Emissions' || column == 'Gross Emissions'){title.innerHTML = column + " (MTCO2e)"; legend.appendChild(title);}
        else if(column == 'Change Gross Emissions/FTE'){title.innerHTML = column + " (MTCO2e/FTE)"; legend.appendChild(title)}
        else{title.innerHTML = column + " (MTCO2e/sqft)"; legend.appendChild(title);}

        var columnStyle = COLUMN_STYLES[column];
        for (var i in columnStyle) {
          var style = columnStyle[i];

          var legendItem = document.createElement('div');

          var color = document.createElement('span');
          color.setAttribute('class', 'color');
          color.style.backgroundColor = style.color;
          legendItem.appendChild(color);

          var minMax = document.createElement('span');
          minMax.innerHTML = style.min + ' - ' + style.max;
          legendItem.appendChild(minMax);

          legend.appendChild(legendItem);
        }

        legendWrapper.appendChild(legend);
      }


      var infoSite = document.getElementById("infoSite");

      infoSite.onclick = function (){
        $.colorbox({html:'<a href="http://www.wesleyan.edu/" target="_blank">Wesleyan University</a> and <a href="http://www.secondnature.org/" target="_blank">Second Nature</a> have collaborated to create this map of the most recently reported data from schools participating in the American College & University Presidents\' Climate Commitment.<br><br>Zoom in for campus-level information. Use the info icon <i class="fa fa-info-circle fa-1x"></i> to read more about this project. School categories are determined by the <a href="http://classifications.carnegiefoundation.org" target="_blank">Carnegie Classification System</a>. For more detailed data, please contact <a href="http://www.secondnature.org/" target="_blank">Second Nature</a>. <br><br>Map conceptualized by <a href="http://mahaddad.faculty.wesleyan.edu/" target="_blank">Mary Alice Haddad</a> and built by Harvard University\'s <a href="http://gis.harvard.edu" target="_blank">Center for Geographic Analysis</a>.<br><br>Data is available for research purposes - contact: <a href="mailto:reporting@secondnature.org">reporting@secondnature.org</a>',width:"300px"});
      }
      /*
      downloadTable.onclick = function (){        
        window.location.href = 'http://cga-3.hmdc.harvard.edu/college/PR_Gross_Change_GHG_2014-07-03.xls';
      } 
      */
      google.maps.event.addDomListener(window, "resize", function() {
          var center = map.getCenter();
          google.maps.event.trigger(map, "resize");
          map.setCenter(center); 
        });
         
      
      google.maps.event.addDomListener(window, 'load', initialize);

       