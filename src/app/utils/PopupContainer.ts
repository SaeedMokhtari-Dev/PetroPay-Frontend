export default function popupContainer(node, identifier = null)
{
    let defaultIdentifier = '.popup-ct';

    let nodeIdentifier = identifier ?? defaultIdentifier;

    if (node)
    {
        console.log(nodeIdentifier);

        let item = node.closest(nodeIdentifier);

        return item ?? node.parentNode;
    }

    return document.body;
}