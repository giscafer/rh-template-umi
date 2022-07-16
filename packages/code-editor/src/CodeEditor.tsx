import MonacoEditor from 'react-monaco-editor';

function CodeEditor({ code, language = 'json' }: { code: string; language?: string }) {
  /*  const editorWillMount = useCallback((monaco: any) => {
    // TODO
    monaco.languages.json?.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'http://myserver/foo-schema.json',
          schema: {
            type: 'object',
            properties: {
              p1: {
                enum: ['v1', 'v2'],
              },
              p2: {
                $ref: 'http://myserver/bar-schema.json',
              },
            },
          },
        },
        {
          uri: 'http://myserver/bar-schema.json',
          schema: {
            type: 'object',
            properties: {
              q1: {
                enum: ['x1', 'x2'],
              },
            },
          },
        },
      ],
    });
  }, []); */

  return (
    <MonacoEditor
      width={760}
      height={840}
      language={language}
      defaultValue={code}
      // editorWillMount={editorWillMount}
    />
  );
}

export default CodeEditor;
