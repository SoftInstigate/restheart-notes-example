# restheart-notes-example

An example notes application built with RESTHeart, AngularJS and MongoDB.

## Clone this repository locally

	$ git clone git@github.com:SoftInstigate/restheart-notes-example.git
	$ cd restheart-notes-example

## Install mongodb and RESTHeart

For detailed installation instructions refer to the [documentation](http://restheart.org/docs/get-up-and-running.html).

However the quickest way is using **docker**:

	$ docker pull mongo
	$ docker pull softinstigate/restheart
	$ docker run -d --name mongodb mongo:3.0
	$ docker run -d -p 8080:8080 --name restheart --link mongodb:mongodb softinstigate/restheart

After the docker mongodb and restheart containers are started in background, you can check the logs by issuing the `docker logs` command

	$ docker logs mongodb
	$ docker logs restheart

Then you might need to adjust the RESTHEART_URL variable value in the following file:

	app/scripts/app.js
	
Edit this line:

	var RESTHEART_URL = "http://192.168.59.103:8080";

Setting the IP (in this case 192.168.59.103, which should be the one with boot2docker) with the one of the restheart container; it might be the `localhost` or, if you are using boot2docker, you can retrive it with the command:

	boot2docker ip

## Create the data model

We will be using the RESTHeart API with [httpie](http://httpie.org) (you can also use another http client such as curl)

	$ http -a admin:changeit PUT http://192.168.59.103:8080/rhnedb descr="restheart notes example db"
	
	HTTP/1.1 201 Created
	...
	
	$ http -a admin:changeit PUT http://192.168.59.103:8080/rhnedb/notes descr="notes collection"
	
	HTTP/1.1 201 Created
	...


## Start the Web app

First of all you have to install Node.js for your system [https://nodejs.org](https://nodejs.org).

Then check you have the latest `npm` installed

	npm update -g npm

Install [Grunt](http://gruntjs.com/getting-started) and [Bower](http://bower.io) tools

	npm install -g bower grunt-cli

Run `npm install` to install project dependencies

	npm install

Run `bower install`. If Bower asks you for the AngularJS version, choose 1.3.0.

	bower install

Build the project

	grunt build

If you want to preview the web application, run `grunt serve`; after a while it should starts the default browser at [http://localhost:9000/#/signin](http://localhost:9000/#/signin)
Of course, make sure you have already started RESTHeart as well.

	grunt serve

To login in the Web app, you can use the **admin** user with password **changeit**

For more information on RESTHeart security setting refer to the [documentation](http://restheart.org/docs/security.html).

## Testing

Running `grunt test` will run the unit tests with karma.

<hr></hr>

_Made with :heart: by [The SoftInstigate Team](http://www.softinstigate.com/). Follow us on [Twitter](https://twitter.com/softinstigate)_.
