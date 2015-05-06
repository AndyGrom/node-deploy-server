angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/applications.html',
    "<fieldset>\r" +
    "\n" +
    "    <legend><i class=\"self-icon-cog-alt\"></i><span class=\"indent6\">Applications</span></legend>\r" +
    "\n" +
    "    <div class=\"row-fluid\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"span3\">\r" +
    "\n" +
    "            <div class=\"well\">\r" +
    "\n" +
    "                <div class=\"nav\">\r" +
    "\n" +
    "                    <ul class=\"nav nav-list\">\r" +
    "\n" +
    "                        <li class=\"divider\"></li>\r" +
    "\n" +
    "                        <li ng-repeat=\"(name, properties) in applications\" ng-class=\"currentAppName == name ? 'active' : ''\">\r" +
    "\n" +
    "                            <a href=\"\" ng-click=\"selectApplication(name)\">\r" +
    "\n" +
    "                                <i class=\"self-icon-cog-alt\">  </i>\r" +
    "\n" +
    "                                {{name}}\r" +
    "\n" +
    "                                <i data-ng-show=\"currentAppName == name\"\r" +
    "\n" +
    "                                   data-ng-click=\"removeApplication(name)\"\r" +
    "\n" +
    "                                   class=\"self-icon-cancel pull-right\"\r" +
    "\n" +
    "                                   title=\"remove application\">\r" +
    "\n" +
    "                                </i>\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                        <li class=\"divider\"></li>\r" +
    "\n" +
    "                        <li>\r" +
    "\n" +
    "                            <button class=\"btn btn-block\" data-ng-click=\"showNewApplication = !showNewApplication\">\r" +
    "\n" +
    "                                <i class=\"self-icon-doc-new\"></i>\r" +
    "\n" +
    "                                <span>Create application</span>\r" +
    "\n" +
    "                            </button>\r" +
    "\n" +
    "                            <div data-ng-show=\"showNewApplication\">\r" +
    "\n" +
    "                                <label>Application name:</label>\r" +
    "\n" +
    "                                <input class=\"input-block-level\"\r" +
    "\n" +
    "                                       type=\"text\"\r" +
    "\n" +
    "                                       required\r" +
    "\n" +
    "                                       data-ng-model=\"newApplicationName\"\r" +
    "\n" +
    "                                       data-ng-change=\"newApplicationNameChange()\" />\r" +
    "\n" +
    "                                <button class=\"btn btn-primary btn-block\" data-ng-click=\"createApplication()\" data-ng-disabled=\"!newApplicationNameValid\">\r" +
    "\n" +
    "                                    <i class=\"self-icon-ok\"></i>\r" +
    "\n" +
    "                                    <span>Create</span>\r" +
    "\n" +
    "                                </button>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ul>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"span9\" ng-show=\"currentApp\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div data-tabs=\"\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div data-pane title=\"Common\">\r" +
    "\n" +
    "                    <label>Path</label>\r" +
    "\n" +
    "                    <input type=\"text\" data-ng-model=\"currentApp.path\" /> <br />\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" data-ng-model=\"currentApp.startProcess\" /> (startProcess) Run an application.\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div data-pane title=\"Monitoring\">\r" +
    "\n" +
    "                    <h5>\r" +
    "\n" +
    "                        See <a href=\"https://github.com/nodejitsu/forever-monitor#options-available-when-using-forever-in-nodejs\" target=\"_blank\">forever-monitor</a> for details\r" +
    "\n" +
    "                    </h5>\r" +
    "\n" +
    "                    <div data-tabs=\"\">\r" +
    "\n" +
    "                        <div data-pane title=\"Basic configuration options\">\r" +
    "\n" +
    "                            <label class=\"checkbox\">\r" +
    "\n" +
    "                                <input type=\"checkbox\" ng-model=\"currentApp.foreverConfig.silent\"> (silent) Silences the output from stdout and stderr in the parent process\r" +
    "\n" +
    "                            </label>\r" +
    "\n" +
    "                            <label>(uid) Custom uid for this forever process. (default: autogen)</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.uid\">\r" +
    "\n" +
    "                            <label>(pidFile) Path to put pid information for the process(es) started</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.pidFile\" placeholder=\"path/to/a.pid\">\r" +
    "\n" +
    "                            <label>(max) Sets the maximum number of times a given script should run</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.max\"> <br />\r" +
    "\n" +
    "                            <label class=\"checkbox\">\r" +
    "\n" +
    "                                <input type=\"checkbox\" ng-model=\"currentApp.foreverConfig.killTree\" value=\"1\"> (killTree) Kills the entire child process tree on `exit`\r" +
    "\n" +
    "                            </label>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div data-pane title=\"Restart\">\r" +
    "\n" +
    "                            <h5>These options control how quickly forever restarts a child process as well as when to kill a \"spinning\" process </h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(minUptime) Minimum time a child process has to be up. Forever will 'exit' otherwise.</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.minUptime\" placeholder=\"2000\">\r" +
    "\n" +
    "                            <label>(spinSleepTime) Interval between restarts if a child is spinning (i.e. alive < minUptime).</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.spinSleepTime\" placeholder=\"1000\">\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div data-pane title=\"Spawn process\">\r" +
    "\n" +
    "                            <h5>Command to spawn as well as options and other vars (env, cwd, etc) to pass along</h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(command) Binary to run (default: 'node')</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.command\" placeholder=\"node\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(options) Additional arguments to pass to the script</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.options\" placeholder=\"foo bar\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(sourceDir) Directory that the source script is in</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.sourceDir\" placeholder=\"script/path\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div data-pane title=\"Watch\">\r" +
    "\n" +
    "                            <h5>Options for restarting on watched files.</h5>\r" +
    "\n" +
    "                            <label class=\"checkbox\">\r" +
    "\n" +
    "                                <input type=\"checkbox\" ng-model=\"currentApp.foreverConfig.watch\" /> (watch) Value indicating if we should watch files.\r" +
    "\n" +
    "                            </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>Dot files we should read to ignore ('.foreverignore', etc).</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.watchIgnoreDotFiles\" placeholder=\"null\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>Ignore patterns to use when watching files.</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.watchIgnorePatterns\" placeholder=\"null\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>Top-level directory to watch from.</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.watchDirectory\" placeholder=\"null\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div data-pane title=\"Spawn options\">\r" +
    "\n" +
    "                            <h5>All or nothing options passed along to `child_process.spawn`.</h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(spawnWith.customFds) that forever spawns.</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.spawnWith.customFds\" placeholder=\"-1, -1, -1\" /> <br />\r" +
    "\n" +
    "                            \r" +
    "\n" +
    "                            <label class=\"checkbox\">\r" +
    "\n" +
    "                                <input type=\"checkbox\" ng-model=\"currentApp.foreverConfig.spawnWith.setsid\" /> (spawnWith.setsid)\r" +
    "\n" +
    "                            </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h5>More specific options to pass along to `child_process.spawn` which will override anything passed to the `spawnWith` option</h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(cwd) current working directory</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.cwd\" placeholder=\"/path/to/child/working/directory\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <h5>Environment Variables passed to the application</h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>process.env attributes in JSON Format</label>\r" +
    "\n" +
    "                            <textarea json ng-model=\"currentApp.foreverConfig.env\" rows=\"8\"></textarea>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div data-pane title=\"Log files\">\r" +
    "\n" +
    "                            <h5>Log files and associated logging options for this instance</h5>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(logFile) Path to log output from forever process (when daemonized)</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.logFile\" placeholder=\"path/to/file\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(outFile) Path to log output from child stdout</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.outFile\" placeholder=\"path/to/file\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            <label>(errFile) Path to log output from child stderr</label>\r" +
    "\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.errFile\" placeholder=\"path/to/file\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <button class=\"btn btn-primary pull-right\" data-ng-click=\"saveSettings()\">\r" +
    "\n" +
    "                <i class=\"self-icon-ok\"></i>\r" +
    "\n" +
    "                <span>Apply settings</span>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</fieldset>\r" +
    "\n"
  );


  $templateCache.put('template/deploy.html',
    "<fieldset>\r" +
    "\n" +
    "    <legend><i class=\"self-icon-fork\"></i><span class=\"indent6\">Deploy instructions</span></legend>\r" +
    "\n" +
    "    <div class=\"row-fluid\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"span9\">\r" +
    "\n" +
    "            <p>\r" +
    "\n" +
    "                To deploy application you are must use client-side tool.<br/>\r" +
    "\n" +
    "                See full version in <a href=\"https://github.com/AndyGrom/node-deploy-client\" target=\"_blank\">github</a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "            <hr/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h1>The Node.js deploy client</h1>\r" +
    "\n" +
    "            Node.js command-line tool is designed to help you deploy your node.js application<br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h3>Usages</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <ol>\r" +
    "\n" +
    "                <li>Install tool<br/>\r" +
    "\n" +
    "        <pre>\r" +
    "\n" +
    "npm install node-deploy-client -g</pre>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li>Configuration <br/>\r" +
    "\n" +
    "                    Create into root folder your project \".deploy\" file with next content:\r" +
    "\n" +
    "        <pre>\r" +
    "\n" +
    "{\r" +
    "\n" +
    "    \"development\" : {                                   // configuration name\r" +
    "\n" +
    "        \"url\" : \"http://admin:admin@localhost:15478\"    // deploy server url\r" +
    "\n" +
    "    },\r" +
    "\n" +
    "    \"staging\" : {                                       // other configuration name\r" +
    "\n" +
    "        \"url\" : \"http://admin:admin@192.168.1.3:15478\"  // other deploy server url\r" +
    "\n" +
    "    }\r" +
    "\n" +
    "}</pre>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    into your package.json file fill next fields\r" +
    "\n" +
    "        <pre>\r" +
    "\n" +
    "{\r" +
    "\n" +
    "    \"name\" : \"name of application\", // name must correlate with server-side application name\r" +
    "\n" +
    "    \"main\" : \"server.js\"            // main script what will performing after deploying\r" +
    "\n" +
    "}</pre>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li>Run tool into root folder your project\r" +
    "\n" +
    "        <pre>\r" +
    "\n" +
    "deploy &lt;configuration name&gt;</pre>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ol>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</fieldset>"
  );


  $templateCache.put('template/pane.html',
    "<div class=\"tab-pane\" ng-show=\"selected\" ng-transclude>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('template/server.html',
    "<fieldset>\r" +
    "\n" +
    "    <legend><i class=\"self-icon-cog\"></i><span class=\"indent6\">Server settings</span></legend>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row-fluid\">\r" +
    "\n" +
    "        <div class=\"span7\">\r" +
    "\n" +
    "            <div data-tabs=\"\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div data-pane title=\"Common\">\r" +
    "\n" +
    "                    <label>TCP port:</label>\r" +
    "\n" +
    "                    <input type=\"number\" data-ng-model=\"settings.port\" /> <br />\r" +
    "\n" +
    "                    <label>Username:</label>\r" +
    "\n" +
    "                    <input type=\"text\" data-ng-model=\"settings.username\" /> <br />\r" +
    "\n" +
    "                    <label>Password:</label>\r" +
    "\n" +
    "                    <input type=\"password\" data-ng-model=\"settings.password\" /> <br />\r" +
    "\n" +
    "                    <hr/>\r" +
    "\n" +
    "                    <label class=\"checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" data-ng-model=\"settings.autoCreateApplication\" /> Auto create deployed application\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    <label>Default folder for auto created applications</label>\r" +
    "\n" +
    "                    <input type=\"text\" data-ng-model=\"settings.defaultApplicationPath\" /><br />\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "                <div data-pane title=\"SSL\">\r" +
    "\n" +
    "                    <input type=\"checkbox\" data-ng-model=\"settings.ssl\"/> SSL support\r" +
    "\n" +
    "                    <label>Key\r" +
    "\n" +
    "                        <textarea rows=\"6\" spellcheck=\"false\"\r" +
    "\n" +
    "                                  class=\"input-block-level monospace\"\r" +
    "\n" +
    "                                  data-ng-change=\"keyOnChange()\"\r" +
    "\n" +
    "                                  data-ng-model=\"settings.key\"></textarea>\r" +
    "\n" +
    "                        \r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    <label>\r" +
    "\n" +
    "                        Certificate\r" +
    "\n" +
    "                        <textarea rows=\"6\" spellcheck=\"false\"\r" +
    "\n" +
    "                                  class=\"input-block-level monospace\"\r" +
    "\n" +
    "                                  data-ng-change=\"keyOnChange()\"\r" +
    "\n" +
    "                                  data-ng-model=\"settings.cert\"></textarea>\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button class=\"btn btn-primary pull-right\" data-ng-click=\"saveSettings()\">\r" +
    "\n" +
    "                <i class=\"self-icon-ok\"></i>\r" +
    "\n" +
    "                <span>Apply settings</span>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</fieldset>\r" +
    "\n"
  );


  $templateCache.put('template/tabs.html',
    "<div class=\"tabbable\">\r" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\r" +
    "\n" +
    "    <li ng-repeat=\"pane in panes\" ng-class=\"{active:pane.selected}\">\r" +
    "\n" +
    "      <a href=\"javascript:void(0)\" ng-click=\"select(pane)\">{{pane.title}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "  </ul>\r" +
    "\n" +
    "  <div class=\"tab-content\" ng-transclude></div>\r" +
    "\n" +
    "</div>"
  );

}]);
