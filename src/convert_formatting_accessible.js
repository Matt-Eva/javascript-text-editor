export async function convertToAccessibleFormatting(editor) {
  const childNodes = editor.childNodes;
  await recursivelyCheckFormatting(childNodes);
}

async function recursivelyCheckFormatting(nodes) {
  for (const node of nodes) {
    const childNodes = node.childNodes;
    await recursivelyCheckFormatting(childNodes);
    const newChildren = [...node.childNodes];
    const parentNode = node.parentNode;
    if (node.nodeName === "I") {
      const em = document.createElement("em");

      for (const child of newChildren) {
        em.appendChild(child);
      }

      parentNode.replaceChild(em, node);
    } else if (node.nodeName === "B") {
      const strong = document.createElement("strong");

      for (const child of newChildren) {
        strong.appendChild(child);
      }

      parentNode.replaceChild(strong, node);
    }
  }
}
