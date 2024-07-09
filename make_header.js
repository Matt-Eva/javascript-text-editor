export function makeHeader(editor, state) {
  if (state.focusedNode !== editor) {
    while (state.focusedNode.parentNode !== editor) {
      state.focusedNode = state.focusedNode.parentNode;
    }

    if (state.focusedNode.nodeName === "H2") {
      const p = document.createElement("p");
      const childArray = [...state.focusedNode.childNodes];

      for (const child of childArray) {
        p.appendChild(child);
      }

      editor.replaceChild(p, state.focusedNode);
      state.focusedNode = p;
    } else {
      const header = document.createElement("h2");
      const childArray = [...state.focusedNode.childNodes];

      for (const child of childArray) {
        header.appendChild(child);
      }

      editor.replaceChild(header, state.focusedNode);
      state.focusedNode = header;
    }
  }
}
