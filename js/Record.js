function Record(json)
{
	this._json = json;
}

Record.prototype.getID = function()
{
	return this._json.uid;
};

Record.prototype.getMile = function()
{
	return this._json.custom_fields.mile ? parseInt(this._json.custom_fields.mile) : null;
};

Record.prototype.getMileStone = function()
{
	return this._json.custom_fields.milestone;
};

Record.prototype.getTitle = function()
{
	return this._json.title;
};

Record.prototype.getLatLng = function()
{
	return L.latLng(this._json.latitude, this._json.longitude);
};

Record.prototype.getExcerpt = function()
{
	return this._json.excerpt;
};

Record.prototype.getPreviewImage = function(size)
{
	return this._json.preview_image;
	/*
	var url;
	if (this._json.preview_images) {
		url = !size || size===Record.PREVIEW_IMAGE_SIZE_SMALL ? 
				this._json.preview_images.small.url : 
				this._json.preview_images.large.url;		
	}
	return url;
	*/
};

Record.prototype.getDate = function()
{
	return this._json.date;
	//return new Date(this._json.custom_fields.date);
};

Record.prototype.getDays = function()
{

	var one_day=1000*60*60*24;
	var start_date = new Date(2013, 0, 21);

	return Math.round(
		(this.getDate().getTime() - start_date.getTime()) / one_day
	)+12;

};

Record.prototype.getDisplayName = function()
{
	return this._json.location;
};

Record.prototype.getURL = function()
{
	return this._json.href;
};

Record.prototype.getBody = function()
{
	return this._json.body;
};

Record.prototype.getTags = function()
{
	return this._json.tags;
};

Record.prototype.getAudio = function()
{
	return this._json.audio;
};

Record.prototype.getStreetView = function()
{
	return this._json.street_view;
};

Record.prototype.getQuote = function()
{
	return this._json.quote;
};

Record.PREVIEW_IMAGE_SIZE_SMALL = "small";
Record.PREVIEW_IMAGE_SIZE_LARGE = "large";