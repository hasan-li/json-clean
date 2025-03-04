import React, { useState } from 'react';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue }
type JsonArray = Array<JsonValue>

interface TreeNodeProps {
  data: JsonValue;
  level: number;
  isRoot?: boolean;
  nodeKey?: string | null;
  darkMode: boolean;
}

interface JsonTreeViewProps {
  data: string | JsonValue;
  darkMode: boolean;
  showLineNumbers: boolean
}


export const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, darkMode, showLineNumbers }) => {
  if (!data) return null;

  try {
    const jsonData = typeof data === 'string' ? JSON.parse(data) as JsonValue : data;

    const treeContent = (
      <TreeNode
        data={jsonData}
        level={0}
        isRoot={true}
        nodeKey={null}
        darkMode={darkMode}
        lineNumberStart={1}
      />
    );

    return showLineNumbers ? (
      <div className="flex">
        <div className="flex-none w-8 text-right pr-2 text-muted-foreground text-xs">
          {Array.from({ length: countTreeNodes(jsonData) }).map((_, i) => (
            <div key={i} className="h-6">{i + 1}</div>
          ))}
        </div>
        <div className="flex-grow">
          {treeContent}
        </div>
      </div>
    ) : treeContent;
  } catch (err) {
    return <div className="text-destructive font-mono">
      Invalid JSON: {err instanceof Error ? err.message : 'Unknown error'}
    </div>;
  }
};

const countTreeNodes = (data: JsonValue): number => {
  if (data === null || typeof data !== 'object') {
    return 1;
  }

  if (Object.keys(data).length === 0) {
    return 1;
  }

  let count = 1;

  Object.keys(data).forEach(key => {
    count += countTreeNodes((data as JsonObject)[key]);
  });

  count += 1;

  return count;
};

interface TreeNodeProps {
  data: JsonValue;
  level: number;
  isRoot?: boolean;
  nodeKey?: string | null;
  darkMode: boolean;
  lineNumberStart?: number;
}

const TreeNode: React.FC<TreeNodeProps> = (
  { data,
    level,
    isRoot = false,
    nodeKey = null,
    darkMode,
  }) => {
  const [expanded, setExpanded] = useState<boolean>(level < 2 || isRoot);
  const indent = level * 20;

  const toggleExpand = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const textColor = darkMode ? 'text-gray-300' : 'text-gray-700';
  const keyColor = darkMode ? 'text-blue-300' : 'text-blue-600';
  const nullColor = darkMode ? 'text-gray-400' : 'text-gray-500';

  if (data === null) {
    return (
      <div
        className={`flex items-start h-6 ${textColor}`}
        style={{ marginLeft: `${indent}px` }}
      >
        {nodeKey && <span className={`mr-2 ${keyColor}`}>"{nodeKey}":</span>}
        <span className={nullColor}>null</span>
      </div>
    );
  }

  if (typeof data !== 'object') {
    let valueClass = '';
    let displayValue: string = '';

    if (typeof data === 'string') {
      valueClass = darkMode ? 'text-green-300' : 'text-green-600';
      displayValue = `"${data}"`;
    } else if (typeof data === 'number') {
      valueClass = darkMode ? 'text-yellow-300' : 'text-yellow-600';
      displayValue = String(data);
    } else if (typeof data === 'boolean') {
      valueClass = darkMode ? 'text-purple-300' : 'text-purple-600';
      displayValue = String(data);
    } else {
      valueClass = darkMode ? 'text-gray-300' : 'text-gray-600';
      displayValue = String(data);
    }

    return (
      <div
        className={`flex items-start h-6 ${textColor}`}
        style={{ marginLeft: `${indent}px` }}
      >
        {nodeKey && <span className={`mr-2 ${keyColor}`}>"{nodeKey}":</span>}
        <span className={valueClass}>{displayValue}</span>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const isEmpty = Object.keys(data).length === 0;

  if (isEmpty) {
    return (
      <div
        className={`flex items-start h-6 ${textColor}`}
        style={{ marginLeft: `${indent}px` }}
      >
        {nodeKey && <span className={`mr-2 ${keyColor}`}>"{nodeKey}":</span>}
        <span>{isArray ? '[]' : '{}'}</span>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
      <div
        className="cursor-pointer flex items-center h-6"
        onClick={toggleExpand}
        style={{ marginLeft: `${indent}px` }}
      >
        <span className="mr-2">{expanded ? '▼' : '►'}</span>
        {nodeKey && <span className={`mr-2 ${keyColor}`}>"{nodeKey}":</span>}
        <span>{isArray ? '[' : '{'}</span>
        {!expanded && <span>...</span>}
        {!expanded && <span>{isArray ? ']' : '}'}</span>}
      </div>

      {expanded && (
        <div>
          {Object.keys(data).map((key) => (
            <TreeNode
              key={key}
              data={(data as JsonObject)[key]}
              level={level + 1}
              nodeKey={isArray ? null : key}
              darkMode={darkMode}
            />
          ))}
          <div style={{ marginLeft: `${indent}px` }} className="h-6">
            {isArray ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  );
};
