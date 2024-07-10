export function handleMetaKey(e, state, editor) {
  const formatMap = {
    i: true,
    b: true,
  };
  if (e.metaKey && state.metaPressed && formatMap[e.key]) {
    e.preventDefault();
  } else if (e.metaKey) {
    state.metaPressed = true;
  } else {
    console.log(state);
    console.log("meta key not activated");
  }
}
