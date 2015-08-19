var globalConfig = {
    'src' : 'public/src',
    'dist' : 'public/dist',
    'bower' : 'bower_components'
};

module.exports = function (grunt) {
    grunt.initConfig({
        'globalConfig' : globalConfig,
        'bower' : {
            'install' : {
                'options' : {
                    'targetDir' : '<%= globalConfig.src %>/libs',
                    'cleanTargetDir' : true,
                    'cleanBowerDir' : false
                }
            }
        },
        'jshint' : {
            'options' : {
                'ignores' : '<%= globalConfig.src %>/libs/**/*.js'
            },
            'rms' : ['<%= globalConfig.src %>/rms/**/*.js']
        },
        'uglify' : {
            'options' : {
                'sourceMap' : true
            },
            'development' : {
                'files' : {
                    '<%= globalConfig.dist %>/js/rms.min.js' : [
                            '<%= globalConfig.src %>/libs/angular/*.js',
                            '<%= globalConfig.src %>/libs/angular-resource/*.js',
                            '<%= globalConfig.src %>/libs/moment/*.js',
                            '<%= globalConfig.src %>/libs/moment-timezone/*.js',
                            '<%= globalConfig.src %>/libs/jstimezonedetect/*.js',
                            '<%= globalConfig.src %>/libs/**/*.js',
                            '<%= globalConfig.src %>/rms/*.js',
                            '<%= globalConfig.src %>/rms/*/*.js',
                            '<%= globalConfig.src %>/rms/**/*.js',
                            '!<%= globalConfig.src %>/libs/angular-mocks/angular-mocks.js',
                            '!<%= globalConfig.src %>/rms/**/*.tests.js',
                        ]
                }
            },
            'production' : {
                'options' : {
                    'sourceMap' : false
                },
                'files' : {
                    '<%= globalConfig.dist %>/js/rms.min.js' : [
                            '<%= globalConfig.src %>/libs/angular/*.js',
                            '<%= globalConfig.src %>/libs/angular-resource/*.js',
                            '<%= globalConfig.src %>/libs/moment/*.js',
                            '<%= globalConfig.src %>/libs/moment-timezone/*.js',
                            '<%= globalConfig.src %>/libs/jstimezonedetect/*.js',
                            '<%= globalConfig.src %>/libs/**/*.js',
                            '<%= globalConfig.src %>/rms/*.js',
                            '<%= globalConfig.src %>/rms/*/*.js',
                            '<%= globalConfig.src %>/rms/**/*.js',
                            '!<%= globalConfig.src %>/libs/angular-mocks/angular-mocks.js',
                            '!<%= globalConfig.src %>/rms/**/*.tests.js',
                        ]
                }
            }
        },
        'less' : {
            'options' : {
                'plugins' : [new (require('less-plugin-autoprefix'))({'browsers':["last 2 versions"]})]
            },
            'rms' : {
                'files' : {
                    '<%= globalConfig.dist %>/css/style.css' : [
                            '<%= globalConfig.src %>/rms/common/styles/style.less',
                            '<%= globalConfig.src %>/rms/**/view/*.less',
                            '<%= globalConfig.src %>/rms/**/edit/*.less',
                            '<%= globalConfig.src %>/rms/**/*.less',
                            '!<%= globalConfig.src %>/rms/common/styles/variables.less',
                            '!<%= globalConfig.src %>/rms/common/styles/mixins.less'
                        ]
                }
            }
        },
        'cssmin' : {
            'all' : {
                'files' : {
                    '<%= globalConfig.dist %>/css/style.min.css' : [
                            '<%= globalConfig.src %>/libs/**/*.css',
                            '<%= globalConfig.dist %>/css/style.css'
                        ]
                }
            }
        },
        'copy' : {
            'html' : {
                'files' : [
                    {
                        'expand' : true,
                        'flatten' : true,
                        'src' : ['<%= globalConfig.src %>/rms/**/*.html'],
                        'dest' : '<%= globalConfig.dist %>/html/',
                        'filter' : 'isFile'
                    }
                ]
            },
            'media' : {
                'files' : [
                    {
                        'expand' : true,
                        'flatten' : true,
                        'src' : [
                                '<%= globalConfig.src %>/rms/**/*.jpg',
                                '<%= globalConfig.src %>/rms/**/*.png',
                                '<%= globalConfig.src %>/rms/**/*.gif',
                                '<%= globalConfig.src %>/rms/**/*.svg'
                            ],
                        'dest' : '<%= globalConfig.dist %>/media/',
                        'filter' : 'isFile'
                    }
                ]
            }
        },
        'watch' : {
            'options' : {
              'livereload' : true,
            },
            'html' : {
                'files' : ['public/**/*.html'],
                'tasks' : ['copy']
            },
            'css' : {
                'files' : ['<%= globalConfig.src %>/rms/**/*.less'],
                'tasks' : ['less', 'cssmin']
            },
            'js' : {
                'files' : [
                        '<%= globalConfig.src %>/rms/**/*.js',
                        '<%= globalConfig.src %>/rms/*.js'
                    ],
                'tasks' : ['jshint', 'uglify']
            }
        },
        'concurrent' : {
            'options' : {
                'logConcurrentOutput' : true
            },
            'tasks' : ['nodemon:development', 'watch']
        },
        'nodemon' : {
            'development' : {
                'script' : 'index.js'
            },
            'production' : {
                'script' : 'index.js',
                'options' : {
                    'ignore' : ['**/*.*']
                }
            }
        },
        'karma' : {
            'unit' : {
                'options' : {
                    'frameworks' : ['jasmine'],
                    'singleRun' : true,
                    'browsers' : ['PhantomJS'],
                    'files' : [
                        '<%= globalConfig.src %>/libs/angular/*.js',
                        '<%= globalConfig.src %>/libs/angular-mocks/angular-mocks.js',
                        '<%= globalConfig.src %>/libs/angular-resource/*.js',
                        '<%= globalConfig.src %>/libs/moment/*.js',
                        '<%= globalConfig.src %>/libs/moment-timezone/*.js',
                        '<%= globalConfig.src %>/libs/jstimezonedetect/*.js',
                        '<%= globalConfig.src %>/libs/**/*.js',
                        '<%= globalConfig.src %>/rms/*.js',
                        '<%= globalConfig.src %>/rms/*/*.js',
                        '<%= globalConfig.src %>/rms/**/*.js'
                    ]
                }
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', [
        'bower',
        'less',
        'cssmin',
        'jshint',
        'uglify:development',
        'copy',
        'concurrent'
    ]);
    grunt.registerTask('test', [
        'jshint',
        'karma'
    ]);
    grunt.registerTask('production', [
        'bower',
        'less',
        'cssmin',
        'jshint',
        'uglify:production',
        'copy',
        'nodemon:production'
    ]);
};
