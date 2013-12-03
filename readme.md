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

2. Common Configuration

   Create "node-hosting.json" file with next content:
	```javascript
	{
		"port" : 15478,						// service port
		"username" : "admin",				// username for client application
		"password" : "admin",				// password for client application
		"applications" : {                  // list of your hosted applications (see below)
		}
	}
	```
	and put it in a /etc folder or root node-deploy-server module folder.

3. Applications configuration
    ```javascript
		"applications" : {                  // list of your hosted applications
			"node-deploy-demo" : {			// your application name
				"path" : "/applications",	// root path for deployment application

				"foreverConfig" : {			// *config options for forever-monitor, if corresponding plugin is switched on
					"cwd" : "/applications/node-deploy-demo" // current working dir for application
				},
				"plugins" : [               // **extensions to process received file
                    "unpack",               // unpack archive
                    "installDependencies",  // launch command 'npm install' into root folder
                    "startProcess"          // launch your service by dint of forever-monitor (see <https://github.com/nodejitsu/forever-monitor>)
				]
			}
		}
    ```

4. Run service

    * as command-line tool
	```bash
	node-server-deploy
	```

	* as windows service
	```command
	sc start nodehosting.exe
	```

Service ready. To deploy application use node-deploy client side <https://github.com/AndyGrom/node-deploy-client>

License
-------
MIT. See License.txt file.