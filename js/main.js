(function () {

	"use strict";

	var WIDTH_THRESHOLD = 768;
	var TRANSITION_DURATION = 400; // 0.2 seconds actual transition + 200 wait time.
	var ZOOM_THRESHOLD = 5;
	var LISTCONTAINER_CLASS_UP = "table-up";

	var GLOBAL_CLASS_DETAILS = "state-details";
	var GLOBAL_CLASS_USETOUCH = "touch";

	var IMAGE_HOME_BUTTON = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTAgNTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwIDUwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6IzAxMDEwMTt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjQ5LDI2LjUgMjQuOCwyLjcgMSwyNi41IDkuOSwyNi41IDkuOSw0Ny4zIDIwLjgsNDcuMyAyMC44LDMzLjkgMjkuMiwzMy45IDI5LjIsNDcuMyA0MC4xLDQ3LjMgNDAuMSwyNi41ICIvPjwvc3ZnPg";

	//var DRUPAL_URL =  "../data/stories.json";
	//var DRUPAL_URL = "https://1001stories.org/1001-Stories-Map/data/stories.json";
	var DRUPAL_URL = "https://annawoorim.github.io/1001-Stories/data/stories.json";
	var HILLSHADE_SERVICE_URL = "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/";
	//var VECTOR_BASEMAP_ID = "fc3fec26b9ef44ae95674eed0a4a92ff";
	//var VECTOR_BASEMAP_ID = "c31ed4252c0c438891547d2e2137e9f1";
	//var VECTOR_BASEMAP_ID = "434c254967ca485e9639fb0a8950cf91";
	var VECTOR_BASEMAP_ID = "4ac10098d1524d268aec03ac4c041c97";

	var URL_ROUTE_WALKING = "https://media.nationalgeographic.org/ooew/mapobjects/combined_simplified_500m_to_jaipur_walking.geojson";
	var URL_ROUTE_MOTORIZED = "https://media.nationalgeographic.org/ooew/mapobjects/combined_simplified_500m_to_jaipur_motorized.geojson";

	var _map;
	var _layerMarkers;
	var _layerDots;
	var _table;

	var _records;	
	var _selected;

	$(document).ready(function() {
		_map = new L.Map(
			"map", 
			{zoomControl: !L.Browser.mobile, attributionControl: false, maxZoom: 12, minZoom: 2, worldCopyJump: true}
		)
			.addLayer(L.esri.Vector.basemap("Topographic"))	
			//.addLayer(L.esri.tiledMapLayer({url: HILLSHADE_SERVICE_URL, opacity: 0.2}))
			.addControl(L.control.attribution({position: 'bottomleft'}))
			.on("click", onMapClick)
			.on("zoomend", onZoomEnd)
			.on("moveend", onExtentChange);

		$("<img>").attr("id", "map-logo").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXgAAADCCAYAAABDu9kBAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAACxMAAAsTAQCanBgAAAX/aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNy0wMi0xNVQwOTo1OTozMy0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMTEtMDFUMTE6MzY6NTgtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTEtMDFUMTE6MzY6NTgtMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iQWRvYmUgUkdCICgxOTk4KSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNDg0ZDEzMi03ZGFlLTQ2NzAtYjJmZC1lNjVlMWExMmI3MWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5OGQyZjg4NC1iZTFjLWQ4NGYtYjc4ZC1mOWMwZDdmNmFjM2EiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2MDJmODJjMS1iYmExLTQ3MjItYmQ5Ni0wYWU2M2I1NmY2ODQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYwMmY4MmMxLWJiYTEtNDcyMi1iZDk2LTBhZTYzYjU2ZjY4NCIgc3RFdnQ6d2hlbj0iMjAxNy0wMi0xNVQwOTo1OTozMy0wNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE0ODRkMTMyLTdkYWUtNDY3MC1iMmZkLWU2NWUxYTEyYjcxYiIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0wMVQxMTozNjo1OC0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1h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").appendTo($("#map"));

		
		_layerMarkers = L.featureGroup()
			.addTo(_map)
			.on("click", onMarkerClick);

		_layerDots = L.featureGroup()
			.addTo(_map)
			.on("click", onMarkerClick);

		if (!L.Browser.mobile) {
			L.easyButton({
				states:[
					{
						icon: "<img src='"+IMAGE_HOME_BUTTON+"'/>",
						onClick: function(btn, map){_map.fitBounds(_layerMarkers.getBounds());},
						title: "View entire walk"
					}
				]
			}).addTo(_map);			
		}

 		_table = $(new Table($("ul#list").get(0)))
	 		.on("itemActivate", table_onItemActivate)
	 		.on("itemDetails", table_onItemDetails)
	 		.on("itemHoverIn", table_onItemHoverIn)
	 		.on("itemHoverOut", table_onItemHoverOut)
	 		.get(0);

		
		$.getJSON(
			DRUPAL_URL,
			function(data) {
				_records = $.map(
					data.results, 
					function(value){return new Milestone(value);}
				);
				finish();
			}
		);
		

		function finish()
		{

			$.each(
				_records, 
				function(index, record) {

					L.marker(
						record.getLatLng(), 
						{
							icon: L.icon({
								iconUrl: 'http://1001stories.org/1001-Stories-Map/resources/water_drop.png',
								//iconUrl: '../resources/water_drop.png',
								iconSize: [20,30]
								//	tooltipAnchor: [15, -30]
							}),
							riseOnHover: true
						}
					)
						.bindTooltip(record.getTitle())
						.addTo(_layerMarkers)
						.key = record.getID();

					L.marker(
						record.getLatLng(), 
						{

							icon: L.icon({
								iconUrl: 'http://1001stories.org/1001-Stories-Map/resources/water_drop.png',
								//iconUrl: '../resources/water_drop.png',
								iconSize: [14,20]
							}),
							riseOnHover: true
						}
					)
						.bindTooltip(record.getTitle())
						.addTo(_layerDots)
						.key = record.getID();
				}
			);

			_table.load(_records);
			_map.fitBounds(_layerMarkers.getBounds());
			//_map.fitBounds([L.latLng(38.8941755, -77.0298067), L.latLng(42.370022, -71.0229427)]);

			// some final event handlers

			$("html body").keydown(onKeyDown);
			$("#details a#arrow-left, #details a#arrow-right").click(onArrowClick);
			$("#details .x-button").click(onXButtonClick);
			$("#button-show").click(onShowButtonClick);
			$("#filterWidgets label.switch input").change(onFilterToggle);
			$("#filterWidgets select#sort").change(onSortSelect);

			// one time check to see if touch is being used

			$(document).one("touchstart", function(){$("html body").addClass(GLOBAL_CLASS_USETOUCH);});

		}

	});

	/***************************************************************************
	********************** EVENTS that affect selection ************************
	***************************************************************************/

	function onArrowClick(e)
	{
		incrementSelected($(e.currentTarget).attr("id") === "arrow-right");
	}

	function onMapClick(e)
	{
		_table.clearActive();
		_selected = null;
		$("html body").removeClass(GLOBAL_CLASS_DETAILS);
		$("#details #content").empty();
		invalidateMapSize();
	}

	function onMarkerClick(e)
	{
		$(".leaflet-tooltip").remove();
		_selected = $.grep(
			_records, 
			function(value){return value.getID() === e.layer.key;}
		).shift();
		showPopup();
		_table.activateItem(_selected.getID());
		if ($(window).width() >= WIDTH_THRESHOLD) {
			showDetails(_map.getZoom() < 6 ? flyToSelected : panToSelected);
		} else {
			if ($("html body").hasClass(GLOBAL_CLASS_DETAILS)) {
				showDetails(_map.getZoom() < 6 ? flyToSelected : panToSelected);
			} else {
				panToSelected();				
			}
		}
	}

	function table_onItemActivate(event, id)
	{
		_selected = $.grep(_records, function(value){return value.getID() === id;}).shift();
		$(".leaflet-tooltip").remove();
		showPopup();
		if ($(window).width() >= WIDTH_THRESHOLD) {
			showDetails(_map.getZoom() < 6 ? flyToSelected : panToSelected);
		} else {
			if(_map.getZoom() < 6) {
				flyToSelected();
			} else {
				panToSelected();
			}
		}
	}

	function onKeyDown(event) {
		if (event.which === 27) /* escape key */
		{
			if ($(window).width() >= WIDTH_THRESHOLD) {
				_table.clearActive();
				_selected = null;
				_map.closePopup();
			}
			$("html body").removeClass(GLOBAL_CLASS_DETAILS);
			$("#details #content").empty();
			invalidateMapSize();
		} else if (event.which === 39 || event.which === 37) { /* arrow keys */
			if ($("html body").hasClass(GLOBAL_CLASS_DETAILS)) {
				incrementSelected(event.which === 39);
			}
		}
	}
		
	function onXButtonClick() {
		if ($(window).width() >= WIDTH_THRESHOLD) {
			_table.clearActive();
			_selected = null;
			_map.closePopup();
		}
		$("html body").removeClass(GLOBAL_CLASS_DETAILS);
		$("#details #content").empty();
		invalidateMapSize();
	}	

	// helper function for onArrowClick and arrow keypresses

	function incrementSelected(decrement)
	{

		var index = _records.indexOf(_selected);

		if (decrement) {
			index--;
		} else {
			index++;
		}

		if (index < 0) {index = 0;}
		if (index > _records.length - 1){index = _records.length - 1;}

		_selected = _records[index];
		_table.activateItem(_selected.getID());
		showPopup();
		showDetails(panToSelected);

	}

	/***************************************************************************
	**************************** EVENTS (other) ********************************
	***************************************************************************/

	function onFilterToggle()
	{
		if ($("label.switch input").prop("checked")) {
			_table.load(
				$.grep(
					_records, 
					function(value){return _map.getBounds().contains(value.getLatLng());}
				),
				_selected
			);
		} else {
			_table.load(_records, _selected);
		}
	}

	function onExtentChange()
	{
		if ($("label.switch input").prop("checked")) {
			_table.load(
				$.grep(
					_records, 
					function(value){return _map.getBounds().contains(value.getLatLng());}
				),
				_selected
			);
		}
	}

	function onZoomEnd()
	{
		if (_map.getZoom() < ZOOM_THRESHOLD) {
			_map.removeLayer(_layerMarkers);
			_map.addLayer(_layerDots);
		} else {
			_map.addLayer(_layerMarkers);
			_map.removeLayer(_layerDots);
		}
		if (_selected) {showPopup();}
	}

	function onSortSelect()
	{
		_table.setSortOrder(parseInt($("#filterWidgets select#sort").val()));
	}

	function table_onItemHoverIn(event, id)
	{
		var layerVisible = _map.getZoom() < ZOOM_THRESHOLD ? _layerDots : _layerMarkers;
		$.grep(
			layerVisible.getLayers(), 
			function(value){return value.key === id;}
		).shift().openTooltip();
	}

	function table_onItemHoverOut(event, id)
	{
		var layerVisible = _map.getZoom() < ZOOM_THRESHOLD ? _layerDots : _layerMarkers;
		$.grep(
			layerVisible.getLayers(), 
			function(value){return value.key === id;}
		).shift().closeTooltip();
	}

	function table_onItemDetails(event, id)
	{
		showDetails(panToSelected);
	}

	function onShowButtonClick(){
		$("#list-container").toggleClass(LISTCONTAINER_CLASS_UP);
		invalidateMapSize();
	}

	/***************************************************************************
	******************************** FUNCTIONS *********************************
	***************************************************************************/

	function showDetails(mapActionCallback)
	{

		writeDetails();

		if (!$("html body").hasClass(GLOBAL_CLASS_DETAILS)) {
			$("html body").addClass(GLOBAL_CLASS_DETAILS);
			$("#list-container").addClass(LISTCONTAINER_CLASS_UP);
			invalidateMapSize(mapActionCallback);
		} else {
			mapActionCallback();
		}

		function writeDetails()
		{

			$("#details #details-header h3").text(_selected.getTitle());		
			$("#details #details-header h5").text(
				_selected.getDisplayName()+
				" / "+
				_selected.getDate()
			);
			$("#details #content").empty();

			var before = _selected;

			$.getJSON(
				_selected.getURL(),
				function(data) {
					/* make sure selection didn't change while data was being fetched */
					if (_selected !== before) {
						return;
					}
					new Details(
						data, 
						function(details) {
							/* again, make sure selection didn't change while data was being fetched */
							if (_selected !== before) {
								return;
							}
							new DetailsContentDisplay().load(
								_selected, 
								details, 
								$("html body").hasClass(GLOBAL_CLASS_USETOUCH)
							);
						}
					);
				}
			);

		}


	}

	function panToSelected()
	{
		_map.panTo(_selected.getLatLng(), {animate: true, duration: 1});
	}

	function flyToSelected()
	{
		_map.flyToBounds(_selected.getLatLng().toBounds(500000));		
	}

	function showPopup()
	{
		_map.openPopup(
			_selected.getTitle(), 
			_selected.getLatLng(),
			{
				closeButton: false,
				offset: _map.getZoom() < ZOOM_THRESHOLD ? [0,0] : [0,-28]
			}
		);
	}

	function invalidateMapSize(callBack)
	{
		setTimeout(
			function() {
				_map.invalidateSize(true);
				if (callBack){callBack();}
			}, 
			TRANSITION_DURATION
		);		
	}

})();