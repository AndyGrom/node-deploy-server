The Node.js deploy server
=========================
Node.js service is designed to help you deploy and manage your node.js web services. 
Client tool for deployment located in [node-deploy-client](https://github.com/AndyGrom/node-deploy-server/tree/master/client)

Features
--------
1. Easy installation.
2. Your services launch by dint of [forever-monitor](https://github.com/nodejitsu/forever-monitor).
3. Installing as [Linux daemon](#supported-os "see supported os") or Windows service.
4. Manage by web-interface.
5. HTTPS support.

Usages
------------
1. Install package

   Ensure administrative rights and perform command in terminal.

	```bash
	npm install -g node-deploy-server --unsafe-perm
	```
	Package installing service script into /etc/init.d/ folder on linux systems, therefore you are must specify
	--unsafe-perm parameter for npm.

2. Run a service

    * as command-line tool
	```bash
	node-server-deploy
	```

	* as windows service
	```bash
	sc start nodehosting.exe
	```

	* as linux daemon
	```bash
	service nodehosting start
	```

Service ready. To deploy application use [node-deploy client side](https://github.com/AndyGrom/node-deploy-server/tree/master/client).
For managing a service locate your browser to http://hostname:15478/ .
Default credentials is admin/admin. Do not forget to change their.

Supported OS
------------
The software is tested on the following operating systems: CentOS 6, Fedora 18, Debian 7.2 (wheezy), Windows 7, Windows 8

Note
----
On Red Had based system do not forget to include the service in the boot.

```bash
chkconfig nodehosting on
```

License
-------
The MIT License

Copyright (c) 2013 Gromozdov Andrey Alexandrovich.

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