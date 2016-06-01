    module.exports = function(grunt) {
    // Banner for JavaScript files
    // The info comes from package.json -- see http://gruntjs.com/configuring-tasks#templates for more about pulling in data from files
    // Insert the Live Reload script
    var liveReloadInjection =
            '\n(function(){' +
                'var s = document.createElement("script");' +
                's.src="//localhost:35729/livereload.js";' +
                'document.head.appendChild(s);' +
            '}());';

    var jsBanner = '/*! <%= pkg.title %>\n' +
                     ' *  @description  <%= pkg.description %>\n' +
                     ' *  @version      <%= pkg.version %>.REL<%= grunt.template.today("yyyymmdd") %>\n' +
                     ' *  @copyright    <%= grunt.template.today("yyyy") %> ' +
                     '<%= pkg.author.name %>\n */\n';

        // This banner will appear at the top style sheets
    var cssBanner = '@charset "utf-8";\n' + jsBanner;

    // Project configuration.
    grunt.initConfig({

        // Expose the banners to the tasks
        jsBanner: jsBanner,
        cssBanner: cssBanner,

        // All Grunt modules must be listed in the `package.json` file
        pkg: grunt.file.readJSON('package.json'),

        // Variables
        prod: false,

        // Remove temporary development files
        // https://github.com/gruntjs/grunt-contrib-clean
        clean: {
            options: {
                force:true
            },
            dist: [
                'dist'
            ],
        },

        concat: {
            css: {
                options: {
                    banner: cssBanner,
                },
                src: ['dist/css/main.css'],
                dest: 'dist/css/main.css',
            },
            js: {
                options: {
                    banner: jsBanner,
                },
                src: ['dist/js/main.js'],
                dest: 'dist/js/main.js',
            }
        },

        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/cui/fonts/',
                        src: ['**'],
                        dest: 'dist/fonts',
                        filter: 'isFile',
                    },
                    {
                        expand: true,
                        cwd: 'src/project/fonts/',
                        src: ['**'],
                        dest: 'dist/fonts',
                        filter: 'isFile',
                    },
                ],
            },
            images: {
                expand: true,
                cwd: 'src/',
                src: [
                        'cui/images/**.{png,jpg,jpeg,gif}',
                        'project/images/**.{png,jpg,jpeg,gif}',
                    ],
                dest: 'dist/images',
                filter: 'isFile',
                flatten: true,
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/cui/html/',
                        src: ['**/*.html'],
                        dest: 'dist',
                        filter: 'isFile',
                    },
                    {
                        expand: true,
                        cwd: 'src/cui/docs/',
                        src: [
                                '**/*.html',
                                '!src/**/*.html',
                            ],
                        dest: 'dist',
                        filter: 'isFile',
                    },
                    {
                        expand: true,
                        cwd: 'src/project/html/',
                        src: ['**/*.html'],
                        dest: 'dist',
                        filter: 'isFile',
                    },
                ],
            },
            templates: {
                expand: true,
                cwd: 'src/project/templates',
                src: ['**/*.html'],
                dest: 'dist/templates',
                filter: 'isFile',
                flatten: true,
            },
            docs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/cui/docs/src/assets/css',
                        src: ['**/*.css'],
                        dest: 'docs/assets/css',
                        filter: 'isFile',
                        flatten: true,
                    },
                    {
                        expand: true,
                        cwd: 'src/project/docs',
                        src: ['**/*.*'],
                        dest: 'docs/project',
                        filter: 'isFile',
                    },
                    {
                        expand: true,
                        cwd: 'src/cui/docs/src/assets/images',
                        src: ['**/*.*'],
                        dest: 'docs/assets/images',
                        filter: 'isFile',
                        flatten: true,
                    },
                    {
                        expand: true,
                        cwd: 'src/cui/docs/demos/',
                        src: ['**/*.*'],
                        dest: 'docs/demos',
                        filter: 'isFile',
                        flatten: true,
                    },
                ],
            },

            // Component documentation

            modalDocs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/project/components/modal/dist/docs',
                        src: ['**/*.*'],
                        dest: 'docs/components/modal',
                    },
                ],
            },

            popoverDocs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/project/components/popover/dist/docs',
                        src: ['**/*.*'],
                        dest: 'docs/components/popover',
                    },
                ],
            },

            shortcutDocs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/project/components/shortcut/dist/docs',
                        src: ['**/*.*'],
                        dest: 'docs/components/shortcut',
                    },
                ],
            },
        },

        // Local server at http://localhost:8888
        // https://github.com/gruntjs/grunt-contrib-connect
        connect: {
            server: {
                options: {
                    livereload: true,
                    port: 8888,
                    hostname: 'localhost',
                },
            },
        },

        // https://github.com/gruntjs/grunt-contrib-jshint
        // Supported options: http://jshint.com/docs/
        // Help with debugging common error messages: http://jslinterrors.com/
        // Basic hinting is provided for the projectjs. Additional hinting should be setup
        // the supporting component folders manually.
        jshint: {
            main: {
                options: {
                    curly: true,
                    eqeqeq: true,
                    browser: true,
                    unused: 'vars',
                    undef: true,
                    unused: true,
                    strict: false,
                    globals: {
                        jQuery: false,
                        define: false,
                        require: false,
                        emp: false,
                        fwData: false,
                    },
                },
                src: [
                    'src/project/js/**/*.js',
                ],
            },
        },

        md2html: {
            options: {
                highlightjs: {
                    enabled: true,
                    style: 'github',
                    compressStyle: true,
                },
            },
            docs: {
                options: {
                    layout: 'src/cui/docs/src/assets/templates/default.html',
                },
                files: [{
                    expand: true,
                    cwd: 'src/cui/docs/src',
                    src: ['**/*.md'],
                    dest: 'docs',
                    ext: '.html',
                }],
            },
            external: {
                options: {
                    layout: 'src/cui/docs/src/assets/templates/external.html',
                },
                files: [{
                    expand: true,
                    cwd: 'src/cui/docs/src',
                    src: ['**/*.md'],
                    dest: 'docs',
                    ext: '.html',
                }],
            },
        },

        // Builds the default javascript CUI library using r.js compiler
        requirejs: {
            main: {
                options: {
                    baseUrl: 'src/', // Where all our resources will be
                    name: '../tasks/libs/requireManager/temp/settings', // Where the generated temp file will be
                    paths: {}, // Generate build file
                    include: [
                        "requirejs",
                        "css",
                        "text",
                        "json",
                        "domReady",
                        "lazyLoader",
                        "jquery",
                        "cui"
                    ],
                    optimize: 'none', // 'uglify2',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    out: 'dist/js/main.js', // Where the final project will be output
                },
            },
        },

        // https://github.com/sindresorhus/grunt-sass
        sass: {
            main: {
                options: {
                    sourceMap: true,
                    outputStyle: 'nested', // Options: "nested", "compressed" (i.e. minified)
                },
                files: {
                    'dist/css/main.css': 'src/project/scss/project.scss',
                },
            },
        },

        // SVG optimization
        // https://github.com/sindresorhus/grunt-svgmin
        svgmin: {
            options: {
                plugins: [
                    // Full list of plugins that can be disabled: https://github.com/svg/svgo/tree/master/plugins
                    // To disable one, add a new object to this array, e.g. `{pluginName: false}`
                    { removeUselessStrokeAndFill: false },  // don't remove Useless Strokes and Fills
                ],
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                                'cui/images/**.svg',
                                'project/images/**.svg'
                            ],
                        dest: 'dist/images',
                        filter: 'isFile',
                        flatten: true,
                    },
                ],
            },
        },

        // https://github.com/gruntjs/grunt-contrib-uglify
        usebanner: {
            cssBanner: {
                options: {
                    position: 'top',
                    banner: cssBanner,
                    linebreak: true
                },
                files: {
                    src: [ 'dist/css/components/**/*.css' ],
                },
            },
            jsBanner: {
                options: {
                    position: 'top',
                    banner: jsBanner,
                    linebreak: true
                },
                files: {
                    src: [ 'dist/js/components/**/*.js' ],
                },
            },
        },

        watch: {
            options: {
                livereload: true,
                interrupt: true,
                spawn: false
            },

            // Task is used with development builds to keep the connect server running.
            noop: {
                files: [
                    'README.md',
                ],
            },

            // Project styles
            styles: {
                files: [
                        'src/cui/scss/**/*.scss',
                        'src/project/scss/**/*.scss',
                       ],
                tasks: ['sass:main'],
            },

            // Project HTML
            html: {
                files: ['src/project/html/**/*.html'],
                tasks: ['copy:html'],
            },

            // CUI docs
            cuiDocs: {
                files: [
                    'src/cui/docs/**/*.*',
                    'src/project/docs/**/*.*',
                ],
                tasks: ['copy:docs'],
            },
        },

    });

    ////////////////
    // Main tasks //
    ////////////////

    // Load npm based tasks
    require('load-grunt-tasks')(grunt);

    // Load local tasks in the task folder.
    grunt.loadTasks('tasks');

    grunt.registerTask('prod', 'Production', function (args) {

        // Change some setting to optimize the build

        // =================
        // == Build Flag ===
        // =================
        grunt.config.set('prod', true);

        // ===========
        // == SASS ===
        // ===========
        // var sass = grunt.config.get('sass');

        // sass.options.sourceMap = false;
        // sass.options.outputStyle = "compressed";

        // grunt.config.set('sass', sass);

        // ================
        // == RequireJS ===
        // ================

        // var requireJS = grunt.config.get('requirejs');

        // requireJS.compile.options.generateSourceMaps = false;
        // requireJS.compile.options.optimize = "uglify2";

        // grunt.config.set('requirejs', requireJS);

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Other tasks like uglify and cssmin are handled by the requireManager build process.
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        grunt.task.run([
            'clean',
            'md2html:docs', // Comment this out when you dont need the Getting Started docs any longer
            'componentFinder',
            'copy',
            'svgmin',
            'sass',
            'requirejs',
            'concat',
            'copy',
            'usebanner',
        ]);
    });

    // Alias for production build
    grunt.registerTask('dist', 'prod');

    // Development: compile script and styles, start a local server, and watch for file changes
    // Only use this for local development
    grunt.registerTask('dev', 'Development', function (args) {
        // Dynamically alter tasks when dev is called specifically

        // Get Concat settings
        var concatObj = grunt.config.get('concat');

        // Add liveload to the footer
        concatObj.js.options['footer'] = liveReloadInjection;

        // Update concat
        grunt.config.set('concat', concatObj);

        // Run the development build process
        grunt.task.run([
            'clean',
            'md2html:docs', // Comment this out when you dont need the Getting Started docs any longer
            'componentFinder',
            'copy',
            'svgmin',
            'sass',
            'requirejs',
            'concat',
            'copy',
            'usebanner',
            'watch',
            'connect',
        ]);
    });

    // Documentation for an external site
    grunt.registerTask('docs', 'Documentation', function (args) {
        grunt.task.run([
            'clean',
            'md2html',
            'componentFinder',
            // 'svgmin',
            'sass',
            'requirejs',
            'copy',
            'clean', // Remove `dist` folder which is no longer needed
            // 'concat',
            // 'usebanner',
        ]);
    });

    // Simple web server
    grunt.registerTask('server', 'Server', ['connect', 'watch:noop']);

    // Set the default task to the development build
    grunt.registerTask('default', 'dev');
};
