'use strict';

module.exports = function(grunt){

    const sass = require('node-sass');
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
      });
    // grunt.loadNpmTasks('grunt-git');

    grunt.initConfig({
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    'css/styles.css': 'css/styles.scss'
                }
            }
        },
        watch: {
            files: 'css/*.scss',
            tasks: ['sass']
        }, 
        
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        '*.html',
                        'js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        },
        copy: {
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: './',
                    src: ['*.html'],
                    dest: 'dist/'
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'node_modules/font-awesome', 
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }]
            }
        },
        clean: {
            build: {
                src: ['dist/']
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    // dot: true,
                    cwd: './',
                    src: ['img/*.{png,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        },
        useminPrepare: {
            foo: {
                dest: 'dist/',
                src: ['Content.html','aboutus.html','index.html', 'habit.html']
            },
            options: {
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js:['uglify']
                    },
                    post: {
                        css: [{
                            name: 'cssmin',
                            createConfig: function (context, block) {
                            var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0, rebase: false
                                };
                            }       
                        }]
                    }
                }
            }
        },
        // Concat
        concat: {
            options: {
                separator: ';'
            },
            // dist configuration is provided by useminPrepare
            dist: {}
        },
        // Uglify
        uglify: {
            // dist configuration is provided by useminPrepare
            dist: {}
        },
        cssmin: {
            dist: {}
        },
        // Filerev
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
            // filerev:release hashes(md5) all assets (images, js and css )
            // in dist directory
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/css/*.css',
                    ]
                }]
            }
        },
        // Usemin
        // Replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets
        // according to their relative paths
        usemin: {
            html: ['dist/Content.html','dist/aboutus.html','dist/index.html', 'dist/habit.html'],
            options: {
                assetsDirs: ['dist', 'dist/css','dist/js']
            }
        },
        htmlmin: {                                         // Task
            dist: {                                        // Target
                options: {                                 // Target options
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'dist/index.html',  // 'destination': 'source'
                    'dist/Content.html': 'dist/Content.html',
                    'dist/aboutus.html': 'dist/aboutus.html',
                    'dist/habit.html': 'dist/habit.html',
                }
            }
        },
        gitadd: {
            task: {
                options: {
                force: true,
                all: true,
                cwd: '.git'
                },
                files: {
                src: ['.git/*.*']
                }
            }
        },
        gitcommit: {
            your_target: {
              options: {
                cwd: '.git',
                message: "Testing"
              },
              files: [
                {
                  cwd: '.git',
                  src: ['dist/index.html'],
                  expand: true
                  
                }
              ]
            }
          }

    });
    
    
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', [
        'clean',
        'copy',
        'imagemin',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);
    grunt.registerTask('git', ['gitadd', 'gitcommit']);
};