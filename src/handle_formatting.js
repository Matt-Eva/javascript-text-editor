import { removeRedundantAdjacentNodes } from "./handle_redundant_nodes.js";
import { convertToAccessibleFormatting } from "./convert_formatting_accessible.js";

export async function handleFormatting(state, editor, style) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const startOffset = range.startOffset;
  const endContainer = range.endContainer;
  const endOffset = range.endOffset;

  let finalRangeData = {};
  if (startContainer === endContainer) {
    handleSameNode;
  } else {
    finalRangeData = await iterateSiblings(
      startContainer,
      startOffset,
      endContainer,
      endOffset,
      editor,
      style
    );
  }

  // const fragment = range.extractContents();
  // const fragmentChildren = fragment.childNodes;
  // if (fragmentChildren.length === 1) {
  //   finalRange = handleSameNode(
  //     fragmentChildren[0],
  //     startContainer,
  //     startOffset,
  //     endContainer,
  //     endOffset,
  //     style
  //   );
  // } else {
  //   iterateSiblings(startContainer, endContainer, editor, style);
  //   finalRange = handleMultipleNodes(
  //     fragmentChildren,
  //     startContainer,
  //     startOffset,
  //     endContainer,
  //     style
  //   );
  // }
  const finalRange = new Range();

  finalRange.setStart(finalRangeData.startContainer, 0);
  finalRange.setEnd(finalRangeData.endContainer, 1);

  selection.removeAllRanges();
  selection.addRange(finalRange);
}

async function iterateSiblings(
  startContainer,
  startOffset,
  endContainer,
  endOffset,
  editor,
  style
) {
  let startParent = startContainer;
  let endParent = endContainer;

  let whileCounter = 0;
  while (
    !startParent.nextSibling &&
    startParent.parentNode !== editor &&
    whileCounter < 100
  ) {
    startParent = startParent.parentNode;
    whileCounter++;
  }

  whileCounter = 0;
  while (
    !endParent.previousSibling &&
    endParent.parentNode !== editor &&
    whileCounter < 100
  ) {
    endParent = endParent.parentNode;
    whileCounter++;
  }

  let iteratorNode = startParent;
  whileCounter = 0;
  while (iteratorNode.nextSibling !== endParent && whileCounter < 100) {
    iteratorNode = iteratorNode.nextSibling;
    const range = new Range();
    range.setStart(iteratorNode, 0);
    const newNode = document.createElement(style);
    newNode.textContent = iteratorNode.textContent;

    while (iteratorNode.hasChildNodes()) {
      await iteratorNode.removeChild(iteratorNode.firstChild);
    }

    range.insertNode(newNode);
    whileCounter++;
  }
  const immediateStartParent = startContainer.parentNode;
  const newStartElement = document.createElement(style);
  const beforeContent = startContainer.textContent.slice(0, startOffset);
  const beforeNode = document.createTextNode(beforeContent);
  newStartElement.textContent = startContainer.textContent.slice(startOffset);

  while (immediateStartParent.hasChildNodes() && whileCounter < 100) {
    whileCounter++;
    await immediateStartParent.removeChild(immediateStartParent.firstChild);
  }
  await immediateStartParent.appendChild(beforeNode);
  await immediateStartParent.appendChild(newStartElement);

  const immediateEndParent = endContainer.parentNode;
  const newEndElement = document.createElement(style);
  const afterContent = endContainer.textContent.slice(endOffset);
  const afterNode = document.createTextNode(afterContent);
  newEndElement.textContent = endContainer.textContent.slice(0, endOffset);

  whileCounter = 0;
  while (immediateEndParent.hasChildNodes() && whileCounter < 100) {
    await immediateEndParent.removeChild(immediateEndParent.firstChild);
    whileCounter++;
  }

  await immediateEndParent.appendChild(newEndElement);
  await immediateEndParent.appendChild(afterNode);

  return {
    startContainer: newStartElement,
    endContainer: newEndElement,
  };
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
    console.log("fragment children", fragmentChildren);
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
    }
  }

  // for (let i = 0; i < fragmentChildren.length; i++) {
  //   const fragmentChild = fragmentChildren[i];
  //   const range = new Range();
  //   const newNode = document.createElement(style);
  //   if (i !== 0 && i !== fragmentChildren.length - 1) {
  //     console.log("middle child", fragmentChild);
  //     range.setStart(finalNodes.endContainer, 0);

  //     newNode.textContent = fragmentChild.textContent;

  //     range.insertNode(newNode);

  //     console.log("middle child range", range);
  //   }
  // }

  return finalNodes;
}
