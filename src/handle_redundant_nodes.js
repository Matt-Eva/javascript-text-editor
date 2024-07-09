export function removeRedundantAdjacentNodes(editor) {
  const children = editor.childNodes;
  for (const child of children) {
    console.log(child);
    const nestedChildren = child.childNodes;
    if (nestedChildren) {
      const newChildren = recursivelyRemoveRedundantNodes(nestedChildren);
      // console.log(newChildren);
      // child.textContent = "";
      // for (const newChild of newChildren) {
      //   child.appendChild(newChild);
      // }
    }
  }
}

function recursivelyRemoveRedundantNodes(nodes) {
  const finalNodes = [];
  console.log("nodes", nodes);
  for (const node of nodes) {
    const childNodes = node.childNodes;
    const newChildren = recursivelyRemoveRedundantNodes(childNodes);
    console.log("new children", newChildren);
    for (const child of childNodes) {
      node.removeChild(child);
    }
    for (const child of newChildren) {
      node.appendChild(child);
    }
    console.log("appended children", node.childNodes);
    if (finalNodes.length !== 0) {
      const tail = finalNodes[finalNodes.length - 1];
      if (tail.nodeName === node.nodeName) {
        if (node.nodeName === "#text") {
          const textContent = tail.textContent + node.textContent;
          const newNode = document.createTextNode(textContent);
          finalNodes.pop();
          finalNodes.push(newNode);
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
