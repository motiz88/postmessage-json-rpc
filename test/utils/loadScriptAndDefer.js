import loadScript from './loadScript';
import defer from './defer';

export default function loadScriptAndDefer(frame, script, action) {
    loadScript(frame, script);
    return defer(action);
}