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
      endOffset
    );
  } else {
    finalRange = handleMultipleNodes(
      fragmentChildren,
      startContainer,
      startOffset,
      endContainer
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
  endOffset
) {
  const range = new Range();
  range.setStart(startContainer, startOffset);
  const em = document.createElement("em");
  em.textContent = node.textContent;
  range.insertNode(em);

  const finalRange = {
    startContainer: em,
    startOffset: 0,
    endContainer: em,
    endOffset: 1,
  };

  return finalRange;
}

function handleMultipleNodes(
  fragmentChildren,
  startContainer,
  startOffset,
  endContainer
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
    const em = document.createElement("em");

    if (i === 0) {
      range.setStart(startContainer, startOffset);

      em.textContent = fragmentChild.textContent;

      range.insertNode(em);

      finalNodes.startContainer = em;
    } else if (i === fragmentChildren.length - 1) {
      const endOffset = fragmentChild.textContent.length - 1;

      range.setStart(endContainer, 0);
      range.setEnd(endContainer, endOffset);

      em.textContent = fragmentChild.textContent;

      range.insertNode(em);

      finalNodes.endContainer = em;
      finalNodes.endOffset = endOffset;
    } else {
      range.setStart(fragmentChild, 0);
      range.setEnd(fragmentChild, fragmentChild.textContent.length - 1);

      em.textContent = fragmentChild.textContent;

      range.insertNode(em);
    }
  }

  return finalNodes;
}
