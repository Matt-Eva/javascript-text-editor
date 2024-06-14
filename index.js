// console.log("hello world!");

const editor = document.getElementById("editor");

editor.addEventListener("mousedown", (e) => {
  const children = editor.childNodes;

  if (children.length > 0 && children[0].nodeName === "#text") {
    const p = document.createElement("p");
    p.textContent = children[0].textContent;
    editor.replaceChild(p, children[0]);
  }
});
