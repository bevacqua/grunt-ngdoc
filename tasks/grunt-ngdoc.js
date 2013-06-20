var readerFactory = require('../src/reader.js'),
    ngdoc = require('../src/ngdoc.js'),
    path = require('path');

module.exports = function(grunt){
  var _ = grunt.util._;

  grunt.registerTask('ngdoc', 'build documentation', function() {
    var start = now(),
        done = this.async(),
        options = this.options({
          dest: 'docs/',
          startPage: '/api',
          title: '',
          html5Mode: true
        }),
        setup = prepareSetup(options), docs = [];

    grunt.log.writeln('Generating Documentation...');

    var key, sections = options.sections, sectionDocuments;
    for(key in sections){
      sectionDocuments = generateSection(setup, key, sections[key], options);
      docs = docs.concat(sectionDocuments);
    }

    writeSitemap(options.dest, options.host, docs);
    writeDocIndex(setup);

    grunt.log.writeln('DONE. Generated ' + docs.length + ' pages in ' + (now()-start) + 'ms.');
    done();
  });

  function generateSection(setup, key, section, options){
    var reader = readerFactory();

    setup.sections[key] = section.title || 'API Documentation';
    setup.apis[key] = section.api || section == 'api';
    grunt.file.expand(section.src).filter(exists).forEach(function(filepath) {
      var content = grunt.file.read(filepath);
      reader.process(content, filepath, key, options);
    });

    ngdoc.merge(reader.docs);

    reader.docs.forEach(function(doc){
      // this hack is here because on OSX angular.module and angular.Module map to the same file.
      var id = doc.id.replace('angular.Module', 'angular.IModule').replace(':', '.'),
          file = path.resolve(options.dest, 'partials', doc.section, id + '.html');

      grunt.file.write(file, doc.html());
    });

    setup.pages = _.union(setup.pages, ngdoc.metadata(reader.docs));

    return reader.docs;
  }

  function writeSitemap(dest, host, docs){
    var urls = docs.map(function(doc){
      if(doc.id === 'index'){
        return '/' + doc.section;
      }else{
        return '/' + doc.section + '/' + doc.id;
      }
    });

    var sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ];
    urls.sort().forEach(function(url){
      var freq = 'daily', priority = 1, page = [
        '<loc>' + host + url + '</loc>',
        '<changefreq>' + freq + '</changefreq>',
        '<priority>' + priority + '</priority>'
      ];
      sitemap.push('<url> ' + page.join(' ') + ' </url>');
    });
    sitemap.push('</urlset>');
    grunt.file.write(dest + '/sitemap.xml', sitemap.join('\n'));
  }

  function prepareSetup(options) {
    var setup, file = path.resolve(options.dest, 'pages.js');

    setup = { sections: {}, pages: [], apis: {} };
    setup.__file = file;
    setup.__options = options;
    return setup;
  }

  function writeDocIndex(setup) {
    var options = setup.__options;

    // create setup file
    setup.title = options.title;
    setup.html5Mode = options.html5Mode;
    setup.startPage = options.startPage;
    setup.discussions = options.discussions;

    grunt.file.write(setup.__file, 'NG_DOCS=' + JSON.stringify(setup, replacer, 2) + ';');
  }

  function exists(filepath) {
    return !!grunt.file.exists(filepath);
  }

  function replacer(key, value) {
    if (key.substr(0,2) === '__') {
      return undefined;
    }
    return value;
  }

  function now() { return new Date().getTime(); }
};
