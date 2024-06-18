// console.log("hello world!");

const editor = document.getElementById("editor");
let focusedElement;

editor.addEventListener("mousedown", (e) => {
  const children = editor.childNodes;
  console.log(e.target);

  if (children.length > 0 && children[0].nodeName === "#text") {
    const p = document.createElement("p");
    p.textContent = children[0].textContent;
    editor.replaceChild(p, children[0]);

    if (children.length === 1) {
      focusedElement = p;
    } else if (e.target.id !== editor.id) {
      focusedElement = e.target;
    }
  } else if (e.target.id !== editor.id) {
    focusedElement = e.target;
  }

  console.log(focusedElement);
});
