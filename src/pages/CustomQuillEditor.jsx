// // // components/CustomQuillEditor.jsx
// // import React, { useRef, useEffect } from "react";
// // import ReactQuill from "react-quill";
// // import Quill from "quill";
// // import "react-quill/dist/quill.snow.css";
// // import "../index.css"; // optional for styling

// // const Size = Quill.import("formats/size");
// // Size.whitelist = [
// //   '8px', '10px', '12px', '14px', '16px', '18px',
// //   '20px', '24px', '28px', '32px', '36px', '48px', '64px', '72px', '96px', '128px'
// // ];
// // Quill.register(Size, true);

// // // Custom Toolbar
// // export const CustomToolbar = () => (
// //   <div id="custom-toolbar" className="border px-2 py-1 bg-white rounded-t flex flex-wrap gap-1">
// //     <select className="ql-header" defaultValue="Paragraph">
// //       <option value="1">Heading 1</option>
// //       <option value="2">Heading 2</option>
// //       <option value="3">Heading 3</option>
// //       <option value="4">Heading 4</option>
// //       <option value="5">Heading 5</option>
// //       <option value="Paragraph">Paragraph</option>
// //     </select>
// //     <select className="ql-size" defaultValue="14px">
// //     <option value="8px">8px</option>
// //     <option value="10px">10px</option>
// //     <option value="12px">12px</option>
// //     <option value="14px">14px</option>
// //     <option value="16px">16px</option>
// //     <option value="18px">18px</option>
// //     <option value="20px">20px</option>
// //     <option value="24px">24px</option>
// //     <option value="28px">28px</option>
// //     <option value="32px">32px</option>
// //     <option value="36px">36px</option>
// //     <option value="48px">48px</option>
// //     <option value="64px">64px</option>
// //     <option value="72px">72px</option>
// //     <option value="96px">96px</option>
// //     <option value="128px">128px</option>
// //     </select>
// //     <button className="ql-color" />
// //     <button className="ql-background" />
// //     <button className="ql-bold" />
// //     <button className="ql-italic" />
// //     <button className="ql-underline" />
// //     <button className="ql-strike" />
// //     <button className="ql-align" value="" />
// //     <button className="ql-align" value="center" />
// //     <button className="ql-align" value="right" />
// //     <button className="ql-align" value="justify" />
// //     <button className="ql-list" value="ordered" />
// //     <button className="ql-list" value="bullet" />
// //     <button className="ql-link" />
// //     <button className="ql-image" />
// //   </div>
// // );

// // const modules = {
// //   toolbar: {
// //     container: "#custom-toolbar"
// //   }
// // };

// // const CustomQuillEditor = ({ value, onChange }) => {
// //   const quillRef = useRef(null);

// //   return (
// //     <>
// //       <CustomToolbar />
// //       <ReactQuill
// //         ref={quillRef}
// //         theme="snow"
// //         value={value}
// //         onChange={onChange}
// //         modules={modules}
// //         formats={[
// //           "header", "size", "bold", "italic", "underline", "strike",
// //           "color", "background", "align", "list", "bullet", "link", "image"
// //         ]}
// //         className="rounded-b"
// //       />
// //     </>
// //   );
// // };

// // export default CustomQuillEditor;


// import React, { useRef } from "react";
// import ReactQuill from "react-quill";
// import Quill from "quill";
// import "react-quill/dist/quill.snow.css";
// import "../index.css"; // for size rendering + labels

// // Register custom pixel sizes
// const Size = Quill.import("formats/size");
// Size.whitelist = [
//   '8px', '10px', '12px', '14px', '16px', '18px', '20px',
//   '24px', '28px', '32px', '36px', '48px', '64px', '72px',
//   '96px', '128px'
// ];
// Quill.register(Size, true);

// // Tailwind-styled toolbar
// export const CustomToolbar = () => (
//   <div id="custom-toolbar" className="border px-2 py-1 bg-white rounded-t flex flex-wrap gap-1">
//     <select className="ql-header" defaultValue="">
//       <option value="">Paragraph</option>
//       <option value="1">Heading 1</option>
//       <option value="2">Heading 2</option>
//       <option value="3">Heading 3</option>
//       <option value="4">Heading 4</option>
//       <option value="5">Heading 5</option>
//     </select>

//     <select className="ql-size" defaultValue="14px">
//       {['8px','10px','12px','14px','16px','18px','20px','24px','28px','32px','36px','48px','64px','72px','96px','128px']
//         .map(size => <option key={size} value={size}>{size}</option>)}
//     </select>

//     <button className="ql-color" />
//     <button className="ql-background" />
//     <button className="ql-bold" />
//     <button className="ql-italic" />
//     <button className="ql-underline" />
//     <button className="ql-strike" />
//     <button className="ql-align" value="" />
//     <button className="ql-align" value="center" />
//     <button className="ql-align" value="right" />
//     <button className="ql-align" value="justify" />
//     <button className="ql-list" value="ordered" />
//     <button className="ql-list" value="bullet" />
//     <button className="ql-link" />
//     <button className="ql-image" />
//   </div>
// );

// const modules = {
//   toolbar: {
//     container: "#custom-toolbar",
//   },
// };

// const formats = [
//   "header", "size", "bold", "italic", "underline", "strike",
//   "color", "background", "align", "list", "bullet", "link", "image"
// ];

// const CustomQuillEditor = ({ value, onChange }) => {
//   const quillRef = useRef(null);

//   return (
//     <>
//       <CustomToolbar />
//       <ReactQuill
//         ref={quillRef}
//         value={value}
//         onChange={onChange}
//         theme="snow"
//         modules={modules}
//         formats={formats}
//         className="rounded-b"
//       />
//     </>
//   );
// };

// export default CustomQuillEditor;

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

