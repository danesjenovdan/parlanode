# Parlasite

This is the actual website implementation powering [parlameter.si](https://parlameter.si/). It's not much, and it remains deceptively simple. Implemented with node.js it serves HTML pages with cards from [Parlanode](https://github.com/muki/parlanode) embedded within them.

Parlameter (or any site using parlanode as its card-serving engine) could easily be implemented as a bunch of static HTML pages or using any other CMS service that allows you to embed things from the web. The main advantage of Parlasite's configuration that it requests the HTML-only code from [Parlanode](https://github.com/muki/parlanode) before it renders the page and serves it to the visitor.

If you embed [Parlanode](https://github.com/muki/parlanode) cards with the `embed=true` parameter the cards themselves are loaded client-side after the scaffolding has finished loading. Parlasite provides an example implementation to use [Parlanode](https://github.com/muki/parlanode) as an integral part of a website.

## Installation

Download/clone the git repository and run `npm install`.

## Start local (development) server

Run `node run.js` from the repository's root directory. It will serve the website on `localhost:3066`. No hot reloading module is supplied, you need to refresh the website manually to see the results. If you change any of the "backend" files (like router.js) you need to also restart the development server.

## Deploy

On our production servers, Parlasite is deployed using [pm2](https://github.com/Unitech/pm2). Your life will be simplest if you use it as well. In order to do that, install it on your server and edit `ecosystem.config.js` to suit your needs. After you've done that run `pm2 deploy ecosystem.config.js production` to get the app up and running.
