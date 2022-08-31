import {Repository} from '../repository';
import {Action} from '../reducer/actions';
import React, {useEffect, useReducer} from 'react';
import {rootNode, treeReducer} from '../reducer/tree.reducer';
import Node from '../node/node';

interface RootProps {
  repository: Repository;
}

export const Dispatcher = React.createContext<React.Dispatch<Action> | null>(null);

const Root = ({ repository }: RootProps) => {
  const [state, dispatch] = useReducer(treeReducer, rootNode);
  useEffect(() => {
    dispatch({
      type: 'USE_REPO',
      payload: repository,
    });
  }, [repository]);

  return <Dispatcher.Provider value={dispatch}>
    <h3>{ repository.name }</h3>
    { !state.children?.length && <p>This tree is empty.</p> }
    <ol role="tree" aria-label={repository.name}>
      { state.children?.map((node) => <Node key={node.filePath} {...node} />) }
    </ol>
  </Dispatcher.Provider>
}
export default Root;
