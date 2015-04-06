module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: ['public/src/js/**/*.js']
        },
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    'public/dist/js/rms.min.js': ['public/src/js/*.js', 'public/src/js/**/*.js']
                }
            }
        },
        less: {
            build: {
                files: {
                    'public/dist/css/style.css': 'public/src/css/style.less'
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    'public/dist/css/style.min.css': 'public/dist/css/style.css'
                }
            }
        },
        watch: {
            css: {
                files: ['public/src/css/**/*.less'],
                tasks: ['less', 'cssmin']
            },
            js: {
                files: ['public/src/js/**/*.js'],
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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['less', 'cssmin', 'jshint', 'uglify', 'concurrent']);
};
