import { removeRedundantAdjacentNodes } from "./handle_redundant_nodes.js";
import { convertToAccessibleFormatting } from "./convert_formatting_accessible.js";

export async function handleFormatting(state, editor, style) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const startOffset = range.startOffset;
  const endContainer = range.endContainer;
  const endOffset = range.endOffset;
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

  range.setStart(finalRange.startContainer, 0);
  range.setEnd(finalRange.endContainer, 1);

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
    endContainer: newNode,
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
    endContainer: undefined,
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
      range.setStart(endContainer, 0);

      newNode.textContent = fragmentChild.textContent;

      range.insertNode(newNode);

      finalNodes.endContainer = newNode;
    } else {
      range.setStart(fragmentChild, 0);
      range.setEnd(fragmentChild, fragmentChild.textContent.length - 1);

      newNode.textContent = fragmentChild.textContent;

      range.insertNode(newNode);
    }
  }

  return finalNodes;
}
