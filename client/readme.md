The Node.js deploy client
=========================

Node.js command-line tool is designed to help you deploy your node.js application 

It is client side part of [node-deploy-server](https://github.com/AndyGrom/node-deploy-server)

Usages
------------
1. Install tool

	```bash
	npm install node-deploy-client -g
	```
2. Configuration  
	Create into root folder your project ".deploy" file with next content:
	
	```javascript
	{
    	"development" : {                                   // configuration name
    		"url" : "http://admin:admin@localhost:15478"    // deploy server url
    	},
    	"staging" : {                                       // other configuration name
    		"url" : "http://admin:admin@192.168.1.3:15478"  // other deploy server url
    	}
    }
	```
	into your package.json file fill next fields
	```javascript	
	{
		"name" : "name of application",	// name must correlate with server-side application name
		"main" : "server.js"			// main script what will performing after deploying
	}
	```
	
3. Run tool into root folder your project
	
	```bash
	deploy <configuration name>
	```

License
-------
The MIT License

Copyright (c) 2013-2014 Gromozdov Andrey Alexandrovich.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
