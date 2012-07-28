# templates-bb

Javascript templating library based on Backbone.


## Status

Completed - Built for [gitchat](https://github.com/baguetteapps/gitchat_web).


## Dependencies

- [jQuery](http://jquery.com/)
- [Underscore](http://underscorejs.org/)
- [Backbone](http://backbonejs.org/)


## Example

1. Clone this repository
2. Install node.js
3. Launch the local server - node server.js
4. Compile template - python templates.py
5. Go to [http://127.0.0.1:1337](http://127.0.0.1:1337)
6. Browse the pages and change language


## Usage

0. Add templates-bb.js to your scripts,
1. Compile your templates using the python script (python templates.py), change the path to your templates in the script if necessary,
2. In your view that uses template, add this attribute (optional):
```JS
	template: null
```
3. In your view that uses template, define your initialization function like this:
```JS
	initialize: function() {
		// Get template
		this.template = my_template_holder.templates.where({ name: "my_template_name" })[0];

		// Do your own thing...
	},
```
4. In your view that uses template, define your render function like this:
```JS
	render: function() {
		// Do your own thing...

		// Replace the content by the template
		this.$el.html(this.template.render());
	},
```
5. Finally, in your app, add this line:
```JS
	var my_options = { baseURL: "/path_to_template_folder", lang: "en" };
	TemplatesBB.ready(my_template_holder, my_options, my_callback);
```
Where my_template_holder is where your templates will be stored (it must match with step 3); my_options is parameters you wish to pass to the TemplateCollection (like the baseURL to your template files, default language, etc); my_callback is a function to be executed once all templates are loaded.


## Usage bis

Should you need to build your html in 2 times:

1. The data pass, that can potentially insert some localized strings in your code
2. The language pass, that will replace localized strings by the correct text

To differentiate data from language, ```<% evaluated_data %>``` and ```<%= interpolated_data %>``` are used for the data pass; and ```<@ evaluated_lang @>``` and ```<@= interpolated_lang @>``` are used for the language pass.

The templates builder script (templates.py), will automatically detect if you use this form of template (it will look for the presence of ```<@ abc @>``` or ```<@= def @>```), set a flag, and as a result the program will instanciate the correct type of template.


## License

templates-bb.js is released under the MIT license.


## Author

[Rémi Chaignon](http://www.github.com/remichaignon) - Front End Developer at Simple Energy - [@remichaignon](http://twitter.com/remichaignon)