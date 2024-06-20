// console.log("hello world!");

const editor = document.getElementById("editor");
const headerBtn = document.getElementById("headerBtn");
const italicizeBtn = document.getElementById("italicize");
const clickHeader = document.getElementById("clickHeader");

let focusedElement;
let currentSelection;

italicizeBtn.addEventListener("click", () => {
  if (currentSelection) {
    const anchorNode = currentSelection.anchorNode;
    const focusNode = currentSelection.focusNode;
    const range = document.createRange();

    const position = anchorNode.compareDocumentPosition(focusNode);

    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      console.log("focus node preceding anchor node");
      range.setStart(focusNode, currentSelection.focusOffset);
      range.setEnd(anchorNode, currentSelection.anchorOffset);
    } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      console.log("focus node following anchor node");
      range.setStart(anchorNode, currentSelection.anchorOffset);
      range.setEnd(focusNode, currentSelection.focusOffset);
    }

    console.log(anchorNode.nextSibling);

    const fragment = range.extractContents();
    console.log(fragment.children);

    for (const child of fragment.children) {
      const textContent = child.textContent;
      const em = document.createElement("em");
      em.textContent = textContent;
      child.textContent = "";
      child.appendChild(em);
    }

    range.insertNode(fragment);
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
