export default function loadScript(frame, script) {
    const document = frame.contentWindow.document;
    const scriptTag = document.createElement('script');
    scriptTag.text = script;
    document.documentElement.appendChild(scriptTag);
}