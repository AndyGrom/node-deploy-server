The Node.js deploy server
=========================
Node.js service is designed to help you deploy and manage your node.js web services. 
This is server part. Client part is https://github.com/AndyGrom/node-deploy-client

Usages
------------
1. Install service

	```bash
	npm install node-deploy-server -g
	```
2. Configuration
   Put into root folder you project "settings.json" file with next content:
	```javascript
	{
		"port" : 15478,						// service port
		"username" : "admin",				// username for client application
		"password" : "admin",				// password for client application
		"applications" : {					// list you hosted applications
			"node-deploy-demo" : {			// application name
				"path" : "/applications",	// root path for application
				"foreverConfig" : {			// config options for forever-monitor (see https://github.com/nodejitsu/forever-monitor)
					"cwd" : "/applications/node-deploy-demo" // current working dir for application
				}
			}
		}
	}	
	```

3. Run service

	```bash
	node-server-deploy
	```

Service ready. To deploy application use node-deploy client side (https://github.com/AndyGrom/node-deploy-client)

License
-------
MIT. See License.txt file.