module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "env": {
      "es6": true,
      "browser": true
    },
    "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "plugins": [ "react" ],
    "rules": {
      'no-console': 'off',
      'react/jsx-boolean-value': 'off',
      'react/jsx-closing-bracket-location': 'off',
      'no-plusplus': 'off',
      'no-script-url': 'off',
      'prefer-template': 'off',
      'class-methods-use-this': 'off',
      'no-lonely-if': 'off',
      'import/prefer-default-export': 'off',
      'allow-body-style': 'off',
      'no-case-declarations': 'off',
      "no-underscore-dangle": [
        "error",
        { "allow": ["__REDUX_DEVTOOLS_EXTENSION__"]}
      ]
    }
};
