module.exports = {
  root: true,
//	parser: 'babel-eslint',
	'parserOptions': {
		parser: 'babel-eslint',
	},
  env: {
    browser: true,
    node: true
  },
  extends: [
		'standard',
	//	'plugin:vue/recommended',
		'plugin:vue/essential',
		'prettier'
	],
  plugins: [
//		'html',
		'vue'
  ],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'no-console': 2,
		'indent': [1, 'tab'],
		'no-tabs': 0,
		'spaced-comment': [1, 'never'],
		'space-before-function-paren': [1, 'never'],
		'semi': [1, 'always']
  },
  globals: {}
}
