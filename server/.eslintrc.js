module.exports = {
  "plugins": ["jasmine"],
  "env": {
    "es6": true,
    "node": true,
    "jasmine": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:jasmine/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2017
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": "off",
    "jasmine/no-spec-dupes": [
      1,
      "branch"
    ]
  }
};
