/*
 * Copyright 2014 Bati Sengul
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Citation (bib){
	if( typeof bib === "undefined" ){
		this.name = "";
		this.type = "";
		this.properties = [];
	}
	else
		this.parse(bib);
}

Citation.prototype.getString = function(name) {
	if( name.toLowerCase() == "name" )
		return this.name;
	else if ( name.toLowerCase() == "type" )
		return this.type;
	else{
		for( var i = 0; i < this.properties.length; i++ ){
			if(name.toLowerCase() == this.properties[i].name.toLowerCase())
				return this.properties[i].value;
		}
	}
	return null;
}

Citation.prototype.replaceString = function(name, value) {
	if( name.toLowerCase() == "name" )
		this.name = value;
	else if ( name.toLowerCase() == "type" )
		this.type = value;
	else{
		for( var i = 0; i < this.properties.length; i++ ){
			if(name.toLowerCase() == this.properties[i].name.toLowerCase())
				this.properties[i].value = value;
		}
	}
}

Citation.prototype.asString = function(){
	var ret = "@" + this.type + "{" + this.name + ",\n";
	for( var i = 0; i < this.properties.length; i++ )
		ret += "    " + this.properties[i].name + " = {" + this.properties[i].value + "},\n";
	ret = ret.substring(0,ret.length - 2);
	ret += "\n}\n\n";
	return ret;
}

Citation.prototype.formatString = function(line){
	return line.replace(/\\n|\\r/g," ").replace(/\s+/g," ");
}

Citation.prototype.parse = function(bib){
	bib = this.formatString(bib);
	if(bib.lastIndexOf("}") == -1)
		return -1;
	var balance = 1;
	var it = bib.indexOf("{") + 1;
	if( it == 0 )
		return -1;
	while(balance > 0){
		if( it == bib.length )
			return -1;
		if( bib.charAt(it) == "{" )
			balance++;
		else if( bib.charAt(it) == "}" )
			balance --;
		it++;
	}

	bib = bib.substring(0,it-2);

	var index = bib.indexOf("{");
	var index2 = bib.indexOf(",");
	if(index != -1 && index2 > index && index2 < bib.length - 1 ){
		this.type = bib.substring(0,index);
		this.name = bib.substring(index + 1, index2);
	}
	else
		return -1;
	bib = bib.substring(index2 + 1);

	this.properties = [];
	while(bib.indexOf("{") != -1){
		index = bib.indexOf("=");
		if(index == -1)
			break;
		var prop1 = bib.substring(0,index).trim();

		index = bib.indexOf("{");
		if(index == -1)
			break;
		bib = bib.substring(index + 1);

		balance = 1;
		it = 0;
		while(balance > 0){
			if(it == bib.length)
				return -1;	
			if(bib.charAt(it) == "{")
				balance++;
			else if(bib.charAt(it) == "}")
				balance--;
			it++;
		}
		var prop2 = bib.substring(0,it - 1);
		this.properties.push({"name": prop1, "value": prop2}); 
		bib = bib.substring(it);
		index = bib.indexOf(",");
		if(index == -1)
			break;
		bib = bib.substring(index + 1);
	}
}
