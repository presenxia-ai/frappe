frappe.ui.FontSizeManager = class FontSizeManager {
	constructor() {
		// console.log("=== 字体大小管理器构造函数 ===");
		this.init();
	}

	init() {
		// console.log("=== 字体大小管理器初始化 ===");
		// 首先检查frappe.boot是否存在
		if (!frappe.boot) {
			// console.error("错误: frappe.boot 不存在");
			return;
		}

		// 检查frappe.boot.user是否存在
		if (!frappe.boot.user) {
			// console.error("错误: frappe.boot.user 不存在");
			return;
		}

		// 应用字体大小
		this.applyFontSize();

		// 设置监听器
		this.setupListener();
	}

	applyFontSize() {
		const body = $('body');
		body.removeClass('font-size-small font-size-medium font-size-large font-size-extra-large');

		// 优先从 localStorage 获取（保存后的设置）
		const localStorageFontSize = localStorage.getItem('user_font_size');
		let userFontSize = localStorageFontSize;

		// 如果 localStorage 为空，则尝试从 frappe.boot.user 获取
		if (!userFontSize) {
			userFontSize = frappe.boot.user.font_size;
		}
		// console.log("最终使用的字体大小:", userFontSize);
		if (userFontSize && userFontSize !== 'Default') {
			const className = `font-size-${userFontSize.toLowerCase().replace(' ', '-')}`;
			body.addClass(className);
			// console.log("已添加CSS类:", className);
		} else {
			body.addClass('font-size-medium');
			// console.log("使用默认字体大小");
		}
	}

	setupListener() {
		// console.log("=== 设置监听器 ===");
		// Listen for changes in user settings
		$(document).on('user_settings_updated', () => {
			// console.log("=== 收到用户设置更新事件 ===");
			this.applyFontSize();
		});
	}
};

$(document).ready(() => {
	if (frappe.boot && frappe.boot.user) {
		// 从 localStorage 加载字体设置（如果存在）
		const fontSize = localStorage.getItem('user_font_size');
		if (fontSize) {
			frappe.boot.user.font_size = fontSize;
		}
		frappe.font_size_manager = new frappe.ui.FontSizeManager();
	}
});
