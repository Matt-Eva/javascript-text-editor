# JavaScript Text Editor

<strong>Note:</strong><em>This project has been put on hold for the time being. Not all features listed below are available at the present time.</em>

This is a custom built rich text editor made with JavaScript that outputs JSON.

It uses a `contenteditable` HTML element as the wrapper.

Features include making headers, italicizing, bolding, and underlining text, centering and indenting text, inserting links and images, and creating blockquotes.

Keyboard shortcuts are not prohibited, although toolbar alternatives are also presented.

## Inspiration / Alternatives

The purpose of this editor is to serve as an immediate drop-in editor with all features baked-in.

If you're looking for browser / javascript based editors that offer a more plug-and-play approach, with greater extensibility and customizability, check out <a href="https://docs.slatejs.org/">Slate</a> and <a href="https://editorjs.io/getting-started/">Editor.js</a>! EditorJS was the original inspiration for creating an editor that generates JSON output, and Slate is an excellent tool if you're working with React and really want to build out a powerful and robust editor!

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
