export function handleMetaKey(e, state) {
  if (e.metaKey && state.metaPressed) {
    e.preventDefault();
  } else if (e.metaKey) {
    state.metaPressed = true;
  }
}
