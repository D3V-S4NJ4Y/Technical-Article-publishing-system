import React, { useRef, useState } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const editorRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertText = (text) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    updateContent();
  };

  const toolbarButtons = [
    { command: 'bold', icon: 'B', title: 'Bold' },
    { command: 'italic', icon: 'I', title: 'Italic' },
    { command: 'underline', icon: 'U', title: 'Underline' },
    { command: 'strikeThrough', icon: 'S', title: 'Strikethrough' },
    { type: 'separator' },
    { command: 'formatBlock', value: 'h1', icon: 'H1', title: 'Heading 1' },
    { command: 'formatBlock', value: 'h2', icon: 'H2', title: 'Heading 2' },
    { command: 'formatBlock', value: 'h3', icon: 'H3', title: 'Heading 3' },
    { type: 'separator' },
    { command: 'insertUnorderedList', icon: '•', title: 'Bullet List' },
    { command: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
    { type: 'separator' },
    { command: 'justifyLeft', icon: '⬅', title: 'Align Left' },
    { command: 'justifyCenter', icon: '⬌', title: 'Align Center' },
    { command: 'justifyRight', icon: '➡', title: 'Align Right' },
    { type: 'separator' },
    { command: 'createLink', icon: '🔗', title: 'Insert Link' },
    { command: 'insertImage', icon: '🖼', title: 'Insert Image' },
    { type: 'separator' },
    { command: 'removeFormat', icon: '🧹', title: 'Clear Formatting' }
  ];

  const handleCommand = (button) => {
    if (button.command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) formatText('createLink', url);
    } else if (button.command === 'insertImage') {
      const url = prompt('Enter image URL:');
      if (url) formatText('insertImage', url);
    } else {
      formatText(button.command, button.value);
    }
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter code:');
    if (code) {
      const codeElement = `<pre style="background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto;"><code>${code}</code></pre>`;
      document.execCommand('insertHTML', false, codeElement);
      updateContent();
    }
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let table = '<table style="border-collapse: collapse; width: 100%; margin: 16px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="border: 1px solid #ddd; padding: 8px;">Cell</td>';
        }
        table += '</tr>';
      }
      table += '</table>';
      document.execCommand('insertHTML', false, table);
      updateContent();
    }
  };

  return (
    <div className="rich-editor">
      <div className="editor-toolbar">
        {toolbarButtons.map((button, index) => (
          button.type === 'separator' ? (
            <div key={index} className="toolbar-separator" />
          ) : (
            <button
              key={index}
              type="button"
              className="toolbar-btn"
              onClick={() => handleCommand(button)}
              title={button.title}
            >
              {button.icon}
            </button>
          )
        ))}
        
        <div className="toolbar-separator" />
        <button
          type="button"
          className="toolbar-btn"
          onClick={insertCodeBlock}
          title="Insert Code Block"
        >
          &lt;/&gt;
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={insertTable}
          title="Insert Table"
        >
          ⊞
        </button>
        
        <div className="toolbar-separator" />
        <button
          type="button"
          className={`toolbar-btn ${isPreview ? 'active' : ''}`}
          onClick={() => setIsPreview(!isPreview)}
          title="Toggle Preview"
        >
          👁
        </button>
      </div>

      {isPreview ? (
        <div className="editor-preview">
          <div 
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      ) : (
        <div
          ref={editorRef}
          className="editor-content"
          contentEditable
          onInput={updateContent}
          onBlur={updateContent}
          dangerouslySetInnerHTML={{ __html: value }}
          style={{ minHeight: '300px' }}
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default RichTextEditor;