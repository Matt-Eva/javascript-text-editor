const editor = document.getElementById("editor");
const headerBtn = document.getElementById("headerBtn");
const italicizeBtn = document.getElementById("italicize");
const clickHeader = document.getElementById("clickHeader");

let focusedElement;
let currentSelection;

italicizeBtn.addEventListener("click", () => {
  if (currentSelection && !currentSelection.isCollapsed) {
    const anchorNode = currentSelection.anchorNode;
    const focusNode = currentSelection.focusNode;
    const focusOffset = currentSelection.focusOffset;
    const anchorOffset = currentSelection.anchorOffset;
    const range = document.createRange();

    if (focusNode === anchorNode) {
      let node = focusNode;
      const textContent = node.textContent;
      let before = "";
      let modified = "";
      let after = "";

      if (focusOffset > anchorOffset) {
        before = textContent.slice(0, anchorOffset);
        modified = textContent.slice(anchorOffset, focusOffset);
        after = textContent.slice(focusOffset);
      } else {
        before = textContent.slice(0, focusOffset);
        modified = textContent.slice(focusOffset, anchorOffset);
        after = textContent.slice(anchorOffset);
      }

      const em = document.createElement("em");
      em.textContent = modified;
      const beforeNode = document.createTextNode(before);
      const afterNode = document.createTextNode(after);

      while (node.nodeName === "#text") {
        node = node.parentNode;
      }

      node.textContent = "";
      node.append(beforeNode, em, afterNode);
    } else {
      const position = anchorNode.compareDocumentPosition(focusNode);

      if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        console.log("focus node preceding anchor node");
        range.setStart(focusNode, focusOffset);
        range.setEnd(anchorNode, anchorOffset);
      } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        console.log("focus node following anchor node");
        range.setStart(anchorNode, anchorOffset);
        range.setEnd(focusNode, focusOffset);
      }

      let startContainer = range.startContainer;
      for (let i = 0; i < 100; i++) {
        startContainer = startContainer.parentNode;
        if (startContainer.nextSibling) {
          break;
        }
      }

      let endContainer = range.endContainer;
      for (let i = 0; i < 100; i++) {
        endContainer = endContainer.parentNode;
        if (endContainer.previousSibling) {
          break;
        }
      }

      let node = startContainer;
      const nodeArray = [node];

      for (let i = 0; i < 100; i++) {
        node = node.nextSibling;
        nodeArray.push(node);
        if (node == endContainer) {
          break;
        }
      }

      for (let node of nodeArray) {
        const textContent = node.textContent;
        const em = document.createElement("em");
        if (node === startContainer) {
          const before = textContent.slice(0, range.startOffset);
          const modified = textContent.slice(range.startOffset);
          em.textContent = modified;
          node.textContent = before;
          node.appendChild(em);
        } else if (node === endContainer) {
          const modified = textContent.slice(0, range.endOffset);
          const after = textContent.slice(range.endOffset);
          em.textContent = modified;
          const textNode = document.createTextNode(after);
          node.textContent = "";
          node.append(em, textNode);
        } else {
          em.textContent = textContent;
          node.textContent = "";
          node.appendChild(em);
        }
      }
    }
  }
});

// editor.addEventListener("mouseup", (e) => {
//   console.log("mouseup");
//   const selection = window.getSelection();
//   console.log(selection.isCollapsed);

//   if (!selection.isCollapsed) {
//     console.log("anchor node", selection.anchorNode);
//     console.log("focusNode", selection.focusNode);
//     const range = document.createRange();
//     range.setStart(selection.anchorNode, selection.anchorOffset);
//     range.setEnd(selection.focusNode, selection.focusOffset);

//     const fragment = range.extractContents();

//     const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
//     let currentNode;

//     while ((currentNode = walker.nextNode())) {
//       console.log(currentNode);
//       const startOffset =
//         currentNode === range.startContainer ? range.startOffset : 0;
//       const endOffset =
//         currentNode === range.endContainer
//           ? range.endOffset
//           : currentNode.length;

//       const before = currentNode.substringData(0, startOffset);
//       const middle = currentNode.substringData(
//         startOffset,
//         endOffset - startOffset
//       );
//       const after = currentNode.substringData(
//         endOffset,
//         currentNode.length - endOffset
//       );

//       if (before) {
//         currentNode.parentNode.insertBefore(
//           document.createTextNode(before),
//           currentNode
//         );
//       }

//       const span = document.createElement("i");
//       span.appendChild(document.createTextNode(middle));
//       currentNode.parentNode.insertBefore(span, currentNode);

//       if (after) {
//         currentNode.parentNode.insertBefore(
//           document.createTextNode(after),
//           currentNode.nextSibling
//         );
//       }

//       // currentNode.parentNode.removeChild(currentNode);
//     }

//     range.insertNode(fragment);
//   }
// });
editor.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    currentSelection = selection;
  }
});

editor.addEventListener("mousedown", (e) => {
  const children = editor.childNodes;

  if (children.length > 0 && children[0].nodeName === "#text") {
    const p = document.createElement("p");
    p.textContent = children[0].textContent;
    editor.replaceChild(p, children[0]);

    if (children.length === 1) {
      focusedElement = p;
    } else if (e.target.id !== editor.id) {
      focusedElement = e.target;
    }
  } else if (e.target.id !== editor.id) {
    focusedElement = e.target;
  }
});

headerBtn.addEventListener("click", (e) => {
  if (focusedElement) {
    if (focusedElement.nodeName === "H2") {
      const p = document.createElement("p");
      p.textContent = focusedElement.textContent;
      editor.replaceChild(p, focusedElement);
      focusedElement = p;
    } else {
      const header = document.createElement("h2");
      header.textContent = focusedElement.textContent;
      editor.replaceChild(header, focusedElement);
      focusedElement = header;
    }
  }
});
