module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/lilwizards.js',
        dest: 'build/lilwizards-min.js'
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'js/vendor/*',
          'js/utilities/*',
          'js/base/*',
          'js/spell_list/*',
          'js/objects/*',
          'js/menu/*',
          'js/game/*',
          'js/*'
        ],
        dest: 'build/lilwizards.js',
      },
    }
  });

  // Load the plugin that provides the uglify task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Tasks:
  grunt.registerTask('default', ['concat']);
  grunt.registerTask('build', ['concat', 'uglify']);

};
