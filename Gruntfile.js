/*global module: false*/
module.exports = function(grunt) {
    var

        // Banner for JavaScript files
        // The info comes from package.json -- see http://gruntjs.com/configuring-tasks#templates for more about pulling in data from files
        jsBanner = '/*! <%= pkg.title %>\n' +
                   ' *  @description  <%= pkg.description %>\n' +
                   ' *  @version      <%= pkg.version %>.REL<%= grunt.template.today("yyyymmdd") %>\n' +
                   ' *  @copyright    <%= grunt.template.today("yyyy") %> ' +
                   '<%= pkg.author.name %>\n */\n',

        // This banner will appear at the top style sheets
        cssBanner = '@charset "utf-8";\n' + jsBanner,

        // Appended to JS files
        jsFooter = '\n;uiGlobal.sVersion = "<%= pkg.version %>.REL<%= grunt.template.today("yyyymmdd") %>";',

        //////////////////////////
        // Lists of asset files //
        //////////////////////////

        jsCore = [
            // Libraries
            'js/src/vendor/**/*.js',

            // Main file(s)
            'js/src/core/**/*.js',
        ],

        jsComponents = [
            'js/src/components/**/*.js'
        ],

        // All JS files that will be included in the HTML (i.e. js/core.js)
        jsBuild = jsCore,

        // Scripts to be linted (i.e. every JS file that we hand-code)
        jsToLint = jsCore.concat(jsComponents),

        // Scripts to watch for changes (add compiled files to the main list)
        jsToWatch = jsToLint;

    // Load all Grunt tasks
    require('load-grunt-tasks')(grunt);

    /////////////////////////////
    // Configure Grunt plugins //
    /////////////////////////////

    // See http://gruntjs.com/configuring-tasks for general info about configuring plugins/tasks

    grunt.initConfig({
        // All Grunt modules must be listed in the `package.json` file
        pkg: grunt.file.readJSON('package.json'),

        // JS linting
        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                expr: true,
                unused: false,
                scripturl: true,
                evil: true,
                globals: {
                    UI: true,
                    jQuery: true,
                    Modernizr: true
                },
            },
            files: jsToLint,
        },

        // Minify and concatenate JS files
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            // Global uglify options
            options: {
                banner: jsBanner,
                preserveComments: 'some',
                sourceMap: true,
                mangle: false, // We need the variable names to be unchanged so other scripts (i.e. in-page `<script>` tags) can reference them
            },

            dev: {
                files: {
                    'js/dist/core.js': jsBuild,
                },
            },

            // No source maps or console logging
            prod: {
                options: {
                    sourceMap: false,
                    compress: {
                        drop_console: true,
                    }
                },
                files: {
                    'js/dist/core.js': jsBuild,
                },
            },
        },

        // Styles
        // https://github.com/sindresorhus/grunt-sass
        sass: {
            // Global options
            options: {
                sourceMap: false, // No source maps by default
                outputStyle: 'compressed', // Options: nested, compressed
            },

            // Development task
            dev: {
                options: {
                    sourceMap: true, // Enable source maps
                    outputStyle: 'nested',
                },
                files: {
                    'css/core/core.css': 'scss/core/core.scss'
                },
            },

            // Production task
            prod: {
                files: {
                    'css/core/core.css': 'scss/core/core.scss'
                },
            },
        },

        // Add banner to CSS files
        // The sass plugin doesn't allow us to add a banner so we need this to insert the version number at the top
        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            css: {
                options: {
                    // stripBanners: true,
                    banner: cssBanner,
                },
                src: ['css/core/core.css'],
                dest: 'css/core/core.css',
            },
        },

        // Watch for file changes and recompile the applicable files
        // Also refresh the browser if the local server is being used
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            options: {
                livereload: true,
                interrupt: true,
            },

            scripts: {
                files: jsToWatch,
                tasks: [
                    'jshint',
                    'uglify:dev',
                    'concat:js',
                ]
            },

            sass: {
                files: [
                    'scss/**/*.scss',
                ],
                tasks: [
                    'sass:dev',
                    'concat:css',
                ],
            },

            // This effectively does nothing but keep Grunt "running" (e.g. so the local server doesn't quit)
            noop: {
                files: [
                    'README.md'
                ],
            },
        },

        // Local server
        // Go to http://localhost:8888 in your browser to use it
        // https://github.com/gruntjs/grunt-contrib-connect
        connect: {
            server: {
                options: {
                    port: 8888
                }
            }
        },

        // Remove temporary development files
        // https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            // Temporary files and development goodies
            prod: [
                'css/**/*.map',
                'js/**/*.map',
                '.sass-cache/',
            ],
        },

    });
    // End of plugin configuration
    // Next we define the tasks we want to use

    ////////////////
    // Main tasks //
    ////////////////

    // Type these at a command prompt to use Grunt, for example "grunt prod" or "grunt dev"

    // Production: package main files for distribution
    // This is the default task (when you just type "grunt" at the command prompt)
    grunt.registerTask('prod', 'Production', function(args) {
        grunt.task.run([
            'sass:prod',
            'jshint',
            'uglify:prod',
            'concat',
            'clean:prod',
        ]);
    });

    // Development: compile script.js and style.css, start a local server, and watch for file changes
    // Only use this on your local machine while developing
    grunt.registerTask('dev', 'Development', function(args) {
        grunt.task.run([
            'sass:dev',
            'jshint',
            'uglify:dev',
            'concat',
            'connect',
            'watch'
        ]);
    });


    ///////////////////
    // Miscellaneous //
    ///////////////////

    // Start a local server
    // e.g. http://localhost:8888/Pages/Template/Template.html
    grunt.registerTask('server', 'Server', function(args) {
        grunt.task.run([
            'connect',
            'watch:noop',
        ]);
    });

    // Set the default task to the production build
    grunt.registerTask('default', 'prod');
};