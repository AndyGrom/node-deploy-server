angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/applications.html',
    "<fieldset>\n" +
    "    <legend><i class=\"self-icon-cog-alt\"></i><span class=\"indent6\">Applications</span></legend>\n" +
    "    <div class=\"row-fluid\">\n" +
    "\n" +
    "        <div class=\"span3\">\n" +
    "            <div class=\"well\">\n" +
    "                <div class=\"nav\">\n" +
    "                    <ul class=\"nav nav-list\">\n" +
    "                        <li class=\"divider\"></li>\n" +
    "                        <li ng-repeat=\"(name, properties) in applications\" ng-class=\"currentAppName == name ? 'active' : ''\">\n" +
    "                            <a href=\"\" ng-click=\"selectApplication(name)\">\n" +
    "                                <i class=\"self-icon-cog-alt\">  </i>\n" +
    "                                {{name}}\n" +
    "                                <i data-ng-show=\"currentAppName == name\"\n" +
    "                                   data-ng-click=\"removeApplication(name)\"\n" +
    "                                   class=\"self-icon-cancel pull-right\"\n" +
    "                                   title=\"remove application\">\n" +
    "                                </i>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li class=\"divider\"></li>\n" +
    "                        <li>\n" +
    "                            <button class=\"btn btn-block\" data-ng-click=\"showNewApplication = !showNewApplication\">\n" +
    "                                <i class=\"self-icon-doc-new\"></i>\n" +
    "                                <span>Create application</span>\n" +
    "                            </button>\n" +
    "                            <div data-ng-show=\"showNewApplication\">\n" +
    "                                <label>Application name:</label>\n" +
    "                                <input class=\"input-block-level\"\n" +
    "                                       type=\"text\"\n" +
    "                                       required\n" +
    "                                       data-ng-model=\"newApplicationName\"\n" +
    "                                       data-ng-change=\"newApplicationNameChange()\" />\n" +
    "                                <button class=\"btn btn-primary btn-block\" data-ng-click=\"createApplication()\" data-ng-disabled=\"!newApplicationNameValid\">\n" +
    "                                    <i class=\"self-icon-ok\"></i>\n" +
    "                                    <span>Create</span>\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"span9\" ng-show=\"currentApp\">\n" +
    "\n" +
    "            <div data-tabs=\"\">\n" +
    "\n" +
    "                <div data-pane title=\"Common\">\n" +
    "                    <label>Path</label>\n" +
    "                    <input type=\"text\" data-ng-model=\"currentApp.path\" /> <br />\n" +
    "                    <label class=\"checkbox\">\n" +
    "                        <input type=\"checkbox\" data-ng-model=\"currentApp.startProcess\" /> (startProcess) Run an application.\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div data-pane title=\"Monitoring\">\n" +
    "                    <h5>\n" +
    "                        See <a href=\"https://github.com/nodejitsu/forever-monitor#options-available-when-using-forever-in-nodejs\" target=\"_blank\">forever-monitor</a> for details\n" +
    "                    </h5>\n" +
    "                    <div data-tabs=\"\">\n" +
    "                        <div data-pane title=\"Basic configuration options\">\n" +
    "                            <label class=\"checkbox\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"currentApp.foreverConfig.silent\"> (silent) Silences the output from stdout and stderr in the parent process\n" +
    "                            </label>\n" +
    "                            <label>(uid) Custom uid for this forever process. (default: autogen)</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.uid\">\n" +
    "                            <label>(pidFile) Path to put pid information for the process(es) started</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.pidFile\" placeholder=\"path/to/a.pid\">\n" +
    "                            <label>(max) Sets the maximum number of times a given script should run</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.max\"> <br />\n" +
    "                            <label class=\"checkbox\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"currentApp.foreverConfig.killTree\" value=\"1\"> (killTree) Kills the entire child process tree on `exit`\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div data-pane title=\"Restart\">\n" +
    "                            <h5>These options control how quickly forever restarts a child process as well as when to kill a \"spinning\" process </h5>\n" +
    "\n" +
    "                            <label>(minUptime) Minimum time a child process has to be up. Forever will 'exit' otherwise.</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.minUptime\" placeholder=\"2000\">\n" +
    "                            <label>(spinSleepTime) Interval between restarts if a child is spinning (i.e. alive < minUptime).</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.spinSleepTime\" placeholder=\"1000\">\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div data-pane title=\"Spawn process\">\n" +
    "                            <h5>Command to spawn as well as options and other vars (env, cwd, etc) to pass along</h5>\n" +
    "\n" +
    "                            <label>(command) Binary to run (default: 'node')</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.command\" placeholder=\"node\" />\n" +
    "\n" +
    "                            <label>(options) Additional arguments to pass to the script</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.options\" placeholder=\"foo bar\" />\n" +
    "\n" +
    "                            <label>(sourceDir) Directory that the source script is in</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.sourceDir\" placeholder=\"script/path\" />\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div data-pane title=\"Watch\">\n" +
    "                            <h5>Options for restarting on watched files.</h5>\n" +
    "                            <label class=\"checkbox\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"currentApp.foreverConfig.watch\" /> (watch) Value indicating if we should watch files.\n" +
    "                            </label>\n" +
    "\n" +
    "                            <label>Dot files we should read to ignore ('.foreverignore', etc).</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.watchIgnoreDotFiles\" placeholder=\"null\" />\n" +
    "\n" +
    "                            <label>Ignore patterns to use when watching files.</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.watchIgnorePatterns\" placeholder=\"null\" />\n" +
    "\n" +
    "                            <label>Top-level directory to watch from.</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.watchDirectory\" placeholder=\"null\" />\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div data-pane title=\"Spawn options\">\n" +
    "                            <h5>All or nothing options passed along to `child_process.spawn`.</h5>\n" +
    "\n" +
    "                            <label>(spawnWith.customFds) that forever spawns.</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.spawnWith.customFds\" placeholder=\"-1, -1, -1\" /> <br />\n" +
    "                            \n" +
    "                            <label class=\"checkbox\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"currentApp.foreverConfig.spawnWith.setsid\" /> (spawnWith.setsid)\n" +
    "                            </label>\n" +
    "\n" +
    "                            <h5>More specific options to pass along to `child_process.spawn` which will override anything passed to the `spawnWith` option</h5>\n" +
    "\n" +
    "                            <label>(cwd) current working directory</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.cwd\" placeholder=\"/path/to/child/working/directory\" />\n" +
    "\n" +
    "                            <h5>Environment Variables passed to the application</h5>\n" +
    "\n" +
    "                            <label>process.env attributes in JSON Format</label>\n" +
    "                            <textarea json ng-model=\"currentApp.foreverConfig.env\" rows=\"8\"></textarea>\n" +
    "\n" +
    "                        </div>\n" +
    "                        <div data-pane title=\"Log files\">\n" +
    "                            <h5>Log files and associated logging options for this instance</h5>\n" +
    "\n" +
    "                            <label>(logFile) Path to log output from forever process (when daemonized)</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.logFile\" placeholder=\"path/to/file\" />\n" +
    "\n" +
    "                            <label>(outFile) Path to log output from child stdout</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.outFile\" placeholder=\"path/to/file\" />\n" +
    "\n" +
    "                            <label>(errFile) Path to log output from child stderr</label>\n" +
    "                            <input type=\"text\" ng-model=\"currentApp.foreverConfig.errFile\" placeholder=\"path/to/file\" />\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <button class=\"btn btn-primary pull-right\" data-ng-click=\"saveSettings()\">\n" +
    "                <i class=\"self-icon-ok\"></i>\n" +
    "                <span>Apply settings</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</fieldset>\n"
  );


  $templateCache.put('template/deploy.html',
    "<fieldset>\n" +
    "    <legend><i class=\"self-icon-fork\"></i><span class=\"indent6\">Deploy instructions</span></legend>\n" +
    "    <div class=\"row-fluid\">\n" +
    "\n" +
    "        <div class=\"span9\">\n" +
    "            <p>\n" +
    "                To deploy application you are must use client-side tool.<br/>\n" +
    "                See full version in <a href=\"https://github.com/AndyGrom/node-deploy-client\" target=\"_blank\">github</a>\n" +
    "            </p>\n" +
    "            <hr/>\n" +
    "\n" +
    "            <h1>The Node.js deploy client</h1>\n" +
    "            Node.js command-line tool is designed to help you deploy your node.js application<br/>\n" +
    "\n" +
    "            <h3>Usages</h3>\n" +
    "\n" +
    "            <ol>\n" +
    "                <li>Install tool<br/>\n" +
    "        <pre>\n" +
    "npm install node-deploy-client -g</pre>\n" +
    "\n" +
    "                </li>\n" +
    "\n" +
    "                <li>Configuration <br/>\n" +
    "                    Create into root folder your project \".deploy\" file with next content:\n" +
    "        <pre>\n" +
    "{\n" +
    "    \"development\" : {                                   // configuration name\n" +
    "        \"url\" : \"http://admin:admin@localhost:15478\"    // deploy server url\n" +
    "    },\n" +
    "    \"staging\" : {                                       // other configuration name\n" +
    "        \"url\" : \"http://admin:admin@192.168.1.3:15478\"  // other deploy server url\n" +
    "    }\n" +
    "}</pre>\n" +
    "\n" +
    "                    into your package.json file fill next fields\n" +
    "        <pre>\n" +
    "{\n" +
    "    \"name\" : \"name of application\", // name must correlate with server-side application name\n" +
    "    \"main\" : \"server.js\"            // main script what will performing after deploying\n" +
    "}</pre>\n" +
    "\n" +
    "                </li>\n" +
    "                <li>Run tool into root folder your project\n" +
    "        <pre>\n" +
    "deploy &lt;configuration name&gt;</pre>\n" +
    "\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</fieldset>"
  );


  $templateCache.put('template/pane.html',
    "<div class=\"tab-pane\" ng-show=\"selected\" ng-transclude>\n" +
    "</div>"
  );


  $templateCache.put('template/server.html',
    "<fieldset>\n" +
    "    <legend><i class=\"self-icon-cog\"></i><span class=\"indent6\">Server settings</span></legend>\n" +
    "\n" +
    "    <div class=\"row-fluid\">\n" +
    "        <div class=\"span7\">\n" +
    "            <div data-tabs=\"\">\n" +
    "\n" +
    "                <div data-pane title=\"Common\">\n" +
    "                    <label>TCP port:</label>\n" +
    "                    <input type=\"number\" data-ng-model=\"settings.port\" /> <br />\n" +
    "                    <label>Username:</label>\n" +
    "                    <input type=\"text\" data-ng-model=\"settings.username\" /> <br />\n" +
    "                    <label>Password:</label>\n" +
    "                    <input type=\"password\" data-ng-model=\"settings.password\" /> <br />\n" +
    "                    <hr/>\n" +
    "                    <label class=\"checkbox\">\n" +
    "                        <input type=\"checkbox\" data-ng-model=\"settings.autoCreateApplication\" /> Auto create deployed application\n" +
    "                    </label>\n" +
    "                    <label>Default folder for auto created applications</label>\n" +
    "                    <input type=\"text\" data-ng-model=\"settings.defaultApplicationPath\" /><br />\n" +
    "\n" +
    "</div>\n" +
    "                <div data-pane title=\"SSL\">\n" +
    "                    <input type=\"checkbox\" data-ng-model=\"settings.ssl\"/> SSL support\n" +
    "                    <label>Key\n" +
    "                        <textarea rows=\"6\" spellcheck=\"false\"\n" +
    "                                  class=\"input-block-level monospace\"\n" +
    "                                  data-ng-change=\"keyOnChange()\"\n" +
    "                                  data-ng-model=\"settings.key\"></textarea>\n" +
    "                        \n" +
    "                    </label>\n" +
    "                    <label>\n" +
    "                        Certificate\n" +
    "                        <textarea rows=\"6\" spellcheck=\"false\"\n" +
    "                                  class=\"input-block-level monospace\"\n" +
    "                                  data-ng-change=\"keyOnChange()\"\n" +
    "                                  data-ng-model=\"settings.cert\"></textarea>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "            <button class=\"btn btn-primary pull-right\" data-ng-click=\"saveSettings()\">\n" +
    "                <i class=\"self-icon-ok\"></i>\n" +
    "                <span>Apply settings</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</fieldset>\n"
  );


  $templateCache.put('template/tabs.html',
    "<div class=\"tabbable\">\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ng-repeat=\"pane in panes\" ng-class=\"{active:pane.selected}\">\n" +
    "      <a href=\"javascript:void(0)\" ng-click=\"select(pane)\">{{pane.title}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <div class=\"tab-content\" ng-transclude></div>\n" +
    "</div>"
  );

}]);
