# JavaScript Text Editor

This is a custom built text editor made with JavaScript that outputs JSON.

It uses a `contenteditable` HTML element as the wrapper.

Features include making headers, italicizing, bolding, and underlining text, centering and indenting text, inserting links and images, and creating blockquotes.

## Feature Map

- Things we need to account for

[x]Turn First Text Node Into Paragraph
[x]Apply Header Styling
[x]Preserve Formatting Across Header Changes

- Applying formatting across multiple paragraphs
- Applying formatting within the same paragraph
- Applying multiple formats at once
- Applying multiple formats across formatting boundaries
- Deselecting formatting across multiple paragraphs
- Deselecting formatting within the same paragraph
- Deselecting formatting within other formatting
- Deselecting formatting across formatting boundaries

## Applying multiple formats across formatting boundaries

Either the focusNode or the anchorNode will be a text node within another
styling node.

We will want to find the most immediate parent node that is not a text node.

This will be the node in which the starting / ending offset is calculated.

We need to check if there are intermediary nodes between these nodes. (i.e. a `<u>` with some content that is then `<strong>`, but not for full portion of `<u>`.)

We will need to check to see if the anchor or focus node has a nextSibling or previousSibling.

We also need to account for whether or not the current portion of the focus or anchor node already has the existing styling being applied.
