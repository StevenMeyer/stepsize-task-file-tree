import Leaf from '../leaf/leaf';
import React, {SyntheticEvent, useCallback, useContext, useState} from 'react';
import {Action} from '../reducer/actions';
import {Dispatcher} from '../root/root';
import './node.css';
import {TreeNode} from '../tree-node';

const Node = ({ fileName, filePath, children, level, groupPosition, groupSize, expanded }: TreeNode) => {
  const dispatch = useContext(Dispatcher)!;
  const [selected, setSelected] = useState(false);

  // we don't bother with an aria-expanded prop if there are no children
  const ariaExpanded = children?.length ? expanded : undefined;

  const toggleExpanded = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
    const type = expanded ? 'COLLAPSE' : 'EXPAND';
    const action: Action = {
      type,
      payload: {
        filePath,
      },
    };
    dispatch(action);
  }, [dispatch, expanded, filePath]);

  return (
    <li
      className="node"
      role="treeitem"
      aria-label={fileName}
      aria-expanded={ariaExpanded}
      aria-selected={selected}
      aria-level={level}
      aria-setsize={groupSize}
      aria-posinset={groupPosition}
      tabIndex={-1}
      onClick={toggleExpanded}
    >
      <Leaf fileName={fileName} expanded={ariaExpanded} hasChildren={(children?.length || 0) > 0} />
      { children?.length && (
        <ol className="node__children" role="group">
          { children.map((node) =>
            <Node key={node.filePath} {...node} />
          ) }
        </ol>
      )}
    </li>
  );
};
export default Node;