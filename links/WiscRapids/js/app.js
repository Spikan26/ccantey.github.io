$(document).ready(function () {

  $('.jquery').each(function() {
    eval($(this).html());
  });
   //initialize plug-ins
  $('select').selectBoxIt();

  // Evoluter jQuery-IU Color Picker https://github.com/evoluteur/colorpicker
  // The array of colors available in js/evol.colorpicker.js
  $('.color').colorpicker({
        color: '#ff6600',
        displayIndicator: false,
        history: false,
        showOn: 'button'
    });
    $('.color-button div div').append('<i class="icon-caret-down"></i>'); //  Add arrow	
	    // Native jQuery-IU Spinner

    $("#size").spinner({
        max: 10,
        min: 1
    });
	$('#tree').tree({
	  // collapseUiIcon: 'glyphicon glyphicon-star',
	  // expandUiIcon: 'glyphicon glyphicon-star'	  
    });
	
  $("#menu-close").click(function(e) {
     e.preventDefault();
     $('#menu-toggle').removeClass('tab');
	 $("#sidebar-wrapper").toggleClass("active");
	 $('#map-zoom-slider,.esriSimpleSlider,.foot').animate({ 'left': '10px' }, 500, 'easeOutQuad');
   });
 
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $('#menu-toggle').removeClass('notice');
    $("#sidebar-wrapper").toggleClass("active");
    $('#map-zoom-slider,.esriSimpleSlider,.foot').animate({ 'left': '360px' }, 500, 'easeInQuad');
  });

  $('.radioset').buttonset();
  $("#progressbar").hide();
  $('.results.multipleBuffer').hide();
  $('a[data-toggle="tooltip"]').tooltip();

  $(".overlayLayer").change(function () {   
	//var inputs = dojo.query(".overlayLayer");
	var inputs = dojo.query(".overlayLayer");
	var visible = [1,27,28,29]; //street and city labels
	for (var i = 0, il = inputs.length; i < il; i++) {
		var layerLabel = $(inputs[i]).find("label:first").html();  //To select labels to check, we must nest <label tag> in htm. and somehow select that nested label
		//console.log('layerLabel: ',layerLabel);
		var layerCheckState = $(inputs[i]).find("input:first");
		//console.log('layerCheckState: ',layerCheckState);
		var layerObject = objectFindByKey(globalMapLayers, 'name', layerLabel);
		//console.log('layerObject: ',layerObject);
		if ($(layerCheckState).prop("checked")) {
			visible.push(layerObject.id);			
			//console.log(layerObject.id);
		}
		else {
			$(layerCheckState).removeAttr("checked");
			var elem = $('li.current_sub').prevAll("checked:first");
			elem.removeClass("checked");
		}
	}

	overlayLayer.setVisibleLayers(visible);
	//legend.refresh();
  });

   $('.utilityLayer,.tree').change(function () {
      //var inputs = dojo.query(".utilityLayer");
	  var inputs = dojo.query(".utilityLayer");
      //console.log(inputs);
	  var visible = [-1];
	  for (var i = 0, il = inputs.length; i < il; i++) {
		var layerLabel = $(inputs[i]).find("label:first").html();
		//console.log('layerLabel: ',layerLabel);
		var layerCheckState = $(inputs[i]).find("input:first");
		//console.log('layerCheckState: ',layerCheckState);
		var layerObject = objectFindByKey(globalMapLayers, 'name', layerLabel);
		//console.log('layerObject: ',layerObject);
		if ($(layerCheckState).prop("checked")) {
			visible.push(layerObject.id);
			//console.log(layerObject.id);
			//console.log(visible);
		}
	}
	if (visible.length > 0) {
		utilityMap.setVisibleLayers(visible);		
	}
	else {
		utilityMap.setVisibleLayers([-1]);
		map.graphics.clear();
	}
	//legend.refresh();
    });	

    function objectFindByKey(array, key, value) {
        //alert(value);
        for (var i = 0; i < array.length; i++) {
		    //alert(array[i].name);
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }	

    //autocomplete
    $("#owner").autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "php/ownerSearch.php",
                dataType: "json",
                data: request,
                type: "GET",
                success: function (data) {
                    response(data);
                }
            });
        }
    });

    $("#addresses").autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "php/addressSearch.php",
                dataType: "json",
                data: request,
                type: "GET",
                success: function (data) {
                    response(data);
                }
            });
        }
    });

    $("#pid").autocomplete({
        minLength: 4,
        source: function (request, response) {
            $.ajax({
                url: "php/pidSearch.php",
                dataType: "json",
                data: request,
                type: "GET",
                success: function (data) {
                    response(data);
                    }
            });
        }
    });	
	
    // Tools Tab || navEvents
    $('#tools-tab,.btn-clear').click(function(){
       $('.dDot,.drawLine,.Extent').removeClass('ui-state-active');
    })

	$('#multiplePointSelector').click(function () { //multiple selections
		navEvent('point'); //select by point is the default operationToDo in the tabs section		
    });
	
    $('select#measureUnit').change(function () {
        measureUpdate(measureGeometry);
    });

    $('#toolsTab #measureLength').click(function () {
        $('#toolsTab #measureUnit').html('<option value="UNIT_FOOT">Feet</option><option value="UNIT_STATUTE_MILE">Miles</option>');
        $('#measureUnit').selectBoxIt('enable').selectBoxIt('refresh');
        navEvent('measureLine');
    });
    $('#toolsTab #measureArea').click(function () {
        $('#toolsTab #measureUnit').html('<option value="UNIT_SQUARE_FEET">Sq. Feet</option><option value="UNIT_ACRES">Acres</option><option value="UNIT_SQUARE_MILES">Sq. Miles</option>');
        $('#measureUnit').selectBoxIt('enable').selectBoxIt('refresh');
        navEvent('measurePolygon');
    });

    $('#toolsTab #drawPoint').click(function () {
        navEvent('point');
    });
    $('#toolsTab #drawLine').click(function () {
        navEvent('line');
    });
    $('#toolsTab #Extent').click(function () {
        navEvent('polygon');
    });

    $('#toolsTab #Buffer').click(function () {
        doBuffer();
        $('#search-tab a').removeClass('notice');
    });

    $('#toolsTab .btn-clear').click(function () {
        navEvent('tools clear');
    });
	
    // Draw Tab
    $('#drawTab .dText').click(function () {
        $('#drawTab .text-row').show();
        $('#drawTab .style-row').hide();
        navEvent('drawingText');
    });
    $('#drawTab .dPoint, #drawTab .dFreeLine, #drawTab .dFreePoly').click(function () {
        $('#drawTab .text-row').hide();
        $('#drawTab .style-row').show();
    });
    $('#drawTab #dPoint').click(function () {
        $('#drawTab #symbolOptions').html('<option value="STYLE_CIRCLE">CIRCLE</option><option value="STYLE_X">CROSS</option><option value="STYLE_DIAMOND">DIAMOND</option><option value="STYLE_SQUARE">SQUARE</option>');
        $('#symbolOptions').selectBoxIt('enable').selectBoxIt('refresh');
        navEvent('drawingPoint');
    });
    $('#drawTab #dFreeLine').click(function () {
        $('#drawTab #symbolOptions').html('<option value="STYLE_SOLID" selected="">SOLID</option><option value="STYLE_DASH">DASH</option><option value="STYLE_DASHDOTDOT">DASH DOT DOT</option><option value="STYLE_DOT">DOT</option>');
        $('#symbolOptions').selectBoxIt('enable').selectBoxIt('refresh');
        navEvent('drawingLine');
    });
    $('#drawTab #dFreePoly').click(function () {
        $('#drawTab #symbolOptions').html('<option value="STYLE_SOLID" selected="">SOLID</option><option value="STYLE_DIAGONAL_CROSS">CROSS HATCH</option><option value="STYLE_NULL">OUTLINE</option>');
        $('#symbolOptions').selectBoxIt('enable').selectBoxIt('refresh');
        navEvent('drawingPolygon');
    });
    $('#drawTab .btn-clear').click(function () {
        navEvent('clearDrawing');
    });
	$('#searchTab .btn-clear').click(function () {
        navEvent('clear');

    });	
	$('#layersTab .btn-clear').click(function () {
        navEvent('clear');
    });
	
	//Provide feedback for matched characters in autocomplete
    $.ui.autocomplete.prototype._renderItem = function( ul, item){
      var term = this.term.split(' ').join('|');
      var re = new RegExp("(" + term + ")", "gi") ;
      var t = item.label.replace(re,"<span style='color:#ff6600'>$1</span>");
      return $( "<li></li>" )
         .data( "item.autocomplete", item )
         .append( "<a>" + t + "</a>" )
         .appendTo( ul );
    };	
	
    // Print and Feature Forms
    $('#print').click(function() {
        if(printAreaGraphic != null){
            printAreaGraphic.hide();
            printAreaGraphic = null;
        }else{
            printAreaGraphic = null;
        }
        $('#print-box').toggle();
        //$('select').selectBoxIt('refresh');
        $(this).toggleClass('active');
    });

    $('#print-box .btn-secondary, #feature-box .btn-main').click(function () {
        $(this).closest('.form').hide();
        return false;
    });
    
    $('#btn-print').click(function () {
        printingLayoutMain();
        $(".progress-bar").animate({
           width: "80%"
           }, 2500);
        return false;
    });

    $('#btn-printArea').click(function () {
        viewPrintArea();
        return false;
    });		
	
	$('.mailOption').click(function () {
        $('#mailLabelBox').show();
    });
	
	$('#mailLabelBox .btn-close').click(function () {
        $('#mailLabelBox').hide();
    });
		
    $("#ownerMail").click(function () {
        $.post('outputs/mailLabelOwner.php', { q: mailParcels }, function (data) {
            var mailUrl = mailLink+"" + data;
            window.open(mailUrl, '_blank', 'width=600,height=600');
        });
    });

    $("#residentMail").click(function () {
        $.post('outputs/mailLabelResident.php', { q: mailParcels }, function (data) {
            var mailUrl = mailLink+"" + data;
            window.open(mailUrl, '_blank', 'width=600,height=600');
        });
    });

    $("#bothMail").click(function () {
        $.post('outputs/mailLabelBoth.php', { q: mailParcels }, function (data) {
            var mailUrl = mailLink+"" + data;
            window.open(mailUrl, '_blank', 'width=600,height=600');
        });
    });
	
    $("#search-tab").click(function () {
      $('#search-tab a').removeClass('notice');
    });	

}); //End $(document).ready()