Description
-----------

This is the source code for **Check Your Bias**, an election application that lets you "vote" on important political issues without any indication of which candidate supports or opposes the presented issue. The application then shows you how your political views align with each of the candidates, and for various topics.

Links
-----

* [Product Website (User and Developer Info)](http://aaronnech.github.io/CheckYourBias/product_website)
* [Project Website](http://aaronnech.github.io/CheckYourBias/)
* [Updated Software Requirement Specification](https://github.com/aaronnech/CheckYourBias/blob/gh-pages/writeups/requirements_updated/requirements.pdf)
* [Updated Software Design Specification](https://github.com/aaronnech/CheckYourBias/blob/gh-pages/writeups/software_design_updated/software_design_specification.pdf)
* [Original Software Requirement Specification](https://github.com/aaronnech/CheckYourBias/blob/gh-pages/writeups/requirements/requirements.pdf)
* [Original Software Design Specification](https://github.com/aaronnech/CheckYourBias/blob/gh-pages/writeups/software_design/software_design_specification.pdf)

Setup
------
<pre>
git clone https://github.com/aaronnech/CheckYourBias.git
cd CheckYourBias
npm install
npm run-script serve
</pre>

And point your browser to `localhost:1337`.

To just compile all of the TypeScript files into a file named `main.js`, without running a server, use `npm run-script make`.

Methodology Overview
--------------------
Both the client and the server are written in [TypeScript](http://www.typescriptlang.org/) and ultimately compiled to JavaScript. This allows the client and the server to share code. For example the client and server both use an `Issue` object to access data about a given political issue, we only need to write that object once (this kind of code I'm calling `common` and goes in the `src/common` directory).
2. We use NodeJS to run server code on a server computer
3. We use [Browserify](http://browserify.org/) to scoop up all the seperate JavaScript files and bundle them into one JavaScript include for the browser platform.

Directory Breakdown
-------------------
There are four top-level directories in the source code:

1. `src/server` - This contains all code only pertaining to the server-side application.
2. `src/client` - This contains all code only pertaining to the client-side application. Browserify is used with the start point `client/main.ts` to scoop up all client code and bundle it into `client/static/js/main.js`
3. `src/common` - This contains all code that is shared by both client and server. Including files such as TypeScript definitions. NodeJS processes dependencies on its own via support for `require()`, so any `src/server` code that depends on common code will do so automatically. `src/client` code will scoop up common code via the same mechanism, but employed by Browserify.
4. `src/vendor` - This contains all JS source that is not available via npm.

Unit Testing
------------

Unit testing is done with [NodeUnit](https://github.com/caolan/nodeunit). To run the tests, issue

<pre>
npm run-script test
</pre>

in the command line. All tests should be placed in `src/tests`, with one test class per TypeScript class. Tests should reside in static TypeScript classes as per NodeUnit standards such that each static function is one unit test. Test files are automatically recognized if they end with the postfix `-test.ts`.

![Code Coverage](https://github.com/aaronnech/CheckYourBias/blob/gh-pages/code_coverage.png?raw=true "~100% Code Coverage")

Front-end Testing
-----------------

Testing of all front-end components is done via [WebdriverIO](http://webdriver.io/api.html), using the [Mocha](https://mochajs.org/) test framework.

To run front-end tests for Windows, issue the following command:

<pre>
npm run-script webdriver-windows
</pre>

On Unix based plaforms, issue the following command:

<pre>
npm run-script webdriver
</pre>

Building to PhoneGap
--------------------
For releases, we compile the application into a file that can be directly installed on Android or iOS phones.

To build the application for Android, issue the following commands:

<pre>
npm run-script pg-setup
npm run-script pg-android
</pre>

To build for iOS, issue the following commands:

<pre>
npm run-script pg-setup
npm run-script pg-ios
</pre>

Vendor files
-------

Vendor files are files that do not naturally belong to the application, but need to be used (e.g. libraries). If a library has an equivalent npm package, you can just use `require()` as normal after installation via npm and both the client and server will have support to get the dependency (the client via Browserify).

If the library is client and does not have a npm package, you will need to place it in `src/vendor`.

Development Style
-----------------

- Every class resides in their own TypeScript file
- Every class TypeScript file ends with an `export = ClassName;` statement to make itself available for import
- Every class that depends on another class, imports that class via `import ClassName = require('/path-to-class/ClassName');`
- Every class TypeScript file is named as `ClassName.ts`

Additionally, you should familiarize yourself with our Code Style Guidelines as outlined in the [Software Design Specification](https://github.com/aaronnech/CheckYourBias/blob/gh-pages/writeups/software_design_updated/software_design_specification.pdf)
