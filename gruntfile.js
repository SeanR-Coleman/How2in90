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
            docs: {
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
                    dest: 'docs/'
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'node_modules/font-awesome', 
                    src: ['fonts/*.*'],
                    dest: 'docs'
                }]
            }
        },
        clean: {
            build: {
                src: ['docs/']
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    // dot: true,
                    cwd: './',
                    src: ['img/*.{png,jpg,JPG,gif}'],
                    dest: 'docs/'
                }]
            }
        },
        useminPrepare: {
            foo: {
                dest: 'docs/',
                src: ['habit.html','aboutus.html','Content.html','index.html']
            },
            options: {
                dest: 'docs/',
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
            docs: {}
        },
        // Uglify
        uglify: {
            // dist configuration is provided by useminPrepare
            docs: {}
        },
        cssmin: {
            docs: {}
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
                        'docs/js/*.js',
                        'docs/css/*.css',
                    ]
                }]
            }
        },
        // Usemin
        // Replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets
        // according to their relative paths
        usemin: {
            html: ['docs/habit.html','docs/aboutus.html','docs/index.html', 'docs/Content.html'],
            options: {
                assetsDirs: ['docs', 'docs/css','docs/js']
            }
        },
        htmlmin: {                                         // Task
            docs: {                                        // Target
                options: {                                 // Target options
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'docs/index.html': 'docs/index.html',  // 'destination': 'source'
                    'docs/habit.html': 'docs/habit.html',
                    'docs/aboutus.html': 'docs/aboutus.html',
                    'docs/Content.html': 'docs/Content.html',
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
                  src: ['docs/index.html'],
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
    grunt.registerTask('css', ['cssmin']);
};