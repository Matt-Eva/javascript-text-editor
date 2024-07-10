import { removeRedundantAdjacentNodes } from "./handle_redundant_nodes.js";
import { convertToAccessibleFormatting } from "./convert_formatting_accessible.js";

export async function handleFormatting(state, editor, style) {
  await convertToAccessibleFormatting(editor);
  if (state.currentSelection && !state.currentSelection.isCollapsed) {
    let anchorNode = state.currentSelection.anchorNode;
    let focusNode = state.currentSelection.focusNode;
    const anchorOffset = state.currentSelection.anchorOffset;
    const focusOffset = state.currentSelection.focusOffset;
    const parentMap = checkSameParentNode(anchorNode, focusNode, editor);

    if (parentMap.sameParent) {
      formatSameParent(
        parentMap,
        anchorNode,
        focusNode,
        anchorOffset,
        focusOffset,
        style
      );
    } else {
      formatSeparateParent();
    }
  }
  removeRedundantAdjacentNodes(editor);
}

function checkSameParentNode(anchorNode, focusNode, editor) {
  let anchorParent = anchorNode;
  let focusParent = focusNode;
  const parentMap = {
    sameParent: false,
    anchorParentFocus: false,
    focusParentAnchor: false,
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

  return parentMap;
}

function formatSameParent(
  parentMap,
  anchorNode,
  focusNode,
  anchorOffset,
  focusOffset,
  style
) {
  console.log(parentMap);
  console.log("anchor node", anchorNode);
  console.log("focus node", focusNode);
  console.log("anchor offset", anchorOffset);
  console.log("focus offset", focusOffset);
  if (anchorNode === focusNode) {
    formatSameNode(anchorNode, focusNode, anchorOffset, focusOffset, style);
  } else if (parentMap.anchorParentFocus) {
    console.log("anchor node is parent node");
  } else if (parentMap.focusParentAnchor) {
    console.log("focus node is parent node");
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

  // const position = anchorNode.compareDocumentPosition(focusNode);
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

function formatSameNode(
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
