# Modern JavaScript Explained For Dinosaurs
The goal of this article is to provide a historical context of how JavaScript tools have evolved to what they are today in 2017. We’ll start from the beginning and build an example website like the dinosaurs did — no tools, just plain HTML and JavaScript. Then we’ll introduce different tools incrementally to see the problems that they solve one at a time.

## Using JavaScript the “old-school” way
Let’s start with an “old-school” website using HTML and JavaScript, which involves manually downloading and linking files. Here’s a simple `index.html` file that links to a JavaScript file:

``` html
<!-- index.html -->  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <title>JavaScript Example</title>  
  **<script src="index.js"></script>**  
</head>  
<body>  
  <h1>Hello from HTML!</h1>  
</body>  
</html>
```

Now let’s say you wanted to add a library someone else wrote like [moment.js](https://momentjs.com/) (a library which can help format dates in a human readable way). We can add moment.js to our website by downloading the `moment.min.js` file in the same directory and including it in our `index.html` file.

``` html
<!-- index.html -->  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <title>Example</title>  
  <link rel="stylesheet" href="index.css">  
  <script src="moment.min.js"></script>
  <script src="index.js"></script>  
</head>  
<body>  
  <h1>Hello from HTML!</h1>  
</body>  
</html>
```

Note that `moment.min.js` gets loaded before `index.js`, which means you can use the `moment` function in `index.js` as follows:

``` js
// index.js  
console.log("Hello from JavaScript!");  
console.log(moment().startOf('day').fromNow()); // moment.js
```

And this is how we used to make websites with JavaScript libraries! The good thing was that it was easy enough to understand. The bad thing was that it was annoying to find and download new versions of libraries every time they would update.

## Using a JavaScript package manager (npm)

- Tahun 2010, mulai terjadi kompetisi untuk menciptakan JavaScript package manager untuk membantu otomatisasi proses download dan upgrade library dari central repository.
- Tahun 2013, [Bower](https://bower.io/) bisa dibilang menjadi yang paling populer.
- Tahun 2015, [npm](https://www.npmjs.com/) menjadi yang paling populer. Awalnya digunakan untuk [node.js](https://nodejs.org/en/) yang digunakan untuk server, bukan frontend.
- Tahun 2016, [yarn](https://yarnpkg.com/en/) muncul menjadi alternatif npm. Tapi sebenarnya masih menggunakan npm package.

Let’s look at how to use npm to install the moment.js package automatically instead of manually downloading it. You can navigate your command line to the folder with your index.html file and enter:

```
$ npm init
```

This will prompt you with several questions (the defaults are fine, you can hit “Enter” for each question) and generate a new file named `package.json`. This is a configuration file that npm uses to save all project information.

To install the moment.js JavaScript package, we can enter the following command in the command line:

```
$ npm install moment --save
```

This command does two things — first, it downloads all the code from the moment.js package into a folder called `node_modules`. Second, it automatically modifies the `package.json` file to keep track of moment.js as a project dependency.

This is useful later when sharing a project with others — instead of sharing the `node_modules` folder (which can get very large), you only need to share the `package.json` file and other developers can install the required packages automatically with the command `npm install`.

So now we no longer have to manually download moment.js from the website, we can automatically download and update it using npm. Looking inside the `node_modules` folder, we can see the `moment.min.js` file in the `node_modules/moment/min` directory. This means we can link to the npm downloaded version of `moment.min.js` in the `index.html` file as follows:

``` html
<script src="node_modules/moment/min/moment.min.js"></script>
```

So the good thing is that we can now use npm to download and update our packages through the command line. The bad thing is right now we’re digging through the `node_modules` folder to find the location of each package and manually including it in our HTML. That’s pretty inconvenient, so next we’ll take a look at how to automate that process as well.

## Using a JavaScript module bundler (webpack)
Most programming languages provide a way to import code from one file into another. JavaScript wasn’t originally designed with this feature, because JavaScript was designed to only run in the browser, with no access to the file system of the client’s computer (for security reasons). So for the longest time, organizing JavaScript code in multiple files required you to load each file with variables shared globally.

In 2009, a project named CommonJS was started with the goal of specifying an ecosystem for JavaScript outside the browser. A big part of CommonJS was its specification for modules, which would finally allow JavaScript to import and export code across files like most programming languages, without resorting to global variables. The most well-known of implementation of CommonJS modules is node.js.

As mentioned earlier, node.js is a JavaScript runtime designed to run on the server. Here’s what the earlier example would look like using node.js modules. Instead of loading all of `moment.min.js` with an HTML script tag, you can load it directly in the JavaScript file as follows:

``` js
// index.js  
var moment = require('moment');
console.log("Hello from JavaScript!");  
console.log(moment().startOf('day').fromNow());
```

Again, this is how module loading works in node.js, which works great since node.js is a server side language with access to the computer’s file system. Node.js also knows the location of each npm module path, so instead of having to write `require('./node_modules/moment/min/moment.min.js)`, you can simply write `require('moment')` — pretty sweet.

This is all great for node.js, but if you tried to use the above code in the browser, you’d get an error saying `require` is not defined. The browser doesn’t have access to the file system, which means loading modules in this way is very tricky — loading files has to be done dynamically, either synchronously (which slows down execution) or asynchronously (which can have timing issues).

This is where a module bundler comes in. A JavaScript module bundler is a tool that gets around the problem with a build step (which has access to the file system) to create a final output that is browser compatible (which doesn’t need access to the file system). In this case, we need a module bundler to find all `require` statements (which is invalid browser JavaScript syntax) and replace them with the actual contents of each required file. The final result is a single bundled JavaScript file (with no require statements)!

The most popular module bundler was [Browserify](http://browserify.org/), which was released in 2011 and pioneered the usage of node.js style require statements on the frontend (which is essentially what enabled npm to become the frontend package manager of choice). Around 2015, [webpack](https://webpack.github.io/) eventually became the more widely used module bundler (fueled by the popularity of the [React](https://reactjs.org/) frontend framework, which took full advantage of webpack’s various features).

Let’s take a look at how to use webpack to get the above `require('moment')` example working in the browser. First we need to install webpack into the project. Webpack itself is an npm package, so we can install it from the command line:

```
$ npm install webpack webpack-cli --save-dev
```

Note that we’re installing two packages — webpack and webpack-cli (which enables you to use webpack from the command line). Also note the `--save-dev` argument — this saves it as a development dependency, which means it’s a package that you need in your development environment but not on your production server. You can see this reflected in the `package.json` file, which was automatically updated:

``` json
{  
  "name": "modern-javascript-example",  
  "version": "1.0.0",  
  "description": "",  
  "main": "index.js",  
  "scripts": {  
    "test": "echo \"Error: no test specified\" && exit 1"  
  },  
  "author": "",  
  "license": "ISC",  
  "dependencies": {  
    "moment": "^2.19.1"  
  },  
  "devDependencies": {  
    "webpack": "^4.17.1",  
    "webpack-cli": "^3.1.0"  
  }
}
```

Now we have webpack and webpack-cli installed as packages in the `node_modules` folder. You can use webpack-cli from the command line as follows:

```
$ ./node_modules/.bin/webpack index.js --mode=development
```

This command will run the webpack tool that was installed in the `node_modules` folder, start with the `index.js` file, find any `require` statements, and replace them with the appropriate code to create a single output file (which by default is `**dist/main.js**`). The `--mode=development` argument is to keep the JavaScript readable for developers, as opposed to a minified output with the argument `--mode=production`.

**PENTING**
Kode pada snippet terakhir sudah usang (deprecated). Untuk selanjutnya, penggunaan webpack akan dibahas pada catatan berjudul `getting-started`.


