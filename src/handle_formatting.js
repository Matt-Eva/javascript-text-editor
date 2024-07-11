import { removeRedundantAdjacentNodes } from "./handle_redundant_nodes.js";
import { convertToAccessibleFormatting } from "./convert_formatting_accessible.js";

export async function handleFormatting(state, editor, style) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  let startContainer = range.startContainer;
  let startOffset = range.startOffset;
  let endContainer = range.endContainer;
  let endOffset = range.endOffset;
  let finalRange = {};
  const fragment = range.extractContents();
  const fragmentChildren = fragment.childNodes;
  if (fragmentChildren.length === 1) {
    finalRange = handleSameNode(
      fragmentChildren[0],
      startContainer,
      startOffset,
      endContainer,
      endOffset,
      style
    );
  } else {
    finalRange = handleMultipleNodes(
      fragmentChildren,
      startContainer,
      startOffset,
      endContainer,
      style
    );
  }

  startContainer = finalRange.startContainer;
  startOffset = finalRange.startOffset;
  endContainer = finalRange.endContainer;
  endOffset = finalRange.endOffset;

  console.log("endContainer", endContainer);
  range.setStart(startContainer, 0);
  range.setEnd(endContainer, endOffset);
  console.log("final range", range);

  selection.removeAllRanges();
  selection.addRange(range);
}

function handleSameNode(
  node,
  startContainer,
  startOffset,
  endContainer,
  endOffset,
  style
) {
  const range = new Range();
  range.setStart(startContainer, startOffset);
  const newNode = document.createElement(style);
  newNode.textContent = node.textContent;
  range.insertNode(newNode);

  const finalRange = {
    startContainer: newNode,
    startOffset: 0,
    endContainer: newNode,
    endOffset: 1,
  };

  return finalRange;
}

function handleMultipleNodes(
  fragmentChildren,
  startContainer,
  startOffset,
  endContainer,
  style
) {
  const finalNodes = {
    startContainer: undefined,
    startOffset: 0,
    endContainer: undefined,
    endOffset: 0,
  };

  for (let i = 0; i < fragmentChildren.length; i++) {
    const fragmentChild = fragmentChildren[i];
    const range = new Range();
    const newNode = document.createElement(style);

    if (i === 0) {
      range.setStart(startContainer, startOffset);

      newNode.textContent = fragmentChild.textContent;

      range.insertNode(newNode);

      finalNodes.startContainer = newNode;
    } else if (i === fragmentChildren.length - 1) {
      const endOffset = fragmentChild.textContent.length - 1;

      range.setStart(endContainer, 0);
      range.setEnd(endContainer, endOffset);

      newNode.textContent = fragmentChild.textContent;

      range.insertNode(newNode);

      finalNodes.endContainer = newNode;
      finalNodes.endOffset = endOffset;
    } else {
      range.setStart(fragmentChild, 0);
      range.setEnd(fragmentChild, fragmentChild.textContent.length - 1);

      newNode.textContent = fragmentChild.textContent;

      range.insertNode(newNode);
    }
  }

  return finalNodes;
}
