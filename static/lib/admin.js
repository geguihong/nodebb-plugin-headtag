'use strict';
/* globals $, app, socket */

define('admin/plugins/headtag', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('headtag', $('.headtag-settings'));

		$('#save').on('click', function() {
			Settings.save('headtag', $('.headtag-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'headtag-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});