// MD, copyright (c) by Zbigniew Lipka
// Distributed under an GNU GENERAL PUBLIC LICENSE version 3: https://github.com/zbyso23/MD/blob/master/LICENSE

var MD, MD_ADDONS;
MD = function()
{
	var config = {
		strong: {
			'html': 'strong',
			'class': 'md-strong',
		},
		em: {
			'html': 'em',
			'class': 'md-em',
		},
		header: {
			'class': 'md-header'
		},
		code: {
			'class': 'md-code'
		},
		listOrdered: {
			'class': 'md-list-ordered'
		},
		list: {
			'class': 'md-list'
		},
		image: {
			'class': 'md-image'
		},
		table: {
			'class': 'table md-table'
		}
	}

	var codeHighlighterJavascript = function(language, lines, addTags, parseCodeFunction)
	{
		for(var i in lines)
		{
			var line = lines[i];
			var keywords;
			keywords = new RegExp("");
			var replaceSymbols = function(symbol) 
			{
				return '<span class="md-code-syntax md-code-syntax-symbol">' + symbol + '</span>';
			}
			var replaceCommands = function(x) 
			{
				var className = (x.length === 1) ? 'controls' : 'command';
				return '<span class="md-code-syntax md-code-syntax-' + className + '">' + x + '</span>';
			}
			line = line.replace(/(([\=\;\{\}\(\)\[\]\"\.]){1,1}|(join[\.]{1,1})|(console\.log)|break|case|catch|class[^a-z0-9]{1,}|continue|default|delete|(do[^a-z0-9]{1,})|(else[^a-z0-9]{1,})|(enum[^a-z0-9]{1,})|(export[s]{0,1})|module|extends|false|(for[^a-z0-9]{1,1})|from|(as[^a-z0-9]{1,1})|(in[^a-z0-9]{1,})|function|if|implements|import|instanceof|interface|let|new[^a-z0-9]{1,}|null|package|private|protected|static|return|super|switch|this|throw|true|try|(typeof[\s]{1,1})|var|while|with|yield){1,1}/g, replaceCommands); 
			line = line.replace(/([\']{1,1}[^\']{0,}[\']{1,1}){1,1}/g, replaceSymbols);
			//line = line.replace(/([\"]{1,1}[^\"]{0,}[\"]{1,1}){1,1}/g, replaceSymbols);
			lines[i] = line;
		}
		return lines;
	};

	var codeHighlighterPython = function(language, lines, addTags, parseCodeFunction) 
	{
		for(var i in lines)
		{
			var line = lines[i];
			var keywords;
			keywords = new RegExp("");
			var replaceSymbols = function(symbol) 
			{
				return '<span class="md-code-syntax md-code-syntax-symbol">' + symbol + '</span>';
			}
			var replaceCommands = function(x, y)
			{
				var className = (x.length === 1) ? 'controls' : 'command';
				return '<span class="md-code-syntax md-code-syntax-' + className + '">' + y + '</span>' + ((y.length !== x.length) ? x.substring(y.length) : '');
			}
			while(line.indexOf('%') >= 0)
			{
				line = line.replace('%', ':::');
			}
			var re = new RegExp('(([\(\)]){1,1}|True|False|class|finally|return|None|print|continue|lambda|from|nonlocal|while|global|with|elif|yield|assert|else|import|pass|break|except|raise|(def[\s\:]{1,})|in|if|(or[\s]{1,})|(is[\s]{1,})|(def[^a-zA-Z0-9]{1,})|try|not|as[\s]{1,}){1,1}', 'g')
			line = line.replace(re, replaceCommands);
			line = line.replace(/([\']{1,1}[^\']{0,}[\']{1,1}){1,1}/g, replaceSymbols);
			line = line.replace(/([\:]{3,3}){1,1}/g, function(x) {
				return '<span class="md-code-syntax md-code-syntax-percent">&#37;</span>';
			});
			lines[i] = line;

		}
		return lines;

	};

	var codeHighlighterHTML = function(language, lines, addTags, parseCodeFunction) 
	{
		for(var i in lines)
		{
			var line = lines[i];
			var keywords;
			keywords = new RegExp("");
			var replaceSymbols = function(symbol) 
			{
				// console.log('arguments', arguments);
				return '<span class="md-code-syntax md-code-syntax-attribute-name">' + arguments[2].trim() + '</span><span class="md-code-syntax md-code-syntax-attribute-control">&#61;</span><span class="md-code-syntax md-code-syntax-attribute-quote">&#34;</span><span class="md-code-syntax md-code-syntax-attribute-value">' + arguments[5] + '</span><span class="md-code-syntax md-code-syntax-attribute-quote">&#34;</span>';
			}
			var replaceCommands = function(x, y, z, a, b)
			{
				var attributes = (arguments[5] === '') ? '' : arguments[5];
				// console.log('x', arguments);
				// var className = (x.length === 1) ? 'controls' : 'command';
				var res = new RegExp('(([a-zA-Z0-9]{1,})([\=]{1,1})([\"]{1,1})([^\"]{0,})([\"]{1,1}))', 'g');
				attributes = attributes.replace(res, replaceSymbols);
				return '<span class="md-code-syntax md-code-syntax-controls">&lt;' + (arguments[2] === '</' ? '/' : '' ) + '</span><span class="md-code-syntax md-code-syntax-command">' + arguments[3] + '</span>' + attributes + '<span class="md-code-syntax md-code-syntax-controls">&gt;</span>';
			}
			var re = new RegExp('(([<]{1,1}[/]{0,1})(([\!]{1,1}DOCTYPE)|html|head|body|title|meta|link|style|a|h1|h2|h3|h4|h5|h6|p|img|audio|video|script|ul|ol|li|div|span|table|thead|tbody|tr|th|td|col|form|input|select|option|button|header|footer){1,1}([^>]{0,})([>]{1,1}))', 'g');
			line = line.replace(re, replaceCommands);
			lines[i] = line;
		}
		return lines;
	};

	var codeHighlighterGeneral = function(language, lines, addTags, parseCodeFunction)
	{
		return lines;
	}

	var registeredCodeHighlight = {	
		general: codeHighlighterGeneral,
		javascript: codeHighlighterJavascript,
		python: codeHighlighterPython,
		html: codeHighlighterHTML
	};




	var formatNonBreak = [];
	var formatCode     = [];

	var parseEmpty = function(lines)
	{
		var linesOutput = [];
		for (var i in lines) 
		{
			if(formatCode.indexOf(i) !== -1)
			{
				linesOutput.push(lines[i]);
				continue;
			}
			var line = lines[i].trim();
			if(line !== '')
			{

				linesOutput.push(lines[i]);
				continue;
			}
			formatNonBreak.push(i);
			linesOutput.push('<br>');
		}
		return linesOutput;
	}


	var parseHeaders = function(lines)
	{
		var linesOutput = [];
		for (var i in lines) 
		{
			if(formatCode.indexOf(i) !== -1)
			{
				linesOutput.push(lines[i]);
				continue;
			}
			var lineResult = /^((\#{1,4})([^\n]+))/.exec(lines[i]);
        	if (lineResult === null) 
        	{
        		linesOutput.push(lines[i]);
        		continue;
        	}
        	var headerType;
        	var className  = config.header.class;
        	switch(lineResult[2])
        	{
				case '#':
					headerType = 'h1';
					break;
				case '##':
					headerType = 'h2';
					break;
				case '###':
					headerType = 'h3';
					break;
				case '####':
					headerType = 'h4';
					break;
        	}
        	var line = '<' + headerType + ' class="' + config.header['class'] + '">' + lineResult[3] + '</' + headerType + '>';
        	linesOutput.push(line);
        	formatNonBreak.push(i);
		}
		return linesOutput;
	}


	var processInlineItem = function(line)
	{
		var lineResult = /(?:([\*]{1,3}))([^\*\n]+[^\*\s])\1/.exec(line);
		if (lineResult === null) 
		{
			return line;
		}
		var formatType;
		var className = '';
		switch(lineResult[1])
		{
			case '*':
				formatType = 'em';
				className  = config.em['class'];
				break;
			case '**':
				formatType = 'strong';
				className  = config.strong['class'];
				break;
			default:
				formatType = 'strong';
				break;
		}
		var lineInline = '<' + formatType + ' class="' + className + '">' + lineResult[2] + '</' + formatType + '>';
		line = line.replace(lineResult[0], lineInline);
		return processInlineItem(line);
	}

	var parseInline = function(lines)
	{
		var linesOutput = [];
		for (var i in lines) 
		{
			if(formatCode.indexOf(i) !== -1)
			{
				linesOutput.push(lines[i]);
				continue;
			}
        	linesOutput.push(processInlineItem(lines[i]));
        }
        return linesOutput;
	}


	var processImagesItem = function(line)
	{
		var lineResult = /([\!]{1,1})(([\[]{1,1}([^\]]{1,})[\]]{1,1}){0,1})([\(]{1,1}([^\)]{4,})[\)]{1,1}\s{0,})/.exec(line);
    	if (lineResult === null) 
    	{
    		return line;
    	}
    	var lineImage = '<img src="' + lineResult[6] + '"';
    	lineImage += ' class="' + config.image['class'] + '"';
    	lineImage += '>';
    	line = line.replace(lineResult[0], lineImage);
    	return processImagesItem(line);
	}


	//http://meta.stackexchange.com/questions/38915/creating-an-image-link-in-markdown-format - with links
	/*
	[![Foo](http://www.google.com.au/images/nav_logo7.png)](http://google.com.au/)
	*/
	var parseImages = function(lines)
	{
		var linesOutput = [];
		for (var i in lines) 
		{
			if(formatCode.indexOf(i) !== -1)
			{
				linesOutput.push(lines[i]);
				continue;
			}
        	linesOutput.push(processImagesItem(lines[i]));
        }
        return linesOutput;
	}

	var processLinksItem = function(line)
	{
		var lineTitleResult = /([\[]{1,1})([^\]]{1,})([\]]{1,1})([\(]{1,1})([^\)]{1,})([\)]{1,1})/.exec(line); //[zde](http://www.x4u.cz)
    	if (lineTitleResult === null)
    	{
    		return line;
    	}
    	var name = lineTitleResult[2];
    	var lineLink = '<a href="' + lineTitleResult[5] + '" target="_blank">' + name + '</a>';
    	line = line.replace(lineTitleResult[0], lineLink);
    	return processLinksItem(line);
	}

	var parseLinks = function(lines)
	{
		var linesOutput = [];
		for (var i in lines) 
		{
        	linesOutput.push(processLinksItem(lines[i]));
        }
        return linesOutput;
	}


	var parseCodeHTMLLine = function(line)
	{
		var keywords;
		keywords = new RegExp("");
		var replaceSymbols = function(symbol) 
		{
			return '<span class="md-code-syntax md-code-syntax-symbol">' + symbol + '</span>';
		}
		var replaceCommands = function(full, part1, part2, part3) 
		{
			console.log('arg', arguments);
			// var className = (x.length === 1) ? 'controls' : 'command';
			// return '<span class="md-code-syntax md-code-syntax-' + className + '">' + x + '</span>';
			return full;
		}
		//var text = '<!DOCTYPE html><html><head><title>neco</title></head><body id="neco" class="trida" onload="function(){console.log('ready');}"></body></html>';
		// /([<]{1,1})[\s]{0,}(([\!]{1,1}DOCTYPE)|html|head|body|title|meta|link|style|h1|h2|h3|h4|h5|h6|ul|ol|li|div|span|table|thead|tbody|tr|th|td|col|form|input|select|option|header|footer){1,1}([^>]{0,})([>]{0,})/i
		line = line.replace(/([<]{1,1})[\s]{0,}(([\!]{1,1}DOCTYPE)|html|head|body|title|meta|link|style|h1|h2|h3|h4|h5|h6|ul|ol|li|div|span|table|thead|tbody|tr|th|td|col|form|input|select|option|header|footer){1,1}([^>]{0,})([>]{0,})/g, replaceCommands); 
		//line = line.replace(/([\']{1,1}[^\']{0,}[\']{1,1}){1,1}/g, replaceSymbols);
		return line;
	}


	var parseCodeLinesByLanguage = function(language, lines)
	{
		// console.log('parseCodeLinesByLanguage ' + language, lines);
		language   = (isRegisteredCodeHighlight(language)) ? language : 'general';
		// console.log('processCodeLines output', registeredCodeHighlight[language](language, lines, false, parseCodeLinesByLanguage));
		return registeredCodeHighlight[language](language, lines, false, parseCodeLinesByLanguage);
	}

	var parseCode = function(lines)
	{
		var allowedLanguages = ['javascript', 'python', 'html'];
		var language         = 'general';
		var linesOutput      = [];
		var linesCode        = [];
		var isCodeStarted    = false;

		var processCodeLines = function()
		{
			if(linesCode.length === 0)
			{
				return;
			}
			language   = (isRegisteredCodeHighlight(language)) ? language : 'general';
			var output = parseCodeLinesByLanguage(language, linesCode);
			console.log('processCodeLines output', output);
			//error in other than general (built-in) codeHighlighter have fallback to switch to try general codeHighlighter
			if(false === U.isArray(output))
			{
				if(language === 'general')
				{
					linesCode = [];
					return;
				}
				output = parseCodeLinesByLanguage('general', linesCode);
				if(false === U.isArray(output))
				{
					linesCode = [];
					return;
				}
			}

			var iLast = (output.length - 1);
			var i     = 0;
			for(;i <= iLast; i++)
			{
				if(i === 0)
				{
					var lineTag  = '<pre';
					lineTag     += ' class="' + config.code['class'];
					lineTag     += ' md-code-syntax-lang-' + language + '">';
					output[i]     = lineTag;// + (language === output[i] ? '' : output[i]);
				}
				if(i === iLast)
				{
					console.log('i Last ' + iLast + ' . ' + i, output);
					output[i]     = output[i] + '</pre>';
				}
				linesOutput.push(output[i]);
			}
			linesCode = [];
		}

		for (var i in lines) 
		{
			if(isCodeStarted)
			{
				var lineResult = /^([^`]{0,})(([\`]{3,3}){0,1})/.exec(lines[i]);	
			}
			else
			{
				var lineResult = /^([\`]{3,3})([^`]+)(([\`]{3,3}){0,1})/.exec(lines[i]);
			}

        	if(lineResult === null)
        	{
        		if(false === isCodeStarted)
        		{
					var line  = '';
					linesOutput.push(lines[i]);
					continue;
        		}
        		linesCode.push(lines[i]);
        		continue;
        	}

        	if(false === isCodeStarted)
        	{
        		linesCode = [];
        		language  = (allowedLanguages.indexOf(lineResult[2].trim()) === -1) ? 'general' : lineResult[2].trim();
        		linesCode.push(lineResult[2]);
        		if(lineResult[3] === '')
        		{
        			isCodeStarted = true;
        		}
        	}
        	else
        	{
        		linesCode.push(lineResult[1]);
        		if(lineResult[2] !== '')
        		{
        			console.log('processCodeLines()', linesCode);
        			processCodeLines();
        			isCodeStarted = false;
        		}
        	}

        	formatCode.push(i);
        	formatNonBreak.push(i);
        }	
    	if(true === isCodeStarted)
    	{
    		isCodeStarted = false;
    		processCodeLines();
    	}
        return linesOutput;
	}

	var parseLists = function(lines)
	{
		var linesOutput = [];
		var isListStarted = false;
		var isListOrdered = false;
		for (var i in lines) 
		{
			if(formatCode.indexOf(i) !== -1)
			{
				linesOutput.push(lines[i]);
				continue;
			}
			var lineResult = /^((\*|\-){1,1})([^\*\-]{1,})/.exec(lines[i]);
        	if (lineResult === null) 
        	{
        		var line = lines[i];
        		if(isListStarted)
        		{
        			line = ((isListOrdered) ? '</ol>' : '</ul>') + line;
        			isListStarted = false;
        		}
        		linesOutput.push(line);
        		continue;
        	}
        	
        	if(isListStarted)
        	{
        		var line = '';
        		isListOrderedCurrent = (lineResult[1] === '-') ? true : false;
        		if(isListOrderedCurrent !== isListOrdered)
        		{
        			line += (false === isListOrderedCurrent) ? '</ol><ul class="' + config.list['class'] + '">' : '</ul><ol class="' + config.listOrdered['class'] + '">';
        			isListOrdered = isListOrderedCurrent;
        		}
        		line += '<li>' + lineResult[3].trim() + '</li>';
        	}
        	else
        	{
        		isListOrdered = (lineResult[1] === '-') ? true : false;
        		if(isListOrdered)
        		{
        			var line = '<ol class="' + config.listOrdered['class'] + '">';
        		}
        		else
        		{
        			var line = '<ul class="' + config.list['class'] + '">';
        		}
    			isListStarted = true;
        		line += '<li>' + lineResult[3].trim() + '</li>';
        	}
        	formatNonBreak.push(i);
        	linesOutput.push(line);
        }

		if(isListStarted)
		{
			var line = (isListOrdered) ? '</ol>' : '</ul>';
			linesOutput[i] += line;
		}
        return linesOutput;
	}

	var parseTableSimple = function(lines)
	{
		var linesOutput = [];
		var isTableStarted = false;
		for (var i in lines) 
		{
			if(formatCode.indexOf(i) !== -1)
			{
				linesOutput.push(lines[i]);
				continue;
			}
			if(isTableStarted)
			{
				var lineResult = /^([^\]]+)(([\]]{1,1}){0,1})/.exec(lines[i]);	
			}
			else
			{
				var lineResult = /^([\[]{1,1})([^\]]+)$/.exec(lines[i]);
			}
        	if (lineResult === null) 
        	{
        		if(isTableStarted)
        		{
        			linesOutput.push('</table>');
        			isTableStarted = false;
        		}
        		linesOutput.push(lines[i]);
        		continue;
        	}

        	if(isTableStarted)
        	{
        		var rows = lineResult[1].split(';');
        		var line = '<tr>';
        		for(var r in rows)
        		{
        			line += '<td>' + rows[r].trim() + '</td>';
        		}
    			line += '</tr>';
    			if(lineResult[2] !== '')
    			{
    				isTableStarted = false;
    				line += '</table>';
    			}
        	}
        	else
        	{
        		isTableStarted = true;
        		var rows = lineResult[2].split(';');
        		var line = '<table class="' + config.table['class'] + '"><tr>';
        		for(var r in rows)
        		{
        			line += '<th>' + rows[r].trim() + '</th>';
        		}
    			line += '</tr>';
        	}
			formatNonBreak.push(i);
        	linesOutput.push(line);
        }	
        return linesOutput;
	}

	var formatBreaks = function(lines)
	{
		for(var i in lines)
		{
			if(formatCode.indexOf(i) !== -1)
			{
				continue;
			}
			if(formatNonBreak.indexOf(i) !== -1)
			{
				continue;
			}
			lines[i] += '<br>';
		}
		return lines;
	}

	var isRegisteredCodeHighlight = function(language)
	{
		return (registeredCodeHighlight.hasOwnProperty(language));
	}

	var _parse = function(string)
	{
		var lines = string.split('\n');
		lines = parseCode(lines);
		lines = parseEmpty(lines);
		lines = parseImages(lines);
		lines = parseHeaders(lines);
		lines = parseInline(lines);
		lines = parseLinks(lines);
		lines = parseTableSimple(lines);
		lines = parseLists(lines);
		lines = formatBreaks(lines);
		console.log('MD RESULT:', lines.join('<br>'))
		return lines.join('\n');
	}



	/*@todo Perpare for modular code highlight*/
	var _registerCodeHighlight = function(language, processFunction)
	{
		if(false === U.isString(language))
		{
			throw new Error('MD registerCodeHighlight Error: invalid language!');
		}
		if(false === U.isFunction(processFunction))
		{
			throw new Error('MD registerCodeHighlight Error: invalid process function!');
		}
		if(true === isRegisteredCodeHighlight(language))
		{
			throw new Error('MD registerCodeHighlight Error: language allready registered!');
		}
		registeredCodeHighlight[language] = processFunction;
	}

	return {
		'parse': _parse,
		'registerCodeHighlight': _registerCodeHighlight
	}
}


var MD_ADDONS = {
	codeHighlighters: {},

	addCodeHighlighter: function(language, processFunction)
	{
		if(false === U.isString(language))
		{
			throw new Error('MD_ADDONS addCodeHighlighter Error: invalid language!');
		}
		if(false === U.isFunction(processFunction))
		{
			throw new Error('MD_ADDONS addCodeHighlighter Error: invalid process function!');
		}
		if(true === U.has(this.codeHighlighters, language))
		{
			throw new Error('MD_ADDONS addCodeHighlighter Error: language allready registered!');
		}
		this.codeHighlighters[language] = processFunction;
	},

	getAllCodeHighlighters: function()
	{
		return this.codeHighlighters;
	}
};


MD_ADDONS.addCodeHighlighter('general', function(lines, language, addTags, parseCodeFunction){

	return lines;

});



MD_ADDONS.addCodeHighlighter('javascript', function(lines, language, addTags, parseCodeFunction){
	for(var i in lines)
	{
		var line = lines[i];
		var keywords;
		keywords = new RegExp("");
		var replaceSymbols = function(symbol) 
		{
			return '<span class="md-code-syntax md-code-syntax-symbol">' + symbol + '</span>';
		}
		var replaceCommands = function(x) 
		{
			var className = (x.length === 1) ? 'controls' : 'command';
			return '<span class="md-code-syntax md-code-syntax-' + className + '">' + x + '</span>';
		}
		line = line.replace(/(([\=\;\{\}\(\)\[\]\"\.]){1,1}|(join[\.]{1,1})|(console\.log)|break|case|catch|class|continue|default|delete|(do[\s]{0,}[;]{0,1})|else|enum|(export[s]{0,1})|module|extends|false|(for\s{1,1})|from|(as\s{1,1})|(in\s{1,1})|function|if|implements|import|instanceof|interface|let|new|null|package|private|protected|static|return|super|switch|this|throw|true|try|(typeof[\s]{1,1})|var|while|with|yield){1,1}/g, replaceCommands); 
		line = line.replace(/([\']{1,1}[^\']{0,}[\']{1,1}){1,1}/g, replaceSymbols);
		//line = line.replace(/([\"]{1,1}[^\"]{0,}[\"]{1,1}){1,1}/g, replaceSymbols);
		lines[i] = line;
	}
	return lines;
});

MD_ADDONS.addCodeHighlighter('python', function(lines, language, addTags, parseCodeFunction){
	for(var i in lines)
	{
		var line = lines[i];
		var keywords;
		keywords = new RegExp("");
		var replaceSymbols = function(symbol) 
		{
			return '<span class="md-code-syntax md-code-syntax-symbol">' + symbol + '</span>';
		}
		var replaceCommands = function(x, y)
		{
			var className = (x.length === 1) ? 'controls' : 'command';
			return '<span class="md-code-syntax md-code-syntax-' + className + '">' + y + '</span>' + ((y.length !== x.length) ? x.substring(y.length) : '');
		}
		while(line.indexOf('%') >= 0)
		{
			line = line.replace('%', ':::');
		}
		var re = new RegExp('(([\(\)]){1,1}|True|False|class|finally|return|None|print|continue|lambda|from|nonlocal|while|global|with|elif|yield|assert|else|import|pass|break|except|raise|(def[\s\:]{1,})|in|if|(or[\s]{1,})|(is[\s]{1,})|(def[^a-zA-Z0-9]{1,})|try|not|as){1,1}', 'g')
		line = line.replace(re, replaceCommands);
		line = line.replace(/([\']{1,1}[^\']{0,}[\']{1,1}){1,1}/g, replaceSymbols);
		line = line.replace(/([\:]{3,3}){1,1}/g, function(x){
			return '<span class="md-code-syntax md-code-syntax-percent">&#37;</span>';
		});
		lines[i] = line;

	}
	return lines;

});
