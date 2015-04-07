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
                    targetDir: "<%= globalConfig.src %>",
                    cleanup: true
                }
            }
        },
        jshint: {
            options: {
                ignores: ['<%= globalConfig.src %>/js/lib/*.js', '<%= globalConfig.src %>/js/lib/**/*.js']
            },
            all: ['<%= globalConfig.src %>/js/**/*.js']
        },
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    '<%= globalConfig.dist %>/js/rms.min.js': ['<%= globalConfig.src %>/js/*.js', '<%= globalConfig.src %>/js/lib/*.js', '<%= globalConfig.src %>/js/lib/**/*.js', '<%= globalConfig.src %>/js/**/*.js']
                }
            }
        },
        less: {
            build: {
                files: {
                    '<%= globalConfig.dist %>/css/style.css': '<%= globalConfig.src %>/css/style.less'
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    '<%= globalConfig.dist %>/css/style.min.css': '<%= globalConfig.dist %>/css/style.css'
                }
            }
        },
        watch: {
            css: {
                files: ['<%= globalConfig.src %>/css/**/*.less'],
                tasks: ['less', 'cssmin']
            },
            js: {
                files: ['<%= globalConfig.src %>/js/**/*.js'],
                tasks: ['jshint', 'uglify']
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

    grunt.registerTask('default', ['less', 'cssmin', 'jshint', 'uglify', 'concurrent']);
};
