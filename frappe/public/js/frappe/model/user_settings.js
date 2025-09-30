frappe.provide("frappe.model.user_settings");

$.extend(frappe.model.user_settings, {
	get: function (doctype) {
		return frappe
			.call("frappe.model.utils.user_settings.get", { doctype })
			.then((r) => JSON.parse(r.message || "{}"));
	},
	save: function (doctype, key, value) {
		if (frappe.session.user === "Guest") return Promise.resolve();

		const old_user_settings = frappe.model.user_settings[doctype] || {};
		const new_user_settings = $.extend(true, {}, old_user_settings); // deep copy

		if ($.isPlainObject(value)) {
			new_user_settings[key] = new_user_settings[key] || {};
			$.extend(new_user_settings[key], value);
		} else {
			new_user_settings[key] = value;
		}

		const a = JSON.stringify(old_user_settings);
		const b = JSON.stringify(new_user_settings);
		if (a !== b) {
			// update if changed
			return this.update(doctype, new_user_settings);
		}
		return Promise.resolve(new_user_settings);
	},
	remove: function (doctype, key) {
		var user_settings = frappe.model.user_settings[doctype] || {};
		delete user_settings[key];

		return this.update(doctype, user_settings);
	},
	update: function (doctype, user_settings) {
		if (frappe.session.user === "Guest") return Promise.resolve();
		return frappe.call({
			method: "frappe.model.utils.user_settings.save",
			args: {
				doctype: doctype,
				user_settings: user_settings,
			},
			callback: function (r) {
				frappe.model.user_settings[doctype] = r.message;
			},
		});
	},
});

frappe.get_user_settings = function (doctype, key) {
	var settings = frappe.model.user_settings[doctype] || {};
	if (key) {
		settings = settings[key] || {};
	}
	return settings;
};

frappe.get_user_settings = function (doctype, key) {
	var settings = frappe.model.user_settings[doctype] || {};
	if (key) {
		settings = settings[key] || {};
	}
	return settings;
};

// 添加以下代码以在用户设置更新时触发事件
$(document).on('frappe.ui.notifications.update_notification_count', function() {
	// 当通知更新时重新应用字体大小
	if (frappe.font_size_manager) {
		frappe.font_size_manager.applyFontSize();
	}
});
