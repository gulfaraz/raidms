var globalConfig = {
    src: 'public/src',
    dist: 'public/dist',
    bower: 'bower_components'
};

module.exports = function(grunt) {
    grunt.initConfig({
        globalConfig: globalConfig,
        bower: {
            install: {
                options: {
                    targetDir: "<%= globalConfig.src %>/libs",
                    cleanup: false //true
                }
            }
        },
        jshint: {
            options: {
                ignores: '<%= globalConfig.src %>/libs/**/*.js'
            },
            all: ['<%= globalConfig.src %>/rms/js/**/*.js']
        },
        uglify: {
            options: {
                sourceMap: true //false
            },
            build: {
                files: {
                    '<%= globalConfig.dist %>/js/rms.min.js': [
                        '<%= globalConfig.src %>/libs/angular/*.js',
                        '<%= globalConfig.src %>/libs/angular-resource/*.js',
                        '<%= globalConfig.src %>/libs/moment/*.js',
                        '<%= globalConfig.src %>/libs/moment-timezone/*.js',
                        '<%= globalConfig.src %>/libs/jstimezonedetect/*.js',
                        '<%= globalConfig.src %>/libs/angular-moment/*.js',
                        '<%= globalConfig.src %>/libs/**/*.js',
                        '<%= globalConfig.src %>/rms/js/*.js',
                        '<%= globalConfig.src %>/rms/js/**/*.js'
                    ]
                }
            }
        },
        less: {
            build: {
                files: {
                    '<%= globalConfig.dist %>/css/style.css': '<%= globalConfig.src %>/rms/css/style.less'
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    '<%= globalConfig.dist %>/css/style.min.css': ['<%= globalConfig.src %>/libs/**/*.css', '<%= globalConfig.dist %>/css/style.css']
                }
            }
        },
        watch: {
            css: {
                files: ['<%= globalConfig.src %>/rms/css/**/*.less'],
                tasks: ['less', 'cssmin'],
                options: {
                    livereload: false,
                }
            },
            js: {
                files: ['<%= globalConfig.src %>/rms/js/**/*.js'],
                tasks: ['jshint', 'uglify'],
                options: {
                    livereload: false,
                }
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        },
        nodemon: {
            dev: {
                script: 'index.js'
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

    grunt.registerTask('default', ['bower', 'less', 'cssmin', 'jshint', 'uglify', 'concurrent']);
};
