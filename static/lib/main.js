"use strict";

$(document).ready(function() {
	/*
		This file shows how client-side javascript can be included via a plugin.
		If you check `plugin.json`, you'll see that this file is listed under "scripts".
		That array tells NodeBB which files to bundle into the minified javascript
		that is served to the end user.

		Some events you can elect to listen for:

		$(document).ready();			Fired when the DOM is ready
		$(window).on('action:ajaxify.end', function(data) { ... });			"data" contains "url"
	*/

	console.log('nodebb-plugin-headtag: loaded');
	// Note how this is shown in the console on the first load of every page

	$(window).on('action:ajaxify.end', function (ev, data) {
		if (data.url.match(/^topic\//)) {
			addLabel();
		}
	});

	$(window).on('action:topic.tools.load', addHandlers);
	function addHandlers() {
		$('.tool-headtag').on('click', function() {
			var key = $(this).attr('data-key');
			var tid = ajaxify.data.tid;
			console.log(key, tid)
			socket.emit('plugins.headtag.set', {tid: tid, key: key.length === 0?null:key}, function (err, data) {
				if (err) {
					return app.alertError(err);
				}
	
				ajaxify.refresh();
			})
		});
	}

	function addLabel() {
		if (ajaxify.data.hasOwnProperty('headtag')) {
			var key = ajaxify.data.headtag;
			var headtagStyle = {
				color: "#000000",
				name: "Mark"
			};

			for (var i=0;i!== config.headtag.length; i++) {
				if (config.headtag[i].key === key) {
					headtagStyle = config.headtag[i];
					break;
				}
			}

			require(['components'], function (components) {
				components.get('post/header').prepend('<span style="color: '+headtagStyle.color+';">['+headtagStyle.name+']</span>');
			});
		}
	}
});