//
// test.js
//
// Defines the testing suite of Templates-BB
//
// ============================================================================
//
// TEMPLATEMODEL
// DOUBLEPASSTEMPLATEMODEL
// COLLECTION
// READY
// START
//
// ============================================================================
//


(function(window, $) {

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
	// $COLLECTION

	module("TemplatesBB.Collection");

	test("model()", function() {
		// Create Collection
		var collection = new TemplatesBB.TemplateCollection();

		var singleModel = collection.model({});
		strictEqual(singleModel.build, (new TemplatesBB.TemplateModel()).build, "TemplateModel is returned");

		var doubleModel = collection.model({ double_pass: true });
		strictEqual(doubleModel.build, (new TemplatesBB.DoublePassTemplateModel()).build, "DoublePassTemplateModel is returned");
	});

	test("initialize()", function() {
		// Create Collection
		var collection = new TemplatesBB.TemplateCollection(null, { test_string: "TEST_STRING", test_value: 42 });
		strictEqual(collection.test_string, "TEST_STRING", "Option is passed through correctly (string)");
		strictEqual(collection.test_value, 42, "Option is passed through correctly (value)");
		strictEqual(collection.test_random, undefined, "No funny business");
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
	// $READY

	module("TemplatesBB");

	test("ready()", function() {
		var holder = {};
		TemplatesBB.ready(holder, { baseURL: "http://127.0.0.1:1337/app/templates", test_option: "TEST_OPTION" }, function() { holder.callback_called = true; });
		ok(holder.templates !== undefined, "Holder has some templates");
		strictEqual(holder.templates.length, 2, "There are 2 templates");
		ok(holder.templates.where({ name: "page1" })[0] !== undefined, "Page 1 exists");
		ok(holder.templates.where({ name: "page2" })[0] !== undefined, "Page 2 exists");
		strictEqual(holder.templates.test_option, "TEST_OPTION", "Options are passed through");
		strictEqual(holder.callback_called, true, "Callback is called");
	});


	///////////////////////////////////////////////////////////////////////////
	// $START

	// Tests are loaded, run 'em
	QUnit.start();

})(this, jQuery);