export function replaceFirstTextChild(editor, state) {
  const childNodes = editor.childNodes;
  const child = childNodes[0];

  if (child && child.nodeName === "#text") {
    const relevantNodes = [child];
    let node = child.nextSibling;
    while (node && inlineTypes[node.nodeName]) {
      relevantNodes.push(node);
      node = node.nextSibling;
    }

    const p = document.createElement("p");
    const appendNodes = [...relevantNodes];
    for (const node of relevantNodes) {
      editor.removeChild(node);
    }
    for (const node of appendNodes) {
      p.append(node);
    }

    if (state.focusedNode === child) {
      state.focusedNode = p;
    }

    editor.insertBefore(p, editor.firstChild);
  }
}
