
import { CodeChangeType } from "./Types";

export function CodeChanges(EditorRef: any, MonacoRef: any, changes: CodeChangeType & { length?: number }, isRemote: boolean) {
    const editor = EditorRef.current;
    const monaco = MonacoRef.current;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    if (!model) return;

    const startPosition = model.getPositionAt(changes.position);
    const endPosition = model.getPositionAt(
        changes.position + (changes.length || 0)
    )
    const savedPosition = editor.getPosition();
    const savedSelection = editor.getSelection();
    editor.executeEdits("replace-code", [{
        range: new monaco.Range
            (startPosition.lineNumber,
                startPosition.column,
                endPosition.lineNumber,
                endPosition.column,
            ),
        text: changes.type === 'delete' ? "" : changes.content,
        forceMoveMarkers: true,
    }]);

    if (isRemote) {
        model.pushEditOperations([],[{
            range:Range,
            

        }])
    }
}

export function getCodeChanges(EditorRef: any, MonacoRef: any, changes: CodeChangeType) {
    const editor = EditorRef.current;
    const monaco = MonacoRef.current;
    if (!editor || !monaco) return null;

    const position = editor.getPosition();
    const model = editor.getModel();
    const index = model.getOffsetAt(position);
    // CodeChanges(EditorRef, MonacoRef, { type: changes.type, content: changes.content, position: index });
    console.log("Get Code Changes Called", { type: changes.type, content: changes.content, position: index });
    return {
        type: changes.type,
        content: changes.content,
        position: index,
    }
}

