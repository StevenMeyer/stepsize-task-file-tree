import {Repository} from '../repository';
import {Action} from '../reducer/actions';
import React, {useEffect, useMemo, useReducer} from 'react';
import {rootNode, treeReducer} from '../reducer/tree.reducer';
import Node from '../node/node';

interface RootProps {
  /** If no repository is provided, the component will try to load the state from SessionStorage. */
  repository?: Repository;
}

export const Dispatcher = React.createContext<React.Dispatch<Action> | null>(null);

const Root = ({ repository }: RootProps) => {
  const initialState = useMemo(() => {
    const serializedState = sessionStorage.getItem('treeState');
    if (!serializedState) {
      return rootNode;
    }
    return JSON.parse(serializedState);
  }, []);
  const storedRepositoryName = sessionStorage.getItem('repoName') || '';

  const [state, dispatch] = useReducer(treeReducer, initialState);

  useEffect(() => {
    if (repository) {
      dispatch({
        type: 'USE_REPO',
        payload: repository,
      });
    }
  }, [repository]);

  useEffect(() => {
    sessionStorage.setItem('treeState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (repository) {
      sessionStorage.setItem('repoName', repository.name);
    }
  }, [repository]);

  const repositoryName = repository?.name || storedRepositoryName;

  return <Dispatcher.Provider value={dispatch}>
    <h3>{ repositoryName }</h3>
    { !state.children?.length && <p>This tree is empty.</p> }
    <ol role="tree" aria-label={repositoryName}>
      { state.children?.map((node) => <Node key={node.filePath} {...node} />) }
    </ol>
  </Dispatcher.Provider>
}
export default Root;
