import React, {SyntheticEvent, useMemo, useState} from 'react';
import './App.css';
import emptyRepo from './repos/empty.json';
import regularRepo from './repos/regular.json';
import nestedRepo from './repos/nested.json';
import largeRepo from './repos/large.json';
import Root from './root/root';
import {Repository} from './repository';

const repos = {
  emptyRepo,
  regularRepo,
  nestedRepo,
  largeRepo,
};

function App() {
  const [repoKey, setRepoKey] = useState<keyof typeof repos>('emptyRepo');

  const chosenRepo: Repository = useMemo(() => {
    return repos[repoKey];
  }, [repoKey]);

  const handleSelect = (event: SyntheticEvent): void => {
    setRepoKey((event.target as HTMLSelectElement).value as keyof typeof repos);
  };

  return (
    <div className="App">
      <label>
        Choose a repository
        <select name="repo-selector" onInput={handleSelect}>
          {
            (Object.keys(repos) as Array<keyof typeof repos>).map((key) => {
              return <option key={key} value={key}>{repos[key].name}</option>;
            })
          }
        </select>
      </label>
      <Root repository={chosenRepo} />
    </div>
  );
}

export default App;
