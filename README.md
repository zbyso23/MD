# MD
simple markdown javascript parser

code syntax highlight:
- javascript
- python
- html

usage:
var md = new MD();
```var text = "#Header 1\n##Header 2\n###Header 3\n[Link Title](https://github.com/zbyso23/MD)";```
document.body.innerHTML = md.parser(text);
