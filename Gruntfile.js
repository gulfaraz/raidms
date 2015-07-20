var globalConfig = {
    'src' : 'public/src',
    'dist' : 'public/dist',
    'bower' : 'bower_components',
    'sourceMap' : true, //false
    'livereload' : true //false
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
            'all' : ['<%= globalConfig.src %>/rms/**/*.js']
        },
        'uglify' : {
            'options' : {
                'sourceMap' : '<%= globalConfig.sourceMap %>'
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
            'options' : {
                'plugins' : [new (require('less-plugin-autoprefix'))({ 'browsers' : ["last 2 versions"] })]
            },
            'build' : {
                'files' : {
                    '<%= globalConfig.dist %>/css/style.css' : ['<%= globalConfig.src %>/rms/*.less', '<%= globalConfig.src %>/rms/**/*.less', '!<%= globalConfig.src %>/rms/variables.less', '!<%= globalConfig.src %>/rms/mixins.less']
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
              'livereload' : '<%= globalConfig.livereload %>',
            },
            'html' : {
                'files' : ['public/**/*.html']
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

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['bower', 'less', 'cssmin', 'jshint', 'uglify', 'concurrent']);
    grunt.registerTask('test', ['jshint', 'karma']);
};
