//
// templates-bb.js
//
// Javascript templating library using Backbone.
//
// ============================================================================
//
// TOOLS
// TEMPLATE
// TEST
// APPLICATION
//
// ============================================================================
//


(function(window, $) {

	// Global configuration
	var config = {
		url: "http://127.0.0.1:1337",
		extension: ".json"
	};

	// Namespace
	var RC = {};

	// Tools functions holder
	RC.tools = {};

	// Template classes holder
	RC.template = {};

	// Test classes holder
	RC.test = {};


	///////////////////////////////////////////////////////////////////////////
	// $TOOLS

	// Check if variable exist
	RC.tools.exists = function(obj) {
		return ("undefined" !== typeof obj) && (null !== obj);
	};

	// Returns its first argument if this value is false or null; otherwise, returns its second argument
	RC.tools.and = function(obj1, obj2) {
		return (RC.tools.exists(obj1) || obj1) ? obj2 : obj1;
	};

	// Returns its first argument if this value is different from null and false; otherwise, returns its second argument
	RC.tools.or = function(obj1, obj2) {
		return (RC.tools.exists(obj1) && obj1) ? obj1 : obj2;
	};

	// HTML encode
	RC.tools.htmlEncode = function(value) {
		return $("<div/>").text(value).html();
	};

	// HTML decode
	RC.tools.htmlDecode = function(value) {
		return $("<div/>").html(value).text();
	};



	///////////////////////////////////////////////////////////////////////////
	// $TEMPLATE

	// Model
	RC.template.TemplateModel = Backbone.Model.extend({
		defaults: {
			_name: "error",
			template: function() {},
			markup: "<h1><%= lang.title %></h1><h3><%= lang.error %></h3>",
			localization: { title: "Error !", error: "Template couldn't be loaded." },
			data: {},
			html: "",
			hasMarkup: false,
			hasLocalization: false,
			dirty: true
		},
		// Build html out of template and template data
		build: function() {
			// Build the html only if required
			if (this.get("dirty")) {
				// Create underscore template
				this.set("template", _.template(this.get("markup")));

				// Build html from template and update flag
				this.set("html", this.get("template")({ lang: this.get("localization"), data: this.get("data") }));
				this.set("dirty", false);
			}
		}
	});

	// Collection
	RC.template.TemplateCollection = Backbone.Collection.extend({
		lang: "en",
		merged: false,
		baseURL: config.url + "/app/templates",
		model: RC.template.TemplateModel,
		// Initialize parameters
		initialize: function(args) {
			// Extend/Overwrite the parameters with the ones passed in arguments
			_.extend(this, args);
		},
		// Parse the data returned by fetch()
		parse: function(data) {
			// Make sure valid data is returned
			if (RC.tools.exists(data) && data.length >= 1) {
				// Loop through templates
				for (var index in data) {
					// Markup was returned
					if (RC.tools.exists(data[index].markup)) {
						// Decode markup and update flag
						data[index].markup = RC.tools.htmlDecode(data[index].markup);
						data[index].hasMarkup = true;
					}
					// Localization was returned
					if (RC.tools.exists(data[index].localization)) {
						// Parse and decode localization and update flag
						data[index].localization = $.parseJSON(RC.tools.htmlDecode(data[index].localization));
						data[index].hasLocalization = true;
					}
				}
			}
			return data;
		},
		// Fetching markup and localization duplicates template, this merges the two
		merge: function(callback) {
			var merging = false;

			// Get template names and avoid duplicates
			var names = _.uniq(this.pluck("_name"));

			// Loop through available names
			for (var index in names) {
				// Get the templates matching the name
				var models = this.where({ _name: names[index]});

				// Merge them if they are two
				if (2 === models.length) {
					merging = true;

					// 1 has markup -> set 0's markup with 1's markup and get rid of 1
					if (models[1].get("hasMarkup")) {
						models[0].set("markup", models[1].get("markup"));
						models[0].set("hasMarkup", models[1].get("hasMarkup"));
						this.remove(models[1]);
					}
					// 1 has localization -> set 0's localization with 1's localization and get rid of 1
					if (models[1].get("hasLocalization")) {
						models[0].set("localization", models[1].get("localization"));
						models[0].set("hasLocalization",  models[1].get("hasLocalization"));
						this.remove(models[1]);
					}
				}
			}

			// Merging occured, execute callback
			if (merging) {
				this.merged = true;
				if (_.isFunction(callback)) {
					callback();
				}
			}
		},
		// Fetch the markup only and try to merge it once it's received
		fetchMarkup: function(callback) {
			var that = this;
			this.url = this.baseURL + "/html.json";
			this.fetch({ add: true }).done(function() { that.merge(callback); });
		},
		// Fetch the localization only and try to merge it once it's received
		fetchLocalization: function(callback) {
			var that = this;
			this.url = this.baseURL + "/" + this.lang + ".json";
			this.fetch({ add: true }).done(function() { that.merge(callback); });
		},
		// Fetch both markup and localization
		fetchAll: function(callback) {
			this.fetchMarkup(callback);
			this.fetchLocalization(callback);
		},
		// Change all templates' language (fetch and apply)
		setLanguage: function(lang, callback) {
			var that = this;
			this.lang = lang;
			this.fetchLocalization(function() {
				// Rebuild template once the localization has been updated
				_.each(that.models, function(template) {
					template.set("dirty", true);
					template.build();
				});
				// Execute callback
				if (_.isFunction(callback)) {
					callback();
				}
			});
		}
	});

	// View
	RC.template.TemplateView = Backbone.View.extend({
		events: {},
		// Render the template -> build it if necessary and return element's html
		render: function() {
			this.model.build();
			return this.model.get("html");
		}
	});

	// Ready, execute the callback once the templates are loaded
	RC.template.ready = function(holder, collection, callback) {
		// Make sure templates are loaded
		if (RC.tools.exists(holder.templates) && holder.templates.merged) {
			// Templates have already been fetched...
			if (_.isFunction(callback)) {
				callback();
			}
		}
		else {
			holder.templates = new RC.template.TemplateCollection(collection);
			holder.templates.fetchAll(function() {
				// All the templates have been fetched, let's get to business...
				if (_.isFunction(callback)) {
					callback();
				}
			});
		}
	};


	///////////////////////////////////////////////////////////////////////////
	// $TEST

	// Model
	RC.test.PageModel = Backbone.Model.extend({
		defaults: {
			args: "something"
		},
		initialize: function() {}
	});

	// View
	RC.test.PageView = Backbone.View.extend({
		el: "#js-page",
		events: {
			"click #goto": "showPageTwo",
			"click #goback": "showPageOne",
			"click #lang": "changeLanguage"
		},
		current: false,
		template: new RC.template.TemplateModel(),
		initialize: function() {
			// Get page template model
			var pageTemplate = RC.test.templates.where({ _name: this.options._name });

			// Create page template view
			if (1 === pageTemplate.length) {
				this.template = pageTemplate[0];
				this.template.view = new RC.template.TemplateView({ model: this.template });
			}
		},
		render: function() {
			// Replace the content of the page by the template
			this.$el.empty().append(this.template.view.render());
		},
		showPageOne: function() {
			// Render page one (create it if necessary)
			if (!RC.tools.exists(RC.test.page1)) {
				RC.test.page1 = new RC.test.PageModel();
				RC.test.page1.view = new RC.test.PageView({ _name: "page1", model: RC.test.page1 });
			}
			RC.test.page2.view.current = false;
			RC.test.page1.view.current = true;
			RC.test.page1.view.render();
		},
		showPageTwo: function() {
			// Render page two (create it if necessary)
			if (!RC.tools.exists(RC.test.page2)) {
				RC.test.page2 = new RC.test.PageModel();
				RC.test.page2.view = new RC.test.PageView({ _name: "page2", model: RC.test.page2 });
			}
			RC.test.page1.view.current = false;
			RC.test.page2.view.current = true;
			RC.test.page2.view.render();
		},
		changeLanguage: function() {
			var that = this;

			// Rebuild templates with new language
			if (this.current) {
				var lang = (RC.test.templates.lang === "en") ? "fr" : "en";

				RC.test.templates.setLanguage(lang, function() {
					that.render();
				});
			}
		}
	});


	///////////////////////////////////////////////////////////////////////////
	// $APPLICATION

	RC.test.init = function(){
		console.log("Hello templates-bb!");

		var buildPageOne = function() {
			// Simply build a page and render it
			RC.test.page1 = new RC.test.PageModel();
			RC.test.page1.view = new RC.test.PageView({ _name: "page1", model: RC.test.page1 });
			RC.test.page1.view.current = true;
			RC.test.page1.view.render();
		};

		// Build page one once all the templates are loaded
		RC.template.ready(RC.test, {}, buildPageOne);
	};


	window.RC = RC;
	$(document).ready(RC.test.init);

})(this, jQuery);
