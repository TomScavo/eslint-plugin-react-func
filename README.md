# eslint-plugin-react-func

React function rules for ESLint

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-react-func`:

```
$ npm install eslint-plugin-react-func --save-dev
```

or

```
$ yarn add eslint-plugin-react-func -D
```


## Usage

Add `react-func` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "react-func"
    ]
}
```



Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "react-func/max-lines-per-function": ["warn", 20],
        "react-func/max-combined-conditions": ["error", 1]
    }
}
```

## Supported Rules






