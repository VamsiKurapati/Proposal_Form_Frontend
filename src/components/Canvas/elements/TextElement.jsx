import React from 'react';
import { updateTextContent } from '../../../utils/text';

const TextElement = ({ element, isEditing, setIsEditing, updateElement, pageIndex, project }) => {
  const textStyle = {
    fontSize: `${element.properties.fontSize}px`,
    fontFamily: element.properties.fontFamily,
    color: element.properties.color,
    fontWeight: element.properties.bold ? 'bold' : 'normal',
    fontStyle: element.properties.italic ? 'italic' : 'normal',
    textAlign: element.properties.textAlign,
    textDecoration: element.properties.underline ? 'underline' : 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: element.properties.lineHeight || 1.2,
    letterSpacing: (element.properties.letterSpacing || 0) + 'px',
  };

  // Helper to render bullet list
  const renderBulletList = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return (
      <ul style={{
        margin: 0,
        paddingLeft: '1.2em',
        width: '100%',
        color: element.properties.color,
        listStyleType: 'disc',
        listStylePosition: 'inside',
      }}>
        {lines.map((line, idx) => (
          <li key={idx} style={{ textAlign: element.properties.textAlign, color: element.properties.color }}>{line}</li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className="w-full h-full relative"
      style={textStyle}
      onDoubleClick={() => setIsEditing(element.id)}
    >
      {isEditing === element.id ? (
        <textarea
          value={element.properties.text}
          onChange={(e) => updateTextContent(updateElement, project, pageIndex, element.id, e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              return;
            }
            if (e.key === 'Escape') {
              setIsEditing(false);
            }
          }}
          className="w-full h-full resize-none border-none outline-none bg-transparent"
          style={textStyle}
          autoFocus
        />
      ) : (
        element.properties.listStyle === 'bullet' ? (
          <div className="w-full h-full">
            {renderBulletList(element.properties.text)}
          </div>
        ) : (
          <div 
            className="w-full h-full"
            style={textStyle}
            dangerouslySetInnerHTML={{ __html: element.properties.text.replace(/\n/g, '<br>') }}
          />
        )
      )}
    </div>
  );
};

export default TextElement;