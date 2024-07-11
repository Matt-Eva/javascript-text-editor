import { removeRedundantAdjacentNodes } from "./handle_redundant_nodes.js";
import { convertToAccessibleFormatting } from "./convert_formatting_accessible.js";

export async function handleFormatting(state, editor, style) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  let startContainer = range.startContainer;
  let startOffset = range.startOffset;
  let endContainer = range.endContainer;
  let endOffset = range.endOffset;
  const fragment = range.extractContents();
  const fragmentChildren = fragment.childNodes;
  if (fragmentChildren.length === 1) {
    const finalRange = handleSameNode(
      fragmentChildren[0],
      startContainer,
      startOffset,
      endContainer,
      endOffset
    );
    startContainer = finalRange.startContainer;
    startOffset = finalRange.startOffset;
    endContainer = finalRange.endContainer;
    endOffset = finalRange.endOffset;
  } else {
    console.log("fragment children", fragment.childNodes);
    for (let i = 0; i < fragmentChildren.length; i++) {
      const fragmentChild = fragmentChildren[i];
      console.log("fragmentChild", fragmentChild);
      const range = new Range();
      const em = document.createElement("em");
      if (i === 0) {
        range.setStart(startContainer, startOffset);
        em.textContent = fragmentChild.textContent;
        range.insertNode(em);
        startContainer = em;
      } else if (i === fragmentChildren.length - 1) {
        console.log("fragment child length", fragmentChild.length);
        endOffset = fragmentChild.textContent.length - 1;
        range.setStart(endContainer, 0);
        range.setEnd(endContainer, endOffset);
        em.textContent = fragmentChild.textContent;
        range.insertNode(em);
        endContainer = em;
      } else {
      }
    }
  }
  // console.log("range children", rangeChildren);

  // while (rangeChildren.length !== 0) {
  //   const lastNode = rangeChildren.pop();
  //   range.insertNode(lastNode);
  // }
  // console.log("start container parent", range.startContainer);
  // console.log("end container parent", range.endContainer);
  console.log("endContainer", endContainer);
  range.setStart(startContainer, 0);
  range.setEnd(endContainer, endOffset);
  console.log("final range", range);

  selection.removeAllRanges();
  selection.addRange(range);
  // const fragment = range.extractContents();
  // if (range.commonAncestorContainer !== editor) {
  //   const newNode = document.createElement("span");
  // } else {
  // }

  // console.log(fragment);
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
