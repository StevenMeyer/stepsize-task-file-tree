import {useEffect, useState} from 'react';
import {WindowWithIcons} from './file-icons-js';
import './leaf.css';

interface LeafProps {
  fileName: string;
  expanded?: boolean;
  hasChildren?: boolean;
}

/**
 * A presentation component to show the file name and the icon.
 *
 * It could be used anywhere in the tree, not only in leaf nodes.
 * @param filename - the file name and extension; not the whole path
 * @constructor
 */
const Leaf = ({ fileName, expanded, hasChildren }: LeafProps) => {
  const [iconClassNames, setIconClassNames] = useState('');

  useEffect(() => {
    // TODO appending this "/" doesn't seem to choose a folder icon. Does the icons project even have a folder icon?
    (window as WindowWithIcons).icons.getClass(hasChildren ? `${fileName}/` : fileName, {
      array: false,
      color: true,
    }).then((classNames) => {
      setIconClassNames(classNames);
    });
  }, [fileName, hasChildren]);

  const folderClassName = hasChildren ? `node-leaf--${expanded ? 'expanded' : 'collapsed'}` : '';

  return (
    <div className={`node-leaf ${folderClassName}`}>
      <span
        className={`node-leaf__icon ${iconClassNames}`}
        role="presentation"
      />
      <span className="node-leaf__file-name">{fileName}</span>
    </div>
  );
}
export default Leaf;