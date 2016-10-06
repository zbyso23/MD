# MD
simple markdown javascript parser

code syntax highlight:
- javascript
- python
- html

usage:
var md = new MD();
var text = "#Header 1\n##Header 2\n###Header 3\n 	&#91;Link Title	&#93;&#40;https://github.com/zbyso23/MD&#41;";
document.body.innerHTML = md.parser(text);
