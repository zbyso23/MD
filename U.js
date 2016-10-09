var U = 
{
	isObject: function(input)
	{
		return (typeof input === "object" && Object.prototype.toString.call(input) !== '[object Array]');
	},
	has: function(input, property)
	{
		return (this.isObject(input) === true && input.hasOwnProperty(property) === true);
	},
	isArray: function(input)
	{
		return (typeof input === "object" && Object.prototype.toString.call(input) === '[object Array]');
	},
	isFunction: function(input)
	{
		return (typeof input === "function");
	},
	isNumber: function(input)
	{
		return (typeof input === "number");
	},
	isString: function(input)
	{
		return (typeof input === "string");
	},
	isBool: function(input)
	{
		return (typeof input === "boolean");
	},
	isFloat: function(input)
	{
		return (typeof input === "number" && input !== Math.floor(input));
	},
	isInteger: function(input)
	{
		return (typeof input === "number" && input === Math.floor(input));
	},
	isInstance: function(input, instance)
	{
		return (this.isObject(input) === true && (input instanceof instance));
	},
	isSet: function(input)
	{
		return (typeof input !== "undefined");
	},
	isEmpty: function(input)
	{
		return (((this.isInteger(input) === true || this.isFloat(input)) && input === 0) || (this.isString(input) === true && input === '') || this.isSet(input) === false || this.isNull(input) === true);
	},
	isNull: function(input)
	{
		return (typeof input === "object" && Object.prototype.toString.call(input) === '[object Null]');
	}
}
