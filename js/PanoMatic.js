function PanoMatic(slider)
{

	var isDown = false;
	var startX;
	var scrollLeft;

	$(slider).mousedown(
		function(event) {
			event.preventDefault();
			isDown = true;
			$(slider).addClass("active");
			startX = event.pageX - $(slider).offset().left;
			scrollLeft = $(slider).scrollLeft();
		}
	);

	$(slider).mouseleave(
		function() {
			isDown = false;
			$(slider).removeClass("active");
		}
	);

	$(slider).mouseup(
		function() {
			isDown = false;
			$(slider).removeClass("active");
		}
	);

	$(slider).mousemove(
		function(event) {
			if (!isDown) {return;}
			event.preventDefault();
			var x = event.pageX - $(slider).offset().left;
			var walk = x - startX;
			$(slider).scrollLeft(scrollLeft - walk);
		}
	);

}

PanoMatic.prototype.foo = "foo";