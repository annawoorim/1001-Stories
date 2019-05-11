function Details(json, callBack)
{
	Record.call(this, json);
	this._media = [];
	var self = this;
	$.each(
		json.media,
		function(index, value)
		{
			$.getJSON(
				value,
				function(data) {
					self._media.push(new Media(data));
					finish();
				}
			);
		}
	);
	function finish()
	{
		if (self._media.length === self._json.media.length) {
			callBack(self);
		}
	}
}

Details.prototype = Object.create(Record.prototype);
Details.prototype.constructor = Details;

Details.prototype._searchMedia = function(regexp)
{
	return $.grep(
		this._media, 
		function(value) {
			return value.getTags().search(regexp) > -1;
		}
	).shift();
};

Details.prototype.getBody = function()
{
	return this._json.body;
};

Details.prototype.getSky = function()
{
	return this._searchMedia(/sky/i);
};

Details.prototype.getEarth = function()
{
	return this._searchMedia(/earth|feet/i);
};

Details.prototype.getEncounter = function()
{
	return this._searchMedia(/encounter/i);
};

Details.prototype.getVideo = function()
{
	return this._searchMedia(/glances/i);	
};

Details.prototype.getSound = function()
{
	return this._searchMedia(/sound/i);
};

Details.prototype.getPano = function()
{
	return this._searchMedia(/pano/i);
};