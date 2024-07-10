export function handleMetaKey(e, state, editor) {
  console.log(e.key);
  console.log(state.metaPressed);
  const formatMap = {
    i: true,
    b: true,
  };
  if (e.metaKey && state.metaPressed && formatMap[e.key]) {
    if (e.key === "i") {
    } else if (e.key === "b") {
    }
  } else if (e.metaKey) {
    state.metaPressed = true;
  } else {
    console.log(state);
    console.log("meta key not activated");
  }
}
