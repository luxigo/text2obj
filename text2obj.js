#!/usr/local/bin/node
/*
    text2obj - Generate a javascript object or extract data
               from a textual data structure

    Copyright (C) 2012 Luc Deschenaux - https://github.com/luxigo/text2obj

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var DEBUG;
var stack;
var result;

if (module && module.id!='.') {
	module.exports={
		parse: text2obj
	}
} else {
	var standAlone=true;
	var fs=require('fs');
	if (process.argv[2]=='-') {
		var input='';
		process.stdin.resume();
		process.stdin.setEncoding('ascii');
		process.stdin.on('data', function(chunk){
	        	input += chunk;
		})
		process.stdin.on('end', function(){
		    text2obj(input);
		});
	} else {
		var input=fs.readFileSync(process.argv[2]);
		text2obj(input);
	}
}

function text2obj(input) {
	result={};
	stack=[
		{
			tag: 'root',
			col: -1 
		}
	];
	if (input.length) {
		input=input.toString().split('\n');
		while(input.length) parseLine(input);
		if (standAlone) {
			var util=require('util');
			if (process.argv.length>3) {
				var i=3;
				while (true) {
					var levels=process.argv[i].split('.');
					var requested=result;
					try {
						levels.forEach(function(prop){
							requested=requested[prop];
						});
						console.log(typeof(requested)=='object'?util.inspect(requested,true,null):requested);
					} catch(e) {
						console.log(e);
					}

					++i;
					if (i>=process.argv.length) break;
				}
			} else {
				console.log(typeof(result)=='object'?util.inspect(result,true,null):result);
			}
			process.exit(0);
		}
	}
	return result;
}

function parseLine(input) {
	var line=input.shift().trimRight();
	if (!line.length) return;

	var matches=line.match(/^( *)?([^:]+):(.*)?/);
	if (DEBUG) console.log(matches);
	var tag=matches[2].replace(/ /g,'');
	var col=matches[1]?matches[1].length:0;

	var curLevel=stack[stack.length-1];

	while (col<=curLevel.col) {
		stack.pop();
		curLevel=stack[stack.length-1];
	}
	
	var value=matches[3];
	if (value==undefined) {
		getCurLevelObj()[tag]={};
		stack.push({
			tag: tag,
			col: col
		});

	} else {
		var value=value.trim();
		getCurLevelObj()[tag]=value;
	}
}

function getCurLevelObj() {
	var obj;
	stack.forEach(function(level,index) {
		if (index==0) obj=result;
		else obj=obj[level.tag];
	});
	return obj;
}

