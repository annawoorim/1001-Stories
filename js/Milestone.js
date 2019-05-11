function Milestone(json)
{
	Record.call(this, json);
}

Milestone.prototype = Object.create(Record.prototype);
Milestone.prototype.constructor = Milestone;

Milestone.prototype.getLabel = function()
{
	return this._json.label;
};