/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    'www/static/js/vendor/modernizr.js',
                    'www/static/js/vendor/angular.js',
                    'www/static/js/vendor/angular-route.js',
                    'www/static/js/scripts/*.js'],
                dest: 'www/static/dist/app.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'www/static/dist/app.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                globals: {
                    jQuery: true,
                    angular: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['www/static/js/scripts/*.js', 'test/**/*.js']
            }
        },
        cssmin: {
            combine: {
                files: {
                    'www/static/dist/app.min.css': [
                        'www/static/css/normalize.css',
                        'www/static/css/bootstrap.css',
                        'www/static/css/icon-font.css',
                        'www/static/css/icon-animation.css',
                        'www/static/css/angular-csp.css',
                        'www/static/css/app.css'
                    ],
                    'www/static/dist/login.min.css':[
                        'www/static/css/normalize.css',
                        'www/static/css/icon-font.css',
                        'www/static/css/login.css'
                    ]
                }
            }
        },
        ngtemplates:  {
            app: {
                cwd:  'www/static/',
                src:  'template/*.html',
                dest: 'www/static/js/scripts/templates.js'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-release');

    // Default task.
    grunt.registerTask('default', ['jshint', 'ngtemplates', 'concat', 'uglify', 'cssmin']);

};
