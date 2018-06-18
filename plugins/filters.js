import Vue from 'vue'

Vue.filter('initialcase', function(text) {
	if (!text) return null;
	if (text == '') return '';
	return text[0].toUpperCase() + text.slice(1);
});

Vue.filter('titlecase', function(text) {
	if (!text) return null;
	if (text == '') return '';
	return text.replace(/\b\w+/g, function(s) {return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
});
