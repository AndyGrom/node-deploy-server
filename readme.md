The Node.js deploy server
=========================
Node.js service is designed to help you deploy and manage your node.js web services. 
This is server part. Client part is https://github.com/AndyGrom/node-deploy-client

Features
--------
1. Easy installation.
2. Your services launch by dint of [forever-monitor](https://github.com/nodejitsu/forever-monitor).
3. Installing as Linux daemon or Windows service.

Usages
------------
1. Install package

   Ensure administrative rights and run command in terminal

	```bash
	npm install node-deploy-server -g
	```

2. Configuration

   Edit "nodehosting.json" file in /etc folder on linux-based OS or in root package folder on Windows:
	```javascript
	{
		"port" : 15478,						    // service port
		"username" : "admin",				    // username for client application
		"password" : "admin",				    // password for client application
        "applications" : {                      // list of your hosted applications
            "application1" : {                  // your application name
                "path" : "../applications",     // root path for deployment application
                "foreverConfig" : {             // config options for forever-monitor, if corresponding plugin is switched on
                    "cwd" : "../applications/application1"
                },
                "plugins" : [                   // extensions to process received file
                    "unpack",                   // unpack archive and ensure target folder
                    "installDependencies",      // launch command 'npm install' into root folder
                    "startProcess"              // launch your service by dint of forever-monitor (see <https://github.com/nodejitsu/forever-monitor>)
                ]
            }
        }
	}
	```

3. Run service

    * as command-line tool
	```bash
	node-server-deploy
	```

	* as windows service
	```command
	sc start nodehosting.exe
	```

	* as linux daemon
	```
	service nodehosting start
	```

Service ready. To deploy application use node-deploy client side <https://github.com/AndyGrom/node-deploy-client>

License
-------
MIT. See License.txt file.