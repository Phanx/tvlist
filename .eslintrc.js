module.exports = {
	"root": true,
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"mocha": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 7,
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true,
			"jsx": true
		}
	},
	"plugins": ["react"],
	"rules": {
		// - - - - - - - - - - - - - - - - - - - - - -
		// Possible Errors
		//
		"no-console": "off",
		// "valid-jsdoc": "warn",

		// - - - - - - - - - - - - - - - - - - - - - -
		// Best Practices
		//
		"array-callback-return": "error",
		"block-scoped-var": "error",
		"curly": "warn",
		"eqeqeq": "error",
		"no-fallthrough": "off",
		"no-floating-decimal": "error",
		"no-implicit-coercion": "warn",
		"no-useless-return": "error",
		"yoda": "error",

		// - - - - - - - - - - - - - - - - - - - - - -
		// Variables
		//
		"no-undef-init": "error",
		"no-use-before-define": "error",

		// - - - - - - - - - - - - - - - - - - - - - -
		// Stylistic Issues
		//
		"array-bracket-spacing": "warn",
		"block-spacing": "warn",
		"brace-style": ["warn", "1tbs", { "allowSingleLine": true }],
		// "comma-dangle": ["warn", "always-multiline"],
		// "comma-spacing": "warn",
		"comma-style": "warn",
		"computed-property-spacing": "warn",
		"jsx-quotes": ["warn", "prefer-double"],
		// "key-spacing": ["warn", { "mode": "minimum" }],
		"keyword-spacing": "warn",
		"no-lonely-if": "warn",
		"no-whitespace-before-property": "warn",
		// "object-curly-newline": ["warn", { "multiline": true }],
		"object-curly-spacing": ["warn", "always", { "arraysInObjects": false, "objectsInObjects": false }],
		"operator-linebreak": ["warn", "before"],
		"quotes": ["warn", "double", { "allowTemplateLiterals": true, "avoidEscape": true }],
		"semi": ["warn", "never"],
		"space-in-parens": "warn",
		"space-infix-ops": "error",
		"space-unary-ops": ["error", { "nonwords": false, "words": true }],

		// - - - - - - - - - - - - - - - - - - - - - -
		// ES6
		//
		"no-var": "warn",
		"prefer-const": "warn",
		"prefer-rest-params": "warn",
		"prefer-spread": "warn",
		// "prefer-template": "warn",
		"rest-spread-spacing": ["error"],
		// "template-curly-spacing": ["warn", "never"]
	}
}
