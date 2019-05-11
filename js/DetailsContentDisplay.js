function DetailsContentDisplay()
{
	
}

DetailsContentDisplay.prototype.load = function(_selected, details, touch)
{
	$("<section>").attr("id", "remarks")
		.addClass("narrative").html(_selected.getQuote())
		.appendTo($("#details #content"));

	$("<section>").attr("id", "encounters")
		.append($("<h6>").html("STORY"))
		.append(
			$("<iframe>")
				.attr("width", "100%")
				.attr("height", "166")
				.attr("scrolling", "no")
				.attr("frameborder","no")
				.attr("allow","autoplay")
				.attr("src", ""+_selected.getAudio()+"")
				)
		.appendTo($("#details #content"));

	$("<section>").attr("id", "panorama")
		.append($("<h6>").html(_selected.getDisplayName().toUpperCase()))
		.append(
			$("<iframe>")
				.attr("width", "100%")
				.attr("height", "300")
				.attr("style", "border:0")
				.attr("frameborder","0")
				.attr("allow","fullscreen")
				.attr("src", ""+_selected.getStreetView()+"")
				)
		.appendTo($("#details #content"));
};