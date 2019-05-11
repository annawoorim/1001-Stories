function Media(json) {
	Record.call(this, json);
}

Media.prototype = Object.create(Record.prototype);
Media.prototype.constructor = Media;

Media.prototype.getBody = function()
{
	return this._json.body;
};

Media.prototype.getSource = function()
{
	return this._json.source;
};

Media.prototype.getVimeoID = function()
{
	return this._json.metadata.vimeo_id;	
};

Media.prototype.getFile = function()
{
	return this._json.file;
};