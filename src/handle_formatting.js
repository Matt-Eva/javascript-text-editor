import { removeRedundantAdjacentNodes } from "./handle_redundant_nodes.js";
import { convertToAccessibleFormatting } from "./convert_formatting_accessible.js";

export async function handleFormatting(state, editor, style) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const newNodeOne = document.createElement("span");
  const newNodeTwo = document.createElement("span");
  const fragment = range.extractContents();
  newNodeOne.textContent = "Hello";
  newNodeTwo.textContent = "World!";
  range.insertNode(newNodeTwo);
  range.insertNode(newNodeOne);
  selection.removeAllRanges();
  selection.addRange(range);
  // console.log("start container", range.startContainer);
  // console.log("end container", range.endContainer);
  // const fragment = range.extractContents();
  // if (range.commonAncestorContainer !== editor) {
  //   const newNode = document.createElement("span");
  // } else {
  // }

  // console.log(fragment);
}

// export async function handleFormatting(state, editor, style) {
//   const selection = window.getSelection();
//   const range = selection.getRangeAt(0);

//   // Step 2: Apply formatting
//   const formattedContent = document.createElement(style);
//   range.surroundContents(formattedContent);

//   // Step 3: Restore the selection
//   selection.removeAllRanges();
//   selection.addRange(range);
//   editor.focus();
// }

// export async function handleFormatting(state, editor, style) {
//   // await convertToAccessibleFormatting(editor);
//   if (state.currentSelection && !state.currentSelection.isCollapsed) {
//     let anchorNode = state.currentSelection.anchorNode;
//     let focusNode = state.currentSelection.focusNode;
//     const anchorOffset = state.currentSelection.anchorOffset;
//     const focusOffset = state.currentSelection.focusOffset;
//     console.log("range count", state.currentSelection.rangeCount);
//     const range = state.currentSelection.getRangeAt(0);
//     console.log(range);
//     console.log("cloned range", range.cloneContents());
//     console.log("focus length", focusNode.length);

//     const parentMap = checkSameParentNode(anchorNode, focusNode, editor);

//     if (parentMap.sameParent) {
//       formatSameParent(
//         state,
//         editor,
//         parentMap,
//         anchorNode,
//         focusNode,
//         anchorOffset,
//         focusOffset,
//         style
//       );
//     } else {
//       formatSeparateParent();
//     }
//     // await removeRedundantAdjacentNodes(editor);
//     range.setStartBefore(parentMap.anchorParent.firstChild);
//     range.setStartAfter(parentMap.focusParent.lastChild);
//     const selection = window.getSelection();
//     selection.removeAllRanges();
//     selection.addRange(range);
//   }
// }

function checkSameParentNode(anchorNode, focusNode, editor) {
  let anchorParent = anchorNode;
  let focusParent = focusNode;
  const parentMap = {
    sameParent: false,
    anchorParentFocus: false,
    focusParentAnchor: false,
    focusParent: undefined,
    anchorParent: undefined,
  };

  while (anchorParent !== editor && anchorParent.parentNode !== editor) {
    anchorParent = anchorParent.parentNode;
  }

  while (focusParent !== editor && focusParent.parentNode !== editor) {
    focusParent = focusParent.parentNode;
  }

  parentMap.sameParent = focusParent === anchorParent;
  parentMap.anchorParentFocus = anchorNode === focusParent;
  parentMap.focusParentAnchor = focusNode === anchorParent;
  parentMap.focusParent = focusParent;
  parentMap.anchorParent = anchorParent;

  return parentMap;
}

function formatSameParent(
  state,
  editor,
  parentMap,
  anchorNode,
  focusNode,
  anchorOffset,
  focusOffset,
  style
) {
  console.log("parent map", parentMap);
  console.log("anchor node", anchorNode);
  console.log("focus node", focusNode);
  console.log("anchor offset", anchorOffset);
  console.log("focus offset", focusOffset);
  if (anchorNode === focusNode) {
    formatSameNode(
      state,
      anchorNode,
      focusNode,
      anchorOffset,
      focusOffset,
      style
    );
    return;
  }

  const position = anchorNode.compareDocumentPosition(focusNode);

  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    // focus node precedes anchor node
    formatSameParentFocusPreceding(
      editor,
      parentMap.parent,
      anchorNode,
      focusNode,
      anchorOffset,
      focusOffset,
      style
    );
  } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    // focus node follows anchor node
    formatSameParentAnchorPreceding(
      anchorNode,
      focusNode,
      anchorOffset,
      focusOffset,
      style
    );
  }

  // while (
  //   !anchorNode.nextSibling &&
  //   anchorNode.parentNode.parentNode !== editor
  // ) {
  //   anchorNode = anchorNode.parentNode;
  // }
  // while (!focusNode.nextSibling && focusNode.parentNode.parentNode !== editor) {
  //   focusNode = focusNode.parentNode;
  // }

  // const nodeArray = [];

  // if (position & Node.DOCUMENT_POSITION_PRECEDING) {
  //   let node = focusNode;
  //   while (node !== anchorNode) {
  //     nodeArray.push(node);
  //     node = node.nextSibling;
  //   }
  //   nodeArray.push(anchorNode);
  // } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
  //   let node = anchorNode;
  //   while (node !== focusNode) {
  //     nodeArray.push(node);
  //     node = node.nextSibling;
  //   }
  //   nodeArray.push(focusNode);
  // }

  // for (const node of nodeArray) {
  //   if (node === focusNode) {
  //   } else if (node === anchorNode) {
  //   } else {
  //   }
  // }
}

async function formatSameNode(
  state,
  anchorNode,
  focusNode,
  anchorOffset,
  focusOffset,
  style
) {
  const styleMap = {
    B: "STRONG",
    STRONG: "STRONG",
    I: "EM",
    EM: "EM",
    U: "U",
  };

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

  if (
    styleMap[parentNode.nodeName] &&
    styleMap[parentNode.nodeName] === style
  ) {
    parentNode = parentNode.parentNode;
    beforeNode = document.createElement(style);
    beforeNode.textContent = before;
    afterNode = document.createElement(style);
    afterNode.textContent = after;
    replaceNode = document.createTextNode(selected);
    childNodes = Array.from(parentNode.childNodes);
  } else {
    replaceNode = document.createElement(style);
    replaceNode.textContent = selected;
    beforeNode = document.createTextNode(before);
    afterNode = document.createTextNode(after);
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
        await parentNode.appendChild(child);
      }
      break;
    }
  }
  state.currentSelection.setBaseAndExtent(
    replaceNode,
    replaceNode.length,
    replaceNode,
    replaceNode.length
  );
}

function formatSameParentFocusPreceding(
  editor,
  parent,
  anchorNode,
  focusNode,
  anchorOffset,
  focusOffset,
  style
) {
  const focusBefore = focusNode.textContent.slice(0, focusOffset);
  const focusSelect = focusNode.textContent.slice(focusOffset);
  const focusBeforeNode = document.createTextNode(focusBefore);
  const focusSelectNode = document.createTextNode(focusSelect);
  let focusParent = focusNode;
  let anchorParent = anchorNode;

  while (
    !focusParent.nextSibling &&
    focusParent.parentNode.parentNode !== editor
  ) {
    focusParent = focusParent.parentNode;
  }

  while (
    !anchorParent.previousSibling &&
    anchorParent.parentNode.parentNode !== editor
  ) {
    anchorParent = anchorParent.parentNode;
  }
  console.log("focusParent", focusParent);
  console.log("anchorParent", anchorParent);
}

function formatSameParentAnchorPreceding(
  anchorNode,
  focusNode,
  anchorOffset,
  focusOffset,
  style
) {
  console.log("anchor node precedes focus node");
}

function formatSeparateParent() {}

// === Potentially deprecated now that meta keys are disabled ===
// function formatFocusParentAnchor(
//   anchorNode,
//   focusNode,
//   anchorOffset,
//   focusOffset,
//   style
// ) {
//   if (focusOffset === 0) {
//     console.log("focusOffset 0");
//     const affectedAnchorText = anchorNode.textContent.slice(0, anchorOffset);
//     const unaffectedAnchorText = anchorNode.textContent.slice(anchorOffset);
//     const affectedAnchorNode = document.createTextNode(affectedAnchorText);
//     const unaffectedAnchorNode = documen.createTextNode(unaffectedAnchorText);
//     console.log("affected anchor text", affectedAnchorText);
//     const children = [...focusNode.childNodes];

//     let affected = true;
//     const affectedChildren = [];
//     const unaffectedChildren = [];

//     for (const child of children) {
//       if (affected) {
//         if (child === anchorNode) {
//           affectedChildren.push(affectedAnchorNode);
//           unaffectedChildren.push(unaffectedAnchorNode);
//           affected = false;
//         } else {
//           affectedChildren.push(child);
//         }
//       } else {
//         unaffectedChildren.push(child);
//       }
//     }

//     console.log("affected children", affectedChildren);
//     console.log("unaffected children", unaffectedChildren);
//     const newElement = document.createElement(style);
//   } else {
//   }
// }
