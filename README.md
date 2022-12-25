# docsify-plugin-advance-blockquote


## Install

1. Insert FontAwesome **CSS** into docsify document (index.html)

```html
<link rel="stylesheet" href="https://unpkg.com/@fortawesome/fontawesome-free/css/fontawesome.css" />
<link rel="stylesheet" href="https://unpkg.com/@fortawesome/fontawesome-free/css/brands.css" />
<link rel="stylesheet" href="https://unpkg.com/@fortawesome/fontawesome-free/css/regular.css" />
<link rel="stylesheet" href="https://unpkg.com/@fortawesome/fontawesome-free/css/solid.css" />
```

2. Then insert script plugin into same document

```html
<script src="https://unpkg.com/docsify-plugin-advance-blockquote/dist/index.min.js"></script>
```


## Usage

Any text inside of `:` character is processed as CSS style and converted to HTML code for [FontAwesome](https://fontawesome.com/icons), example:

```markup
:fas fa-home fa-fw:
```

This code is converted to :

```html
<i class="fas fa-home fa-fw"></i>
```


