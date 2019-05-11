function Table(ul)
{

	var LISTITEM_CLASS_ACTIVE = "active";
	var SORT_ORDER_DESCENDING = 0;

	var _self = this;
	var _sortOrder = SORT_ORDER_DESCENDING;

	this.load = function(recs, selected)
	{

		$(ul).css("flex-direction", _sortOrder === SORT_ORDER_DESCENDING ? "column" : "column-reverse");

		$(ul).empty();
		$.each(
			recs, 
			function(index, value) {

				var titleParts = $.map(
					value.getTitle().split(":"), 
					function(str){return str.trim();}
				);
										
				//var formatOptions = {year: 'numeric', month: 'long', day: 'numeric'};

				$(ul).append(

					$("<li>")
						.append($("<div>").addClass("thumb").css("background-image", "url('"+value.getPreviewImage()+"')"))
						.append($("<div>").addClass("info")
							.append($("<div>").html(value.getDisplayName()))
							.append($("<div>").html(titleParts.shift()))
							.append($("<div>").html(titleParts.shift()))
							.append($("<div>"))
							.append($("<div>").html(value.getDate()))
						)
						.append($("<a>").addClass("goto")
							.append($("<img>").attr("src", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMS41NCAzOS41NCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7c3Ryb2tlOiNmZmY7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDoyLjVweDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDk8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMSIgcG9pbnRzPSIxLjc3IDM3Ljc3IDE5Ljc3IDE5Ljc3IDEuNzcgMS43NyIvPjwvZz48L2c+PC9zdmc+"))
						)
						.attr("storymaps-id", value.getID())
				);

			}
		);

		var liSelected;

		if (selected) {
			liSelected = $.grep(
				$(ul).find("li"), 
				function(value){return $(value).attr("storymaps-id") === selected.getID();}
			).shift();
		}

		if (liSelected) {
			$(liSelected).addClass(LISTITEM_CLASS_ACTIVE);
			$(ul).animate(
				{scrollTop: $(liSelected).offset().top - $(ul).offset().top + $(ul).scrollTop()},
				"slow"
			);
		} else {
			$(ul).animate({scrollTop: 0}, "slow");
		}

		$(ul).find("li")
			.click(
				function(e) {
					if ($(e.currentTarget).hasClass(LISTITEM_CLASS_ACTIVE)) {
						$(_self).trigger(
							"itemDetails",
							[$(e.currentTarget).attr("storymaps-id")]
						);
					} else {
						_self.clearActive();
						$(e.currentTarget).addClass(LISTITEM_CLASS_ACTIVE);
						$(_self).trigger(
							"itemActivate", 
							[$(e.currentTarget).attr("storymaps-id")]
						);
					}
				}
			)
			.hover(
				function(e) {
					$(_self).trigger(
						"itemHoverIn", 
						[$(e.currentTarget).attr("storymaps-id")]
					);
				},
				function(e) {
					$(_self).trigger(
						"itemHoverOut", 
						[$(e.currentTarget).attr("storymaps-id")]
					);
				}
			);

	};

	this.setSortOrder = function(order)
	{
		_sortOrder = order;
		$(ul).css("flex-direction", _sortOrder === SORT_ORDER_DESCENDING ? "column" : "column-reverse");
		var liSelected = $.grep(
			$(ul).find("li"), 
			function(value){return $(value).hasClass(LISTITEM_CLASS_ACTIVE);}
		).shift();

		if (liSelected) {
			$(ul).animate(
				{scrollTop: $(liSelected).offset().top - $(ul).offset().top + $(ul).scrollTop()},
				"slow"
			);
		} else {
			$(ul).animate({scrollTop: 0}, "slow");
		}

	};

	this.activateItem = function(id)
	{
		$(ul).find("li").removeClass(LISTITEM_CLASS_ACTIVE);

		var li = $.grep(
				$(ul).find("li"), 
				function(value){return $(value).attr("storymaps-id") === id;}
		).shift();

		if (li) {
			$(li).addClass(LISTITEM_CLASS_ACTIVE);
			$(ul).animate(
				{scrollTop: $(li).offset().top - $(ul).offset().top + $(ul).scrollTop()},
				"slow"
			);
		}

	};

	this.clearActive = function()
	{
		$(ul).find("li").removeClass(LISTITEM_CLASS_ACTIVE);	 			
	};

}

Table.prototype.foo = "foo";