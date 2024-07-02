# JavaScript Text Editor

This is a custom built text editor made with JavaScript that outputs JSON.

It uses a `contenteditable` HTML element as the wrapper.

Features include making headers, italicizing, bolding, and underlining text, centering and indenting text, inserting links and images, and creating blockquotes.

Keyboard shortcuts are not prohibited, although toolbar alternatives are also presented.

## Styling

Styling is entirely customizable. The editor comes with no initial styling whatsoever.

The overall HTML format of the editor is as follows:

```html
<section id="editor-container">
  <section id="toolbar">
    <button id="headerBtn">Header</button>
    <button id="italicize">italicize</button>
    <button id="bold">bold</button>
    <button id="underline">underline</button>
  </section>
  <section id="editor" contenteditable="true"></section>
</section>
```

## Data Returned

Only a select few html elements are allowed at final data output. These are

- H2
- H3
- P
- A
- IMG
- U
- STRONG
- EM
- BLOCKQUOTE

Before data is returned as json, it is cleaned to ensure that it only contains these specific elements.

However, during editing, editor innerHTML may not align with these elements. Here are some elements that may be present
