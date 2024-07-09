export async function removeRedundantAdjacentNodes(editor) {
  const children = editor.childNodes;
  for (const child of children) {
    console.log(child);
    const nestedChildren = child.childNodes;
    const newChildren = await recursivelyRemoveRedundantNodes(nestedChildren);

    console.log("nestedChildren", nestedChildren);
    console.log("new children", newChildren);
    while (child.hasChildNodes()) {
      child.removeChild(child.firstChild);
    }
    console.log("child nodes", child.childNodes);
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
  };
  const finalNodes = [];
  console.log("nodes", nodes);
  for (const node of nodes) {
    const childNodes = node.childNodes;
    const newChildren = await recursivelyRemoveRedundantNodes(childNodes);
    console.log("new children", newChildren);
    for (const child of childNodes) {
      await node.removeChild(child);
    }
    for (const child of newChildren) {
      await node.appendChild(child);
    }
    console.log("appended children", node.childNodes);
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
  console.log("final nodes", finalNodes);
  return [...finalNodes];
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
