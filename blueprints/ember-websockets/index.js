module.exports = {
	normalizeEntityName: function () {},

	afterInstall: function () {
		return this.addBowerPackagesToProject([
			{ name: 'uri.js', target: '~1.15.0' }
		]);
	}
};
