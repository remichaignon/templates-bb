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

	// Template classes holder
	RC.template = {};

	// Test classes holder
	RC.test = {};


	///////////////////////////////////////////////////////////////////////////
	// $TEMPLATE

	// Model - Simple template
	RC.template.TemplateModel = Backbone.Model.extend({
		defaults: {
			name: null, // Required
			markup: null, // Required
			localization: null, // Optional
			data: null, // Optional
			html: null
		},
		// Build html out of template and template data
		build: function() {
			// Build the html only if required
			if (_.isNull(this.get("html"))) {
				// Create template using the markup
				// Combine localization and data object
				// Execute the templating with the resulting object
				// Set result as html
				this.set("html", _.template(this.get("markup"))(_.extend(this.get("localization"), this.get("data"))));
			}
		}
	});

	// Model - Double pass template
	RC.template.DoublePassTemplateModel = RC.template.TemplateModel.extend({
		// Build html out of template and template data
		build: function() {
			// Build the html only if required
			if (_.isNull(this.get("html"))) {
				// First pass: the data
				// Create template using the markup
				// Execute the templating with the data object
				var template = _.template(this.get("markup"))(this.get("data"));

				// Adapt template settings to localization pass
				_.templateSettings = {
					interpolate: /\<\@\=(.+?)\@\>/gim,
					evaluate: /\<\@(.+?)\@\>/gim
				};

				// Second pass: the localization
				// Create template using the result of the data pass
				// Execute the templating with the localization object
				// Set result as html
				this.set("html", _.template(template)(this.get("localization")));

				// Reset template settings
				_.templateSettings = {
					interpolate: /\<\%\=(.+?)\%\>/gim,
					evaluate: /\<\%(.+?)\%\>/gim
				};
			}
		}
	});

	// Collection
	RC.template.TemplateCollection = Backbone.Collection.extend({
		lang: "en",
		isReady: false,
		baseURL: config.url + "/app/templates",
		model: function(attrs, options) {
			// Choose which model to instanciate according to the data
			if (!_.isUndefined(attrs.double_pass) && attrs.double_pass) {
				return new RC.template.DoublePassTemplateModel(attrs, options);
			}

			return new RC.template.TemplateModel(attrs, options);
		},
		// Initialize parameters
		initialize: function(args, options) {
			// Extend/Overwrite the parameters with the options passed in arguments
			_.extend(this, options);
		},
		// Parse the data returned by fetch()
		parse: function(data) {
			// Make sure valid data is returned
			if (!_.isUndefined(data) && data.length >= 1) {
				// Loop through templates
				for (var index in data) {
					// Markup was returned
					if (!_.isUndefined(data[index].markup)) {
						// Decode markup
						data[index].markup = $("<div/>").html(data[index].markup).text();
					}
					// Localization was returned
					if (!_.isUndefined(data[index].localization)) {
						// Parse and decode localization
						data[index].localization = $.parseJSON($("<div/>").html(data[index].localization).text());
					}
				}
			}

			return data;
		},
		// Fetching markup and localization duplicates templates, this merges them
		merge: function(callback) {
			// Templates are already ready, no need for merging
			if (this.isReady) {
				return;
			}

			// No templates mean they are ready
			if (this.models.length === 0) {
				this.isReady = true;
			}
			else {
				// Get template names and avoid duplicates
				var names = _.uniq(this.pluck("name"));

				// Loop through available names
				for (var index in names) {
					// Get the templates matching the name
					var models = this.where({ name: names[index]});

					// Merge them if they are two
					if (2 === models.length) {
						this.isReady = true;

						// 1 has markup -> set 0's markup with 1's markup and get rid of 1
						if (!_.isNull(models[1].get("markup"))) {
							models[0].set("markup", models[1].get("markup"));
							this.remove(models[1]);
						}
						// 1 has localization -> set 0's localization with 1's localization and get rid of 1
						if (!_.isNull(models[1].get("localization"))) {
							models[0].set("localization", models[1].get("localization"));
							this.remove(models[1]);
						}
					}
				}
			}

			// Templates are ready, execute callback
			if (this.isReady) {
				if (_.isFunction(callback)) {
					callback();
				}
			}
		},
		// Fetch the markup only and try to merge it once it's received
		fetchMarkup: function(callback) {
			var that = this;
			this.isReady = false;
			this.url = this.baseURL + "/html.json";
			this.fetch({ add: true }).done(function() { that.merge(callback); });
		},
		// Fetch the localization only and try to merge it once it's received
		fetchLocalization: function(callback) {
			var that = this;
			this.isReady = false;
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
					template.set("html", null);
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
	RC.template.ready = function(holder, options, callback) {
		// Make sure templates are loaded
		if (!_.isUndefined(holder.templates) && holder.templates.isReady) {
			// Templates have already been fetched...
			if (_.isFunction(callback)) {
				callback();
			}
		}
		else {
			holder.templates = new RC.template.TemplateCollection(null, options);
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
		template: null,
		initialize: function(args, options) {
			// Get page template model
			var pageTemplate = RC.test.templates.where({ name: this.options.name });

			// Create page template view
			if (1 === pageTemplate.length) {
				this.template = pageTemplate[0];
				this.template.view = new RC.template.TemplateView({ model: this.template });
			}
		},
		render: function() {
			// Replace the content of the page by the template
			this.$el.html(this.template.view.render());
		},
		showPageOne: function() {
			// Render page one (create it if necessary)
			if (_.isUndefined(RC.test.page1)) {
				RC.test.page1 = new RC.test.PageModel();
				RC.test.page1.view = new RC.test.PageView({ name: "page1", model: RC.test.page1 });
				RC.test.page1.view.template.set("data", { day: (new Date()).getDate() });
			}
			RC.test.page2.view.current = false;
			RC.test.page1.view.current = true;
			RC.test.page1.view.render();
		},
		showPageTwo: function() {
			// Render page two (create it if necessary)
			if (_.isUndefined(RC.test.page2)) {
				RC.test.page2 = new RC.test.PageModel();
				RC.test.page2.view = new RC.test.PageView({ name: "page2", model: RC.test.page2 });
				RC.test.page2.view.template.set("data", { day: (new Date()).getDate() });
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
			RC.test.page1.view = new RC.test.PageView({ name: "page1", model: RC.test.page1 });
			RC.test.page1.view.template.set("data", { day: (new Date()).getDate() });
			RC.test.page1.view.current = true;
			RC.test.page1.view.render();
		};

		// Build page one once all the templates are loaded
		RC.template.ready(RC.test, {}, buildPageOne);
	};


	window.RC = RC;
	$(document).ready(RC.test.init);

})(this, jQuery);
