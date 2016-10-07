# MD.js
simple markdown javascript parser

support:
- lists
- simple tables: `[cel1; cel2; cel3 \nrow2 cel1; row2 cel2; row2 cel3]`
- headers
- links
- images
- code
- links with images

built in code syntax highlight:
- javascript
- python
- html

usage:
```javascript
var md = new MD();
var text = "#Header 1\n##Header 2\n###Header 3\n[Link Title](https://github.com/zbyso23/MD)";
document.body.innerHTML = md.parser(text);
```

new syntax highlight supported by modules:
```javascript
md.registerCodeHighlight(languageName, callback(language, linesCode, addTags, parseCodeFunction){
  //do something with lines code
  //possible to call parseCodeFunction(language, lines) for lines with sublanguage - for example css in html
  return linesCode;
});
