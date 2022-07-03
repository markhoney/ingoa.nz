import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import {cleanPage} from '@/data/utils';

export default function (Vue, {head, appOptions}) {
	Vue.use(BootstrapVue);
	Vue.prototype.$clean = cleanPage;
	head.htmlAttrs = {class: 'h-100'};
	head.bodyAttrs = {class: 'd-flex flex-column h-100'};
}
