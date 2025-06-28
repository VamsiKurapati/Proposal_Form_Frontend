import React, { useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import "../index.css";

// Register pixel-based font sizes
const Size = Quill.import("formats/size");
Size.whitelist = [
  '8px', '10px', '12px', '14px', '16px', '18px', '20px',
  '24px', '28px', '32px', '36px', '48px', '64px', '72px', '96px', '128px'
];
Quill.register(Size, true);

const ColorClass = Quill.import('formats/color');
Quill.register('formats/color', ColorClass, true);
Quill.register('formats/background', ColorClass, true);

// Global counter for compact numeric toolbar IDs
let toolbarCounter = 0;

export const CustomToolbar = ({ toolbarId }) => (
  <div id={toolbarId} className="border px-2 py-1 bg-white rounded-t flex flex-wrap gap-1">
    <select className="ql-header" defaultValue="">
      <option value="">Paragraph</option>
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
      <option value="4">Heading 4</option>
      <option value="5">Heading 5</option>
    </select>
    <select className="ql-size" defaultValue="14px">
      {Size.whitelist.map(size => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>
    <button className="ql-color" />
    <button className="ql-background" />
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <button className="ql-align" value="" />
    <button className="ql-align" value="center" />
    <button className="ql-align" value="right" />
    <button className="ql-align" value="justify" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-link" />
    <button className="ql-image" />
  </div>
);

const CustomQuillEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  // Generate numeric-based toolbar ID (e.g., custom-toolbar-1)
  const toolbarId = useMemo(() => {
    toolbarCounter += 1;
    return `custom-toolbar-${toolbarCounter}`;
  }, []);

  const modules = {
    toolbar: {
      container: `#${toolbarId}`,
    },
  };

  const formats = [
    "header", "size", "bold", "italic", "underline", "strike",
    "color", "background", "align", "list", "bullet", "link", "image"
  ];

  return (
    <>
      <CustomToolbar toolbarId={toolbarId} />
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        theme="snow"
        modules={modules}
        formats={formats}
        className="rounded-b"
      />
    </>
  );
};

export default CustomQuillEditor;

