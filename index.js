import { blockTypes, inlineTypes } from "./element_types.js";
import {
  keyupFocus,
  mousedownFocus,
  setCurrentSelection,
} from "./handle_selection_and_focus.js";
import { makeHeader } from "./make_header.js";
import { replaceFirstTextChild } from "./replace_first_text_child.js";

const editor = document.getElementById("editor");
const headerBtn = document.getElementById("headerBtn");
const italicizeBtn = document.getElementById("italicize");
const boldBtn = document.getElementById("bold");
const underlineBtn = document.getElementById("underline");
const toolbar = document.getElementById("toolbar");

document.addEventListener("DOMContentLoaded", () => {
  const p = document.createElement("P");
  const em = document.createElement("EM");
  em.textContent = headerBtn.textContent + italicizeBtn.textContent;
  p.append(em);
  document.body.append(p);
});

const state = {
  focusedNode: undefined,
  currentSelection: undefined,
};

editor.addEventListener("mouseup", () => setCurrentSelection(state));

editor.addEventListener("keyup", () => keyupFocus(state));

toolbar.addEventListener("mouseenter", () =>
  replaceFirstTextChild(editor, state)
);

editor.addEventListener("mousedown", (e) => {
  mousedownFocus(e, editor, state);
  replaceFirstTextChild(editor, state);
});

headerBtn.addEventListener("click", () => makeHeader(editor, state));

italicizeBtn.addEventListener("click", async () => {
  if (state.currentSelection && !state.currentSelection.isCollapsed) {
    let anchorNode = state.currentSelection.anchorNode;
    let focusNode = state.currentSelection.focusNode;
    const anchorOffset = state.currentSelection.anchorOffset;
    const focusOffset = state.currentSelection.focusOffset;
    const sameParent = checkSameParentNode(anchorNode, focusNode);

    if (sameParent) {
      formatSameParent(anchorNode, focusNode, anchorOffset, focusOffset);
    } else {
      formatSeparateParent();
    }
  }
});

function checkSameParentNode(anchorNode, focusNode) {
  let anchorParent = anchorNode.parentNode;
  let focusParent = focusNode.parentNode;
  while (anchorParent.parentNode !== editor) {
    anchorParent = anchorParent.parentNode;
  }

  while (focusParent.parentNode !== editor) {
    focusParent = focusParent.parentNode;
  }

  return focusParent === anchorParent;
}

function formatSameParent(anchorNode, focusNode, anchorOffset, focusOffset) {
  if (anchorNode === focusNode) {
    formatSameNode(anchorNode, focusNode, anchorOffset, focusOffset);
    return;
  }

  while (
    !anchorNode.nextSibling &&
    anchorNode.parentNode.parentNode !== editor
  ) {
    anchorNode = anchorNode.parentNode;
  }
  while (!focusNode.nextSibling && focusNode.parentNode.parentNode !== editor) {
    focusNode = focusNode.parentNode;
  }

  const position = anchorNode.compareDocumentPosition(focusNode);
  const nodeArray = [];

  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    let node = focusNode;
    while (node !== anchorNode) {
      nodeArray.push(node);
      node = node.nextSibling;
    }
    nodeArray.push(anchorNode);
  } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    let node = anchorNode;
    while (node !== focusNode) {
      nodeArray.push(node);
      node = node.nextSibling;
    }
    nodeArray.push(focusNode);
  }

  for (const node of nodeArray) {
    if (node === focusNode) {
    } else if (node === anchorNode) {
    } else {
    }
  }
}

function formatSameNode(anchorNode, focusNode, anchorOffset, focusOffset) {
  let before = "";
  let selected = "";
  let after = "";
  if (anchorOffset < focusOffset) {
    before = anchorNode.textContent.slice(0, anchorOffset);
    selected = anchorNode.textContent.slice(anchorOffset, focusOffset);
    after = anchorNode.textContent.slice(focusOffset);
  } else {
    before = anchorNode.textContent.slice(0, focusOffset);
    selected = anchorNode.textContent.slice(focusOffset, anchorOffset);
    after = anchorNode.textContent.slice(anchorOffset);
  }

  let beforeNode;
  let afterNode;
  let replaceNode;
  let childNodes;
  let parentNode = anchorNode.parentNode;
  if (parentNode.nodeName === "EM" || parentNode.nodeName === "I") {
    parentNode = parentNode.parentNode;
    beforeNode = document.createElement("em");
    beforeNode.textContent = before;
    afterNode = document.createElement("em");
    afterNode.textContent = after;
    replaceNode = document.createTextNode(selected);
    childNodes = Array.from(parentNode.childNodes);
  } else {
    replaceNode = document.createElement("em");
    replaceNode.textContent = selected;
    beforeNode = document.createTextNode(before);
    afterNode = document.createTextNode(after);
    parentNode = anchorNode.parentNode;
    childNodes = Array.from(parentNode.childNodes);
  }

  for (let i = 0; i < childNodes.length; i++) {
    if (
      childNodes[i] === anchorNode ||
      childNodes[i] === anchorNode.parentNode
    ) {
      const potentialReplaceArray = [beforeNode, replaceNode, afterNode];
      const insertArray = [];
      for (const node of potentialReplaceArray) {
        if (node.textContent !== "") {
          insertArray.push(node);
        }
      }
      const beforeSlice = childNodes.slice(0, i);
      const afterSlice = childNodes.slice(i + 1);
      const newChildNodes = [...beforeSlice, ...insertArray, ...afterSlice];
      parentNode.textContent = "";
      for (const child of newChildNodes) {
        parentNode.appendChild(child);
      }
      break;
    }
  }
}

function formatSeparateParent() {}

function removeRedundantAdjacentNodes() {
  const children = editor.childNodes;
  for (const child of children) {
    console.log(child);
    const nestedChildren = child.childNodes;
    console.log(nestedChildren);
    if (nestedChildren) {
      const newChildren = recursivelyRemoveRedundantNodes(nestedChildren);
      console.log(newChildren);
      child.textContent = "";
      for (const newChild of newChildren) {
        child.appendChild(newChild);
      }
    }
  }
}

// function recursivelyRemoveRedundantNodes(nodes) {
//   const finalNodes = [];
//   for (const node of nodes) {
//     const children = node.childNodes;
//     if (children.length !== 0) {
//       const newChildren = recursivelyRemoveRedundantNodes(children);
//       node.textContent = "";
//       for (const child of newChildren) {
//         node.appendChild(child);
//       }
//     }

//     if (
//       finalNodes.length !== 0 &&
//       node.nodeName === finalNodes[finalNodes.length - 1].nodeName
//     ) {
//       const tail = finalNodes[finalNodes.length - 1];
//       console.log("tail", tail);
//       console.log("node", node);
//       if (node.nodeName === "#text") {
//         console.log("text node");
//         const newNode = document.createTextNode();
//         newNode.textContent = `${node.textContent}${tail.textContent}`;
//         finalNodes[finalNodes.length - 1] = newNode;
//       } else {
//         console.log(tail.nodeName);
//         console.log(node.nodeName);
//         const newNode = document.createElement(node.nodeName);
//         const tailChildren = tail.childNodes;
//         const nodeChildren = node.childNodes;
//         console.log("tailchildren", tailChildren);
//         console.log("nodeChildren", nodeChildren);
//         if (tailChildren && nodeChildren) {
//           for (const child of tailChildren) {
//             newNode.appendChild(child);
//           }
//           for (const child of nodeChildren) {
//             newNode.appendChild(child);
//           }
//           console.log(newNode);
//           finalNodes[finalNodes.length - 1] = newNode;
//         } else if (tailChildren) {
//           continue;
//         } else if (nodeChildren) {
//           finalNodes[finalNodes.length - 1] = node;
//         }
//       }
//     } else if (node.textContent === "") {
//       continue;
//     } else {
//       finalNodes.push(node);
//     }
//   }

//   console.log(finalNodes);
//   for (const node of finalNodes) {
//     console.log(node.textContent);
//   }
//   return [...finalNodes];
// }

//

// italicizeBtn.addEventListener("click", () => {
//   if (currentSelection && !currentSelection.isCollapsed) {
//     const anchorNode = currentSelection.anchorNode;
//     const focusNode = currentSelection.focusNode;
//     console.log(anchorNode.nodeName, focusNode.nodeName);
//     console.log("nextSibling", anchorNode.nextSibling, focusNode.nextSibling);
//     console.log(
//       "previousSibling",
//       anchorNode.previousSibling,
//       focusNode.previousSibling
//     );
//     const focusOffset = currentSelection.focusOffset;
//     const anchorOffset = currentSelection.anchorOffset;
//     const range = document.createRange();

//     if (focusNode === anchorNode) {
//       let node = focusNode;
//       const textContent = node.textContent;
//       let before = "";
//       let modified = "";
//       let after = "";

//       if (focusOffset > anchorOffset) {
//         before = textContent.slice(0, anchorOffset);
//         modified = textContent.slice(anchorOffset, focusOffset);
//         after = textContent.slice(focusOffset);
//       } else {
//         before = textContent.slice(0, focusOffset);
//         modified = textContent.slice(focusOffset, anchorOffset);
//         after = textContent.slice(anchorOffset);
//       }

//       const em = document.createElement("em");
//       em.textContent = modified;
//       const beforeNode = document.createTextNode(before);
//       const afterNode = document.createTextNode(after);

//       while (node.nodeName === "#text") {
//         node = node.parentNode;
//       }

//       node.textContent = "";
//       node.append(beforeNode, em, afterNode);
//     } else {
//       let anchorParent = anchorNode.parentNode;
//       let focusParent = focusNode.parentNode;

//       while (
//         anchorParent !== focusParent &&
//         (anchorParent.parentNode !== editor ||
//           focusParent.parentNode !== editor)
//       ) {
//         if (anchorParent.parentNode !== editor) {
//           anchorParent = anchorParent.parentNode;
//         }

//         if (focusParent.parentNode !== editor) {
//           focusParent = focusParent.parentNode;
//         }
//       }

//       if (anchorParent === focusParent) {
//         // console.log("same parent node");
//       }

//       const position = anchorNode.compareDocumentPosition(focusNode);

//       if (position & Node.DOCUMENT_POSITION_PRECEDING) {
//         // console.log("focus node preceding anchor node");
//         range.setStart(focusNode, focusOffset);
//         range.setEnd(anchorNode, anchorOffset);
//       } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
//         // console.log("focus node following anchor node");
//         range.setStart(anchorNode, anchorOffset);
//         range.setEnd(focusNode, focusOffset);
//       } else if (position & Node.DOCUMENT_POSITION_CONTAINS) {
//         // console.log("focus node contains anchor node");
//       } else if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
//         // console.log("anchor node contains focus node");
//       }

//       let startContainer = range.startContainer;
//       for (let i = 0; i < 100; i++) {
//         startContainer = startContainer.parentNode;
//         if (startContainer.nextSibling) {
//           break;
//         }
//       }

//       let endContainer = range.endContainer;
//       for (let i = 0; i < 100; i++) {
//         endContainer = endContainer.parentNode;
//         if (endContainer.previousSibling) {
//           break;
//         }
//       }

//       let node = startContainer;
//       const nodeArray = [node];

//       for (let i = 0; i < 100; i++) {
//         // console.log(node);
//         node = node.nextSibling;
//         nodeArray.push(node);
//         if (node == endContainer) {
//           break;
//         }
//       }

//       for (let node of nodeArray) {
//         const textContent = node.textContent;
//         const em = document.createElement("em");
//         if (node === startContainer) {
//           const before = textContent.slice(0, range.startOffset);
//           const modified = textContent.slice(range.startOffset);
//           em.textContent = modified;
//           node.textContent = before;
//           node.appendChild(em);
//         } else if (node === endContainer) {
//           const modified = textContent.slice(0, range.endOffset);
//           const after = textContent.slice(range.endOffset);
//           em.textContent = modified;
//           const textNode = document.createTextNode(after);
//           node.textContent = "";
//           node.append(em, textNode);
//         } else {
//           em.textContent = textContent;
//           node.textContent = "";
//           node.appendChild(em);
//         }
//       }
//     }
//   }
// });

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
