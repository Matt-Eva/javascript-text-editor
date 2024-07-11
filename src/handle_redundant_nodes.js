export async function removeRedundantAdjacentNodes(editor) {
  const children = editor.childNodes;
  console.log(editor.childNodes);
  for (const child of children) {
    console.log("child", child);
    const nestedChildren = child.childNodes;
    console.log("nestedChildren", nestedChildren);
    const newChildren = await recursivelyRemoveRedundantNodes(nestedChildren);

    while (child.hasChildNodes()) {
      await child.removeChild(child.firstChild);
    }

    console.log(newChildren);
    for (const newChild of newChildren) {
      await child.appendChild(newChild);
    }
  }
}

async function recursivelyRemoveRedundantNodes(paramNodes) {
  const nodes = [...paramNodes];
  const matchingNodes = {
    I: "EM",
    EM: "I",
    B: "STRONG",
    STRONG: "B",
  };
  const correctNodes = {
    I: "EM",
    EM: "EM",
    B: "STRONG",
    STRONG: "STRONG",
    U: "U",
  };
  const finalNodes = [];

  for (const node of nodes) {
    const childNodes = node.childNodes;
    const newChildren = await recursivelyRemoveRedundantNodes(childNodes);

    while (node.hasChildNodes()) {
      await node.removeChild(node.firstChild);
    }

    for (const child of newChildren) {
      await node.appendChild(child);
    }

    if (finalNodes.length !== 0) {
      const tail = finalNodes[finalNodes.length - 1];

      if (
        tail.nodeName === node.nodeName ||
        matchingNodes[tail.nodeName] === node.nodeName
      ) {
        if (node.nodeName === "#text") {
          const textContent = tail.textContent + node.textContent;
          const newNode = document.createTextNode(textContent);

          finalNodes.pop();
          finalNodes.push(newNode);
        } else {
          const correctNodeName = correctNodes[node.nodeName];
          const newElement = document.createElement(correctNodeName);
          const newChildren = [...tail.childNodes, ...node.childNodes];
          const cleanedNewChildren = await recursivelyRemoveRedundantNodes(
            newChildren
          );

          for (const child of cleanedNewChildren) {
            await newElement.appendChild(child);
          }

          finalNodes.pop();
          finalNodes.push(newElement);
        }
      } else {
        finalNodes.push(node);
      }
    } else {
      finalNodes.push(node);
    }
  }
  return [...finalNodes];
}
