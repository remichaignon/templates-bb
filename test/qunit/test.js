//
// test.js
//
// Defines the testing suite of Templates-BB
//
// ============================================================================
//
// READY
// COLLECTION
// TEMPLATEMODEL
// DOUBLEPASSTEMPLATEMODEL
// START
//
// ============================================================================
//


(function(window, $) {
/*
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
*/
	///////////////////////////////////////////////////////////////////////////
	// $READY

	module("TemplatesBB.ready()");

	test("Holder has templates", function() {
		ok(true, "...");
	});

	test("Options are passed through", function() {
		ok(true, "...");
	});

	test("Callback is called", function() {
		ok(true, "...");
	});


	///////////////////////////////////////////////////////////////////////////
	// $COLLECTION

	module("TemplatesBB.Collection");

	test("model()", function() {
		ok(true, "...");
	});

	test("initialize()", function() {
		ok(true, "...");
	});

	test("parse()", function() {
		ok(true, "...");
	});

	test("merge()", function() {
		ok(true, "...");
	});

	test("fetchMarkup()", function() {
		ok(true, "...");
	});

	test("fetchLocalization()", function() {
		ok(true, "...");
	});

	test("fetchAll()", function() {
		ok(true, "...");
	});

	test("setLanguage()", function() {
		ok(true, "...");
	});


	///////////////////////////////////////////////////////////////////////////
	// $TEMPLATEMODEL

	module("TemplatesBB.TemplateModel");

	test("initialize()", function() {
		// Create Model
		var tpl = new TemplatesBB.TemplateModel();
		strictEqual(tpl.get("name"), null, "name is null");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), null, "markup is null");
		strictEqual(tpl.get("localization"), null, "localization is null");
		strictEqual(tpl.get("html"), null, "html is null");

		// Set html manually
		tpl.set("html", "RANDOM_STRING");
		strictEqual(tpl.get("html"), "RANDOM_STRING", "html has been set to a random string");

		// Change markup -> html is cleared
		tpl.set("markup", "NEW_MARKUP");
		strictEqual(tpl.get("markup"), "NEW_MARKUP", "markup has been modified");
		strictEqual(tpl.get("html"), null, "html has been reset to null automatically");

		// Set html manually
		tpl.set("html", "RANDOM_STRING");
		strictEqual(tpl.get("html"), "RANDOM_STRING", "html has been set to a random string");

		// Change localization -> html is cleared
		tpl.set("localization", "NEW_LOCALIZATION");
		strictEqual(tpl.get("localization"), "NEW_LOCALIZATION", "localization has been modified");
		strictEqual(tpl.get("html"), null, "html has been reset to null automatically");
	});

	test("build() - Empty", function() {
		// Create Model with markup only
		var tpl = new TemplatesBB.TemplateModel({
			name: "test",
			markup: "<div></div>",
			localization: {}
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div></div>", "markup is basic");
		deepEqual(tpl.get("localization"), {}, "localization is empty");
		strictEqual(tpl.get("html"), null, "html is null");

		// Build -> html = markup
		tpl.build();
		strictEqual(tpl.get("html"), tpl.get("markup"), "html is equal to markup");
	});

	test("build() - Localized", function() {
		// Create Model with markup and localized text
		var tpl = new TemplatesBB.TemplateModel({
			name: "test",
			markup: "<div><%= test_text %></div>",
			localization: { test_text: "TEST_TEXT" }
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><%= test_text %></div>", "markup is localized");
		deepEqual(tpl.get("localization"), { test_text: "TEST_TEXT" }, "localization is some text");
		strictEqual(tpl.get("html"), null, "html is null");

		// Build -> html = markup + localized text
		tpl.build({});
		strictEqual(tpl.get("html"), "<div>TEST_TEXT</div>", "html is equal to markup with localization");
	});

	test("build() - Data-driven", function() {
		// Create Model with markup only
		var tpl = new TemplatesBB.TemplateModel({
			name: "test",
			markup: "<div><%= test_data %></div>",
			localization: {}
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><%= test_data %></div>", "markup is data-driven");
		deepEqual(tpl.get("localization"), {}, "localization is empty");
		strictEqual(tpl.get("html"), null, "html is null");

		// Build -> html = markup + data
		tpl.build({ test_data: 42 });
		strictEqual(tpl.get("html"), "<div>42</div>", "html is equal to markup with data");
	});

	test("build() - Localized & Data-driven", function() {
		// Create Model with markup and localized text
		var tpl = new TemplatesBB.TemplateModel({
			name: "test",
			markup: "<div><%= test_text %> <%= test_data %></div>",
			localization: { test_text: "TEST_TEXT" }
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><%= test_text %> <%= test_data %></div>", "markup is localized and data-driven");
		deepEqual(tpl.get("localization"), { test_text: "TEST_TEXT" }, "localization is some text");
		strictEqual(tpl.get("html"), null, "html is null");

		// Build -> html = markup + localized text + data
		tpl.build({ test_data: 42 });
		strictEqual(tpl.get("html"), "<div>TEST_TEXT 42</div>", "html is equal to markup with localization and data");
	});

	test("render() - Simple", function() {
		// Create Model with markup and localized text
		var tpl = new TemplatesBB.TemplateModel({
			name: "test",
			markup: "<div><%= test_text %> <%= test_data %></div>",
			localization: { test_text: "TEST_TEXT" }
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><%= test_text %> <%= test_data %></div>", "markup is localized and data-driven");
		deepEqual(tpl.get("localization"), { test_text: "TEST_TEXT" }, "localization is some text");
		strictEqual(tpl.get("html"), null, "html is null");

		// Render -> return = markup + localized text + data
		strictEqual(tpl.render({ test_data: 42 }), "<div>TEST_TEXT 42</div>", "html is equal to markup with localization and data");
	});

	test("render() - With dataSource", function() {
		// Create Model with markup and localized text
		var tpl = new TemplatesBB.TemplateModel({
			name: "test",
			markup: "<div><%= test_text %> <%= test_data %></div>",
			localization: { test_text: "TEST_TEXT" }
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><%= test_text %> <%= test_data %></div>", "markup is localized and data-driven");
		deepEqual(tpl.get("localization"), { test_text: "TEST_TEXT" }, "localization is some text");
		strictEqual(tpl.get("html"), null, "html is null");

		// Set dataSource
		var dataSource = { getData: function() { return { test_data: 42 }; } };
		tpl.set("dataSource", dataSource);
		deepEqual(tpl.get("dataSource"), dataSource, "dataSource is set");

		// Render -> return = markup + localized text + data
		strictEqual(tpl.render(), "<div>TEST_TEXT 42</div>", "html is equal to markup with localization and data from dataSource");
	});

	test("clear()", function() {
		// Create Model
		var tpl = new TemplatesBB.TemplateModel();
		strictEqual(tpl.get("name"), null, "name is null");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), null, "markup is null");
		strictEqual(tpl.get("localization"), null, "localization is null");
		strictEqual(tpl.get("html"), null, "html is null");

		// Set html manually
		tpl.set("html", "RANDOM_STRING");
		strictEqual(tpl.get("html"), "RANDOM_STRING", "html has been set to a random string");

		// Clear -> html is cleared
		tpl.clear();
		strictEqual(tpl.get("html"), null, "html has been reset to null automatically");
	});


	///////////////////////////////////////////////////////////////////////////
	// $DOUBLEPASSTEMPLATEMODEL

	module("TemplatesBB.DoublePassTemplateModel");

	test("initialize()", function() {
		var tpl = new TemplatesBB.DoublePassTemplateModel();
		strictEqual(tpl.get("name"), null, "name is null");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), null, "markup is null");
		strictEqual(tpl.get("localization"), null, "localization is null");
		strictEqual(tpl.get("html"), null, "html is null");

		tpl.set("html", "RANDOM_STRING");
		strictEqual(tpl.get("html"), "RANDOM_STRING", "html has been set to a random string");

		tpl.set("markup", "NEW_MARKUP");
		strictEqual(tpl.get("markup"), "NEW_MARKUP", "markup has been modified");
		strictEqual(tpl.get("html"), null, "html has been reset to null automatically");

		tpl.set("html", "RANDOM_STRING");
		strictEqual(tpl.get("html"), "RANDOM_STRING", "html has been set to a random string");

		tpl.set("localization", "NEW_LOCALIZATION");
		strictEqual(tpl.get("localization"), "NEW_LOCALIZATION", "localization has been modified");
		strictEqual(tpl.get("html"), null, "html has been reset to null automatically");
	});

	test("build() - Empty", function() {
		// Create Model with markup only
		var tpl = new TemplatesBB.DoublePassTemplateModel({
			name: "test",
			markup: "<div></div>",
			localization: {}
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div></div>", "markup is basic");
		deepEqual(tpl.get("localization"), {}, "localization is empty");
		strictEqual(tpl.get("html"), null, "html is null");

		// Build -> html = markup
		tpl.build();
		strictEqual(tpl.get("html"), tpl.get("markup"), "html is equal to markup");
	});

	test("build() - Localized", function() {
		// Create Model with markup and localized text
		var tpl = new TemplatesBB.DoublePassTemplateModel({
			name: "test",
			markup: "<div><@= test_text @></div>",
			localization: { test_text: "TEST_TEXT" }
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><@= test_text @></div>", "markup is localized");
		deepEqual(tpl.get("localization"), { test_text: "TEST_TEXT" }, "localization is some text");
		strictEqual(tpl.get("html"), null, "html is null");

		// Build -> html = markup + localized text
		tpl.build({});
		strictEqual(tpl.get("html"), "<div>TEST_TEXT</div>", "html is equal to markup with localization");
	});

	test("build() - Data-driven", function() {
		// Create Model with markup only
		var tpl = new TemplatesBB.DoublePassTemplateModel({
			name: "test",
			markup: "<div><%= test_data %></div>",
			localization: {}
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><%= test_data %></div>", "markup is data-driven");
		deepEqual(tpl.get("localization"), {}, "localization is empty");
		strictEqual(tpl.get("html"), null, "html is null");

		// Build -> html = markup + data
		tpl.build({ test_data: 42 });
		strictEqual(tpl.get("html"), "<div>42</div>", "html is equal to markup with data");
	});

	test("build() - Localized & Data-driven", function() {
		// Create Model with markup and localized text
		var tpl = new TemplatesBB.DoublePassTemplateModel({
			name: "test",
			markup: "<div><@= test_text @> <%= test_data %></div>",
			localization: { test_text: "TEST_TEXT" }
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><@= test_text @> <%= test_data %></div>", "markup is localized and data-driven");
		deepEqual(tpl.get("localization"), { test_text: "TEST_TEXT" }, "localization is some text");
		strictEqual(tpl.get("html"), null, "html is null");

		// Build -> html = markup + localized text + data
		tpl.build({ test_data: 42 });
		strictEqual(tpl.get("html"), "<div>TEST_TEXT 42</div>", "html is equal to markup with localization and data");
	});

	test("render() - Simple", function() {
		// Create Model with markup and localized text
		var tpl = new TemplatesBB.TemplateModel({
			name: "test",
			markup: "<div><%= test_text %> <%= test_data %></div>",
			localization: { test_text: "TEST_TEXT" }
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><%= test_text %> <%= test_data %></div>", "markup is localized and data-driven");
		deepEqual(tpl.get("localization"), { test_text: "TEST_TEXT" }, "localization is some text");
		strictEqual(tpl.get("html"), null, "html is null");

		// Render -> return = markup + localized text + data
		strictEqual(tpl.render({ test_data: 42 }), "<div>TEST_TEXT 42</div>", "html is equal to markup with localization and data");
	});

	test("render() - With dataSource", function() {
		// Create Model with markup and localized text
		var tpl = new TemplatesBB.TemplateModel({
			name: "test",
			markup: "<div><%= test_text %> <%= test_data %></div>",
			localization: { test_text: "TEST_TEXT" }
		});
		strictEqual(tpl.get("name"), "test", "name is test");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), "<div><%= test_text %> <%= test_data %></div>", "markup is localized and data-driven");
		deepEqual(tpl.get("localization"), { test_text: "TEST_TEXT" }, "localization is some text");
		strictEqual(tpl.get("html"), null, "html is null");

		// Set dataSource
		var dataSource = { getData: function() { return { test_data: 42 }; } };
		tpl.set("dataSource", dataSource);
		deepEqual(tpl.get("dataSource"), dataSource, "dataSource is set");

		// Render -> return = markup + localized text + data
		strictEqual(tpl.render(), "<div>TEST_TEXT 42</div>", "html is equal to markup with localization and data from dataSource");
	});

	test("clear()", function() {
		// Create Model
		var tpl = new TemplatesBB.DoublePassTemplateModel();
		strictEqual(tpl.get("name"), null, "name is null");
		strictEqual(tpl.get("dataSource"), null, "dataSource is null");
		strictEqual(tpl.get("markup"), null, "markup is null");
		strictEqual(tpl.get("localization"), null, "localization is null");
		strictEqual(tpl.get("html"), null, "html is null");

		// Set html manually
		tpl.set("html", "RANDOM_STRING");
		strictEqual(tpl.get("html"), "RANDOM_STRING", "html has been set to a random string");

		// Clear -> html is cleared
		tpl.clear();
		strictEqual(tpl.get("html"), null, "html has been reset to null automatically");
	});



	///////////////////////////////////////////////////////////////////////////
	// $START

	// Tests are loaded, run 'em
	QUnit.start();

})(this, jQuery);