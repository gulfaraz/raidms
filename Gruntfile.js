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
                    'targetDir' : "<%= globalConfig.src %>/libs",
                    'cleanTargetDir' : true,
                    'cleanBowerDir' : false
                }
            }
        },
        'jshint' : {
            'options' : {
                'ignores' : '<%= globalConfig.src %>/libs/**/*.js'
            },
            'all' : ['<%= globalConfig.src %>/rms/**/*.js']
        },
        'uglify' : {
            'options' : {
                'sourceMap' : true //false
            },
            'build' : {
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
            'build' : {
                'files' : {
                    '<%= globalConfig.dist %>/css/style.css' : '<%= globalConfig.src %>/rms/**/*.less'
                }
            }
        },
        'cssmin' : {
            'build' : {
                'files' : {
                    '<%= globalConfig.dist %>/css/style.min.css' : ['<%= globalConfig.src %>/libs/**/*.css', '<%= globalConfig.dist %>/css/style.css']
                }
            }
        },
        'watch' : {
            'options' : {
              'livereload' : true,
            },
            'css' : {
                'files' : ['<%= globalConfig.src %>/rms/**/*.less'],
                'tasks' : ['less', 'cssmin']
            },
            'js' : {
                'files' : ['<%= globalConfig.src %>/rms/**/*.js', '<%= globalConfig.src %>/rms/*.js'],
                'tasks' : ['jshint', 'uglify']
            }
        },
        'concurrent' : {
            'options' : {
                'logConcurrentOutput' : true
            },
            'tasks' : ['nodemon', 'watch']
        },
        'nodemon' : {
            'dev' : {
                'script' : 'index.js'
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

    grunt.loadNpmTasks('grunt-bower-installer');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['bower', 'less', 'cssmin', 'jshint', 'uglify', 'concurrent']);
    grunt.registerTask('test', ['jshint', 'karma']);
};
