# Multimaze

## Introduction
Multimaze is an application to run a basic multiplayer two-player maze solving competitive game with basic chat functionality. It utilizes Node.js and some Node.js packages. At most, it has features such as auto-room allocation, score keeping, and realtime opponent movement. The client uses [AngularJS](https://angularjs.org/) alongside [JQuery](https://jquery.com/).

## How to run

*If you already know how to run and install a Node.js server, you can skip this section. Simply run `node server.js` located within the `server` folder*

First, install NodeJS from [their official webpage](https://nodejs.org/en/download/).

Multimaze has two dependencies, [Express](expressjs.com) and [socket.io](http://socket.io/). If you do not have these Node.js pacakages installed, you can install them by running `npm install` while your working directory is within the `server` folder.

    cd /path/to/directory/server
    npm install

Then, simply run Node.js on the `server.js` file by running the following command, again while in the `server` folder.

    node server

## Copyright and thanks

This project has a MIT license. Please read `LICENSE` for more information. Additional thanks go to David Bau for providing a seedable RNG.

## Authors and contact info
Message me at eddie22099 at gmail dot com.
