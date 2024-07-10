export async function convertToAccessibleFormatting(editor) {
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
