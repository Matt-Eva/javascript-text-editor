export function keyupFocus(state) {
  const selection = window.getSelection();
  const anchorNode = selection.anchorNode;
  state.focusedNode = anchorNode;
}

export function mousedownFocus(event, editor, state) {
  if (event.target !== editor) {
    state.focusedNode = event.target;
  }
}

export function setCurrentSelection(state) {
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    state.currentSelection = selection;
  }
}
