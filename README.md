#  WordPress Theme Development Gulp Script

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg?style=plastic)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

A simple Gulp script that sits in a separate directory that responds to a `--theme` flag to specify which directory to look for source files.

This script is based off of [Morten Rand-Hendrickson](http://mor10.com/)'s Gulp script used in his [WP Rig: WordPress Theme Boilerplate](https://github.com/wprig/wprig) with some modifications to allow it to exist in a separate directory and manage multiple theme builds.

The update to version 2.0 has begun. This includes phasing out the use of [Bower](https://bower.io/) and [`gutil`](https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5) due to deprecation as well as an upgrade to Gulp v4. It also adds PostCSS to the workflow so that features such as CSSNext can be used.

To launch, simply install into a directory that is at the same level as your theme's folder. Then simply execute `gulp --theme {theme directory}`.

Version 1.0 has been archived in the **v1.0** branch.