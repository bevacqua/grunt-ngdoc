#grunt-ngdoc
Grunt plugin to create a documentation like [AngularJS](http://docs.angularjs.org)
NOTE: this plugin requires Grunt 0.4.x

##Getting Started
From the same directory as your project's Gruntfile and package.json, install this plugin with the following command:

`npm install grunt-ngdoc --save-dev`

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-ngdoc');
```

##Config
Inside your `Gruntfile.js` file, add a section named *ngdoc*.
Here's a simple example:

```js
ngdoc: {
  all: ['src/**/*.js']
}
```

And with all options:

```js
ngdoc: {
  options: {
    dest: 'docs'
    scripts: ['../app.min.js'],
    html5Mode: true,
    startPage: '/api',
    title: 'My Documentation',
    analytics: {
          account: 'UA-08150815-0',
          domainName: 'my-domain.com'
    },
    discussions: {
          shortName: 'my',
          url: 'http://my-domain.com',
          dev: false
    }
  },
  tutorial: {
    src: ['content/tutorial/*.ngdoc'],
    title: 'Tutorial'
  },
  api: {
    src: ['src/**/*.js', '!src/**/*.spec.js'],
    title: 'API Documentation'
  }
}
```

###Options

####dest
[default] 'docs'  
Folder relative to your Gruntfile were the documentation should be build.

####scripts
[default] ['angular.js']  
Set which angular.js file or addional custom js files are loaded to the app. This allows the live examles to use custom directives, services etc. The documentation app works with angular.js 1.0.+ and 1.1.+.

Possible values:

  - ['angular.js'] use angularjs 1.1.5 delivered with ngdoc
  - ['path/to/file.js'] file will be copied into the docs, into a `grunt-scripts` folder
  - ['http://example.com/file.js', 'https://example.com/file.js', '//example.com/file.js'] reference remote files (eg from a CDN)
  - ['../app.js'] reference file relative to the dest folder

####styles
[default] []  
Copy additional css files to the documentation app

####analytics
Optional include Google Analytics in the documentation app.

####discussions
Optional include [discussions](http://http://disqus.com) in the documentation app.

####title
[default] "name" or "title" field in `pkg` 
Title to put on the navbar and the page's `title` attribute.  By default, tries to
find the title in the `pkg`. If it can't find it, it will go to an empty string.

####startPage
[default] '/api'
Set first page to open. 

####html5Mode
[default] 'true'  
Whether or not to enable `html5Mode` in the docs application.  If true, then links will be absolute.  If false, they will be prefixed by `#/`.  

####animation
[default] 'false' or 'true' for the included angularjs, angularjs 1.1.5+ from CDN or a folder like /vendor/angular-1.1.5/angular.js.  
Set to 'true' to enable animations in the sidebar.

####navTemplate
[default] null  
Path to a template of a nav HTML template to include.  The css for it 
should be that of listitems inside a bootstrap navbar:
```html
<header class="header">
  <div class="navbar">
    <ul class="nav">
      {{links to all the docs pages}}
    </ul>
    {{YOUR_NAV_TEMPLATE_GOES_HERE}}
  </div>
</header>
```
Example: 'templates/my-nav.html'

###Targets
Each grunt target creates a section in the documentation app.

####src
[required] List of files to parse for documentation comments.

####title
[default] 'API Documentation'  
Set the name for the section in the documentation app.

####api
[default] true for target api  
Set the sidebar to advanced mode with sections for modules, services etc.


##How it works
The task parses the specified files for doc commets and extract these in partial html files for the documentation app.

No longer needed partials will not be deleted. Use for example the grunt-contrib-clean task to clean the docs folder before creating a distribution build.

A doc comment looks like this:
```js
/**
 * @ngdoc directive
 * @name rfx.directive:rAutogrow
 * @element textarea
 * @function
 *
 * @description
 * Resize textarea automatically to the size of its text content.
 *
 * **Note:** ie<9 needs pollyfill for window.getComputedStyle
 *
 * @example
   <example module="rfx">
     <file name="index.html">
         <textarea ng-model="text" r-autogrow class="input-block-level"></textarea>
         <pre>{{text}}</pre>
     </file>
   </example>
 */
angular.module('rfx', []).directive('rAutogrow', function() {
  //some nice code
});
```

See the [AngularJS source code](https://github.com/angular/angular.js/tree/master/src/ng) for more examples.

##License
MIT License
