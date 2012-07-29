//
// app.js
//
// Example application for templates-bb.
//
// ============================================================================
//
// APPLICATION
// INITIALIZATION
//
// ============================================================================
//


(function(window, $) {

	// Global configuration
	var config = {
		url: "http://127.0.0.1:1337"
	};

	// Test classes holder
	app = {};


	///////////////////////////////////////////////////////////////////////////
	// $APPLICATION

	// Model
	app.PageModel = Backbone.Model.extend({
		defaults: {
			data: null
		},
		initialize: function() {}
	});

	// View
	app.PageView = Backbone.View.extend({
		el: "#js-page",
		events: {
			"click #goto": "showPageTwo",
			"click #goback": "showPageOne",
			"click #lang": "changeLanguage"
		},
		current: false,
		template: null,
		initialize: function(args, options) {
			// Get page template
			this.template = app.templates.where({ name: this.options.name })[0];
		},
		render: function() {
			// Replace the content of the page by the template
			this.$el.html(this.template.render(this.model.get("data")));
		},
		showPageOne: function() {
			// Render page one (create it if necessary)
			if (_.isUndefined(app.page1)) {
				app.page1 = new app.PageModel({ data: { day: (new Date()).getDate() } });
				app.page1.view = new app.PageView({ name: "page1", model: app.page1 });
			}
			app.page2.view.current = false;
			app.page1.view.current = true;
			app.page1.view.render();
		},
		showPageTwo: function() {
			// Render page two (create it if necessary)
			if (_.isUndefined(app.page2)) {
				app.page2 = new app.PageModel({ data: { day: (new Date()).getDate() } });
				app.page2.view = new app.PageView({ name: "page2", model: app.page2 });
			}
			app.page1.view.current = false;
			app.page2.view.current = true;
			app.page2.view.render();
		},
		changeLanguage: function() {
			var that = this;

			// Rebuild templates with new language
			if (this.current) {
				var lang = (app.templates.lang === "en") ? "fr" : "en";

				app.templates.setLanguage(lang, function() {
					that.render();
				});
			}
		}
	});


	///////////////////////////////////////////////////////////////////////////
	// $INITIALIZATION

	app.init = function(){
		console.log("Hello app using templates-bb!");

		var buildPageOne = function() {
			// Simply build a page and render it
			app.page1 = new app.PageModel({ data: { day: (new Date()).getDate() } });
			app.page1.view = new app.PageView({ name: "page1", model: app.page1 });
			app.page1.view.current = true;
			app.page1.view.render();
		};

		// Build page one once all the templates are loaded
		TemplatesBB.ready(app, { baseURL: config.url + "/app/templates" }, buildPageOne);
	};


	window.app = app;
	$(document).ready(app.init);

})(this, jQuery);