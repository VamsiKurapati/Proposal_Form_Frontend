import React from 'react';
import GridTextElement from './elements/GridTextElement';
import ImageElement from './elements/ImageElement';
import ShapeElement from './elements/ShapeElement';
import SVGElement from './elements/SVGElement';

const GridElementRenderer = ({ element, pageIndex, project }) => {
  switch (element.type) {
    case 'text':
      return (
        <GridTextElement
          element={element}
        />
      );
    case 'image':
      return <ImageElement element={element} />;
    case 'shape':
      return <ShapeElement element={element} />;
    case 'svg':
      return <SVGElement element={element} />;
    default:
      return null;
  }
};

export default GridElementRenderer; 