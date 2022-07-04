import BootstrapVue from 'bootstrap-vue';
import pluralise from 'pluralize';
import * as changeCase from 'change-case';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import query from '@/plugins/query';
import locale from '@/plugins/locale';

export default function (Vue, {appOptions, head}) {
	Vue.use(BootstrapVue);
	Vue.prototype.$tf = locale(appOptions.i18n);
	Vue.prototype.$q = query;
	Vue.prototype.$case = changeCase;
	Vue.prototype.$pluralise = pluralise;
	head.htmlAttrs = {class: 'h-100'};
	head.bodyAttrs = {class: 'd-flex flex-column h-100'};
}
