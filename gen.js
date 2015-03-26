#!/usr/bin/env node

var Prompto = require('promptosaurus');
var gulp = require('gulp');
var template = require('gulp-template');
var rename = require('gulp-rename');
var fs = require('fs');

var prompt = new Prompto();
var paths = {
    'm': [
        'models/',
        'tests/models/'
    ],
    'v': [f
        'views/',
        'tests/views/'
    ],
    'c': [
        'collections/',
        'tests/collections/'
    ]
}
var data = {};
var sources = [];

prompt.add('Name your component:', function (str){
    data.name = str;
})
.add('Do you need a model, view or collection? (m|v|cl)? Add all you need:', function (str){
    var modules = str.split('');
    var self = this;

    modules.forEach(function(item){
        try {
            // make sure the request files to generate don't alrady exist
            fs.openSync('common/components/' + data.name + '/' + paths[item][0] + data.name + '.js', 'r');
        } catch(e){

            // update sources for gulp to handle at the end
            sources.push(paths[item][0]);
            sources.push(paths[item][1]);
            return true;
        }
    });
    this.hasValidResponse = sources.length === str.length * 2;
})
.add('Do you want to update configs (y|n)?', function(str){
    data.updateConfigs = str.charAt(0).toLowerCase() === 'y';
})
.done(function(){

    var tasks = [];
    sources.forEach(function(source, idx){
        gulp.task('generate' + idx, function(){
            return gulp.src('generator/' + source + 'slug.js')
                    .pipe(template(data))
                    .pipe(rename(source + data.name + '.js'))
                    .pipe(gulp.dest('common/components/' + data.name));
        });

        tasks.push('generate' + idx);
    });

    gulp.start(tasks);
})
.ask();