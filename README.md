#  WordPress Theme Development Gulp Script

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg?style=plastic)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

A simple Gulp script that sits in a separate directory that responds to a `--theme` flag to specify which directory to look for source files.

It also checks for an optional `--env` flag to set a directory where [WordPress](https://www.wordpress.org) is installed and sets [Browsersync](https://www.browsersync.io/) to use that value as `{{env}}.localhost` as the host to proxy. If no flag is set, then it will default to `wpdev`. This was added because, due to file path problems involving symbolic links, the plugin [Show Current Template](https://wordpress.org/plugins/show-current-template/) would return an empty list of files. Since this plugin is very valuable in theme development instead of using a symbolic link back to my source directory, Gulp will now copy the required theme files to the WordPress installation's `wp-contents/themes/` folder plus `{{theme}}` as defined by the first flag.

This script is based off of [Morten Rand-Hendrickson](http://mor10.com/)'s Gulp script used in his course on [Lynda.Com](https://www.lynda.com), [WordPress: Building Themes from Scratch Using Underscores](https://www.lynda.com/WordPress-tutorials/WordPress-Building-Themes-from-Scratch-Using-Underscores/491704-2.html)

The update to version 2.0 has begun. This includes phasing out the use of [Bower](https://bower.io/) and [`gutil`](https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5) due to deprecation as well as an upgrade to Gulp v4.

Version 1.0 has been archived in the **v1.0** branch.