/*
	CookieStorage
	implements localStorage functions so it's possible to use this storage object instead of default localStorage object.
	All data is saved in a single cookie.
	Implemented functions:
		getItem(key)
		setItem(key,value)
		removeItem(key)
	License: MIT 
*/

var CookieStorage = function(){
    	CookieStorage.prototype.arr = new Object();
    	
    	// from http://www.quirksmode.org/js/cookies.html, I dont really see a point in own implementation of these functions, thanks again Peter-Paul Koch!
		function createCookie(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		}
		
		function readCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		}
		
		function eraseCookie(name) {
			createCookie(name,"",-1);
		}
    
		// initialization function = loads arr data from cookie
    	CookieStorage.prototype._init = function() {
			var data = readCookie('CookieStorage');
			data = unescape(data);
			var rows = data.split('\n');
			for (var k in rows) {
				temp = rows[k].split(' || ');
				if (temp[0].length > 0){this.arr[temp[0]] = temp[1];}
			}
    	}
    	
    	// saves arr data  into a cookie
    	CookieStorage.prototype._saveChanges = function(){
    		// serialize arr and save in in a cookie
    		var data = '';
	    	for (var k in this.arr) {
		    	row = k+' || '+this.arr[k];
		    	data += row+"\n";
	    	}
	    	// set cookie with serialized data
	    	createCookie('CookieStorage',escape(data),false);
    	}
    	
    	
    	// implementation of localStorage methods
	    CookieStorage.prototype.setItem = function(key,value){
		    this.arr[key] = value;
		    this._saveChanges();
	    } 
	    CookieStorage.prototype.getItem = function(key){
		    return this.arr[key];
	    }
	    CookieStorage.prototype.removeItem = function(key){
		    delete this.arr[key];
		    this._saveChanges();
	    }
	    
	    this._init();
    }