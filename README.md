# templates-bb

Javascript templating library based on Backbone.


## Status

Completed - Built for [gitchat](https://github.com/baguetteapps/gitchat_web).


## Dependencies

- [jQuery](http://jquery.com/)
- [Underscore](http://underscorejs.org/)
- [Backbone](http://backbonejs.org/)


## Try it

1. Clone this repository
2. Install node.js
3. Launch the local server - node server.js
4. Compile template - python templates.py
5. Go to [http://127.0.0.1:1337](http://127.0.0.1:1337)
6. Browse the pages and change language


## Usage

0. Copy what's in the RC.tools namespace in your Backbone app (unless you have your own functions, in that substitute them in the next step),
1. Copy what's in the RC.template namespace in your Backbone app,
2. Compile your templates using the python script (python templates.py),
3. Make sure the url in TemplateCollection points to where your compiled templates are,
4. In your view that uses template, add this attribute:
```JS
	template: new RC.template.TemplateModel()
```
5. In your view that uses template, define your initialization function like this:
```JS
	initialize: function() {
		// Get template model
		var template = RC.test.templates.where({ _name: "my_template_name" });

		// Create template view
		if (1 === template.length) {
			this.template = template[0];
			this.template.view = new RC.template.TemplateView({ model: this.template });
		}

		// Do your own thing...
	},
```
5. In your view that uses template, define your render function like this:
```JS
	render: function() {
		// Do your own thing...

		// Replace the content by the template
		this.$el.html(this.template.view.render());
	},
```
6. Finally, in your app, add this line:
```JS
	RC.template.ready(holder, object, callback);
```
Where holder is where your templates will be stored; object is extra parameters you wish to pass to the TemplateCollection (like default language, etc); callback is a function to be executed once all templates are loaded.


## Usage bis

Should you need to build your html in 2 times:

1. The data pass, that can potentially insert some localized strings in your code
2. The language pass, that will replace localized strings by the correct text

Use ```RC.template.DoublePassTemplateModel``` instead of the regular ```RC.template.TemplateModel``` (replace the ```model``` in ```RC.template.TemplateCollection```), it will do the trick.

To differentiate data from language, ```<% evaluated_data %>``` and ```<%= interpolated_data %>``` are used for the data pass; and ```<@ evaluated_lang @>``` and ```<@= interpolated_lang @>``` are used for the language pass.


## License

templates-bb.js is released under the MIT license.


## Author

[Rémi Chaignon](http://www.github.com/remichaignon) - Front End Developer at Simple Energy - [@remichaignon](http://twitter.com/remichaignon)