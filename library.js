"use strict";

var async = module.parent.require('async');
var meta = module.parent.require('./meta');
var topics = module.parent.require('./topics');
var privileges = module.parent.require('./privileges');
var SocketPlugins = module.parent.require('./socket.io/plugins');

var controllers = require('./lib/controllers'), plugin = {};

function safeParse(settings) {
	var arr = [];
	try {
		arr = JSON.parse('['+settings.list+']') ;
	} catch (err) {
		
	}
	return arr
}

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;
		
	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/headtag', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/headtag', controllers.renderAdminPage);

	handleSocketIO();

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/headtag',
		icon: 'fa-tint',
		name: 'Headtag'
	});

	callback(null, header);
};

plugin.appendConfig = function (config, callback) {
	meta.settings.get('headtag', function (err, settings) {
		if (err) {
			return callback(err);
		}

		
		config['headtag'] = safeParse(settings)
		callback(null, config);
	});
};

plugin.addThreadTools = function (data, callback) {
	
	meta.settings.get('headtag', function(err, settings) {
		var list = safeParse(settings)
		
		data.tools = data.tools.concat(list.map((ele, index) => {
			return {
				class: 'tool-headtag',
				title: 'Mark as ' + ele.name,
				icon: 'fa-question-circle',
				key: ele.key
			};
		}).concat({
			class: 'tool-headtag',
			title: 'Delete Mark',
			icon: 'fa-question-circle'
		}));

		callback(null, data)
	})
};

plugin.getTopics = function (data, callback) {
	var topics = data.topics;

	meta.settings.get('headtag', function(err, settings) {
		var list = safeParse(settings)

		async.map(topics, function (topic, next) {
			if (topic.hasOwnProperty('headtag')) {
				var key = topic.headtag
				var headtagStyle = {
					color: "#000000",
					name: "Mark"
				};
	
				for (var i=0;i!== list.length; i++) {
					if (list[i].key === key) {
						headtagStyle = list[i];
						break;
					}
				}

				topic.title = '<span style="color: '+headtagStyle.color+';">['+headtagStyle.name+']</span>' + topic.title;
			}
	
			return next(null, topic);
		}, function (err) {
			return callback(err, data);
		});
	});
};

function handleSocketIO() {
	SocketPlugins.headtag = {};

	SocketPlugins.headtag.set = function (socket, data, callback) {
		privileges.topics.canEdit(data.tid, socket.uid, function (err, canEdit) {
			if (err) {
				return callback(err);
			}

			if (!canEdit) {
				return callback(new Error('[[error:no-privileges]]'));
			}

			setHelper(data.tid, data.key, callback)
		});
	};
}

function setHelper(tid, key, next) {
	if (key === null) {
		topics.deleteTopicField(tid, 'headtag', next);
	} else {
		topics.setTopicField(tid, 'headtag', key, next);
	}
}

module.exports = plugin;