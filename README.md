# restheart-notes-example

an example notes application built with RESTHeart, AngularJS and restangular

## Install mongodb and RESTHeart

For detailed installation instructions refer to the [documentation](http://restheart.org/docs/get-up-and-running.html).

However the quickest way is using **docker**:

	$ docker pull mongo
	$ docker pull softinstigate/restheart
	$ docker run -d --name mongodb mongo:3.0
	$ docker run -d -p 27017:27017 --name mongodb -v <db-dir>:/data/db mongo:3.0

After the docker mongodb and restheart containers are started, you might need to adjust the RESTHEART_URL variable value in the following file:

	app/scripts/app.js
	
edit this line:

	var RESTHEART_URL = "http://192.168.59.103:8080";

setting the ip (in this case 192.168.59.103) with the one of the restheart container; it might be the localhost or, if you are using boot2docker, you can retrive it with the command:

	boot2docker ip

## Create the data model

We will be using the RESTHeart API with [httpie](http://httpie.org) (you can also use another http client such as curl)

	$ http -a admin:changeit PUT http://192.168.59.104:8080/rhnedb descr="restheart notes example db"
	HTTP/1.1 201 Created
	...
	$ http -a admin:changeit PUT http://192.168.59.104:8080/rhnedb/notes descr="notes collection"
	HTTP/1.1 201 Created
	...


## Start the web app

Run `grunt` for building and `grunt serve` for preview.

To login in the web app, you can use the **admin** user with password **changeit**

For more information on RESTHeart security setting refer to the [documentation](http://restheart.org/docs/security.html).

## Testing

Running `grunt test` will run the unit tests with karma.
