Description
-----------

This is the source code for Check Your Bias, an election application that let's you "vote" on important political issues without any indication of which candidate supports or opposes the presented issue. The application then shows you how your political views align with each of the candidates, and for various categories.

[Product Website (User and Developer Info)](http://aaronnech.github.io/CheckYourBias/product_website)

[Project Website](http://aaronnech.github.io/CheckYourBias/)

[Updated SRS](https://github.com/aaronnech/CheckYourBias/blob/gh-pages/writeups/requirements%20(updated)/requirements.pdf)

Set Up
------
Run the following from the root directory:

`npm install`
  
to install project dependencies into a folder called `node_modules`

And then:

`npm run-script serve`

To compile all TypeScript, and launch the main.js server located in the `server` directory, you can instead run:

`npm run-script make`

To just compile all TypeScript.


Methodology Overview
--------------------
Both Client and Server are written in TypeScript and ultimately compiled to JavaScript

1. Both Client and Server can share code. For example the client and server both use a Pizza object for various functionality, we only need to write that object once (this kind of code I'm calling `common` and goes in the `src/common` directory).
2. We use NodeJS to run server code on a server computer
3. We use Browserify to scoop up all the seperate JavaScript files and bundle them into one JavaScript include for the browser platform.


Directory Breakdown
-------------------

There are four top level directories in the source:

1. `src/server` - This contains all code only pertaining to the server side application.
2. `src/client` - This contains all code only pertaining to the client side application. Browserify is used with the start point `client/main.ts` to scoop up all client code and bundle it into `client/static/js/main.js`
3. `src/common` - This contains all code that is shared by both client and server. Including files such as typescript definitions. NodeJS processes dependencies on its own via support for `require()`, so any `src/server` code that depends on common code will do so automatically. `src/client` code will scoop up common code via the same mechanism, but employed by Browserify.
4. `src/vendor` - This contains all JS source that is not available via NPM.

Unit Testing
------------

Unit testing is done with NodeUnit and is available immediately by running `npm run-script test`. Tests should reside in static TypeScript classes as per NodeUnit standards such that each static function is one unit test. Test files are automatically recognized if they end with the postfix `-test.ts`.

Front-end Testing
-----------------

Testing of all front-end components is done via [WebdriverIO](http://webdriver.io/api.html), with the [Mocha](https://mochajs.org/) test framework.

To run front-end tests for Windows:

<pre>
npm install
npm run-script webdriver-windows
</pre>

On Unix based plaforms:

<pre>
npm install
npm run-script webdriver
</pre>

Vendors
-------

Vendor files are files that do not naturally belong to the application, but need to be used (e.g. libraries). If a library has an equivalent NPM package, you can just use `require()` as normal after installation via NPM and both the client and server will have support to get the dependency (the client via Browserify).

If the library is client and does not have a NPM package, you will need to place it in `src/vendor`.

GitIgnore
---------

The project is initially setup to ignore common ide files, and built JavaScript / map files. JavaScript files in the `src/common/vendor` directory are not ignored.

Development Style
-----------------

- Every class resides in their own TypeScript file
- Every class TypeScript file ends with an `export = ClassName;` statement to make itself available for import
- Every class that depends on another class, imports that class via `import ClassName = require('/path-to-class/ClassName');`
- Every class TypeScript file is named as `ClassName.ts`
