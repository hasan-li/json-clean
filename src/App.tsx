import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import { X, ListOrdered, Sun, Moon, Copy, CheckCheck, Code, ListTree } from 'lucide-react';

import { JsonTreeView } from '@/JsonTreeView'

// type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
// interface JsonObject { [key: string]: JsonValue }
// type JsonArray = Array<JsonValue>

const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>('');
  const [outputJson, setOutputJson] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>('formatted');

  const INDENT_SIZE = 2;

  useEffect(() => {
    formatJson();
  }, [inputJson]);

  const formatJson = (): void => {
    if (!inputJson.trim()) {
      setOutputJson('');
      setError('');
      return;
    }

    try {
      const parsedJson = JSON.parse(inputJson);
      const formattedJson = JSON.stringify(parsedJson, null, INDENT_SIZE);

      setOutputJson(formattedJson);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(`Invalid JSON: ${err.message}`);
      } else {
        setError('Invalid JSON: Unknown error');
      }
      setOutputJson('');
    }
  };

  const handleCopy = (): void => {
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = (): void => {
    setInputJson('');
    setOutputJson('');
    setError('');
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <Card className="min-h-screen rounded-none border-0 px-4">
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle>JSON Formatter & Validator</CardTitle>
          <div className="flex items-center gap-2">
            <Toggle
              variant={darkMode ? "default" : "outline"}
              pressed={darkMode}
              aria-label="Toggle theme"
              onClick={() => setDarkMode(!darkMode)}
              className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800 border-gray-300"}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </Toggle>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <table style={
            { width: '100%',
              height: 'calc(100vh - 110px)',
              tableLayout: 'fixed',
              borderCollapse: 'separate',
              borderSpacing: '0 0'
            }
          }>
            <tbody>
            <tr>
              <td style={{width: '49%', verticalAlign: 'top', padding: 0}}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Input</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleClear}
                    className="h-7 w-7 border-gray-400 text-gray-500"
                    aria-label="Clear input"
                  >
                    <X size={14}/>
                  </Button>
                </div>
                <Textarea
                  className="font-mono resize-none rounded-md"
                  style={{
                    height: 'calc(100vh - 160px)',
                    width: '100%',
                    color: darkMode ? 'white' : 'black'
                  }}
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  placeholder="Paste your JSON here..."
                />
              </td>

              <td style={{width: '2%', verticalAlign: 'top', padding: '0 10px'}}>
                <Separator orientation="vertical" className="h-full mx-auto"/>
              </td>

              <td style={{width: '49%', verticalAlign: 'top', padding: 0}}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Output</span>
                  <div className="flex items-center">
                    <ToggleGroup
                      type="single"
                      value={viewMode}
                      className="border border-gray-200 rounded-md mr-2"
                    >
                      <ToggleGroupItem value="formatted" onClick={() => setViewMode('formatted')}
                                       aria-label="Formatted view" className="h-7 w-7 p-0">
                        <Code size={14}/>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="tree" onClick={() => setViewMode('tree')} aria-label="Tree view"
                                       className="h-7 w-7 p-0">
                        <ListTree size={14}/>
                      </ToggleGroupItem>
                    </ToggleGroup>

                    <Toggle
                      variant={showLineNumbers ? "default" : "outline"}
                      aria-label="Line numbers"
                      pressed={showLineNumbers}
                      onClick={() => setShowLineNumbers(!showLineNumbers)}
                      className="h-7 w-7 mr-2"
                    >
                      <ListOrdered size={14}/>
                    </Toggle>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopy}
                      disabled={!outputJson}
                      aria-label="Copy to clipboard"
                      className="h-7 w-7"
                    >
                      {copied ? <CheckCheck size={14}/> : <Copy size={14}/>}
                    </Button>
                  </div>
                </div>

                {error ? (
                  <div
                    className="bg-destructive/10 text-destructive p-4 rounded-md font-mono overflow-auto border border-destructive"
                    style={{height: 'calc(100vh - 160px)', width: '100%'}}
                  >
                    {error}
                  </div>
                ) : (
                  <div
                    className="font-mono overflow-auto rounded-md border p-4"
                    style={{height: 'calc(100vh - 160px)', width: '100%'}}
                  >
                    {viewMode === 'formatted' ? (
                      <pre className="m-0">
                        {showLineNumbers && outputJson ? (
                          outputJson.split('\n').map((line, index) => (
                            <div key={index}>
                                    <span
                                      className="w-8 text-right pr-2 select-none inline-block text-muted-foreground text-xs">
                                        {index + 1}
                                    </span>
                              <span>{line}</span>
                            </div>
                          ))
                        ) : (
                          outputJson
                        )}
                    </pre>
                    ) : (
                      <JsonTreeView data={outputJson} darkMode={darkMode} showLineNumbers={showLineNumbers}/>
                    )}
                  </div>
                )}
              </td>
            </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonFormatter;
