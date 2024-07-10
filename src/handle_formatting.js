import { removeRedundantAdjacentNodes } from "./handle_redundant_nodes.js";

export async function handleFormatting(state, editor, style) {
  await convertToAccessibleFormatting(editor);
  if (state.currentSelection && !state.currentSelection.isCollapsed) {
    let anchorNode = state.currentSelection.anchorNode;
    let focusNode = state.currentSelection.focusNode;
    const anchorOffset = state.currentSelection.anchorOffset;
    const focusOffset = state.currentSelection.focusOffset;
    const sameParent = checkSameParentNode(anchorNode, focusNode, editor);

    if (sameParent) {
      formatSameParent(anchorNode, focusNode, anchorOffset, focusOffset);
    } else {
      formatSeparateParent();
    }
  }
  removeRedundantAdjacentNodes(editor);
}

async function convertToAccessibleFormatting(editor) {
  const childNodes = editor.childNodes;
  await recursivelyCheckFormatting(childNodes);
}

async function recursivelyCheckFormatting(nodes) {
  for (const node of nodes) {
    console.log(node);
    const childNodes = node.childNodes;
    await recursivelyCheckFormatting(childNodes);
    const newChildren = [...node.childNodes];
    const parentNode = node.parentNode;
    if (node.nodeName === "I") {
      console.log("node is italic");
      const em = document.createElement("em");

      for (const child of newChildren) {
        em.appendChild(child);
      }

      parentNode.replaceChild(em, node);
    } else if (node.nodeName === "B") {
      console.log("node is bold");
      const strong = document.createElement("strong");

      for (const child of newChildren) {
        strong.appendChild(child);
      }

      parentNode.replaceChild(strong, node);
    }
  }
}

function checkSameParentNode(anchorNode, focusNode, editor) {
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
  console.log(anchorNode, focusNode);
  if (anchorNode === focusNode) {
    formatSameNode(anchorNode, focusNode, anchorOffset, focusOffset);
    return;
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
