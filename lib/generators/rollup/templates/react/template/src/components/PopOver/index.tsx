import React, {FC, useEffect, useRef} from 'react';
import { createPortal } from 'react-dom';

const PopOver: FC = () => {

  const content = useRef(document.createElement('div'))

  useEffect(() => {
    document.body.appendChild(content.current);
    return () => {
      document.body.removeChild(content.current);
    }
  }, [])

  return createPortal(<div>this is popover</div>, content.current);
}

export default PopOver;