import {render, screen} from '@testing-library/react';
import Root from './root';
import {Repository} from '../repository';
import {FileIconsJs, WindowWithIcons} from '../leaf/file-icons-js';

beforeEach(() => {
  (window as WindowWithIcons).icons = {
    getClass: (() => Promise.resolve('icon js-icon medium-yellow')) as unknown as FileIconsJs['getClass'],
  }
});

it('renders a header and a tree root node', async () => {
  render(<Root repository={{ name: 'Empty', filepaths: [] }} />);
  expect(await screen.findByRole('tree', { name: 'Empty' })).toBeInTheDocument();
});

it('should render a tree', async () => {
  const getNamedTreeItem = (accessibleName: string): Promise<HTMLElement> => {
    return screen.findByRole('treeitem', { name: accessibleName });
  };

  const repository: Repository = {
    name: 'My Repo',
    filepaths: [
      'a.md',
      'b/b1.js',
      'b/b2/b2a.html',
      'b/b2/b2b/b2b1/b2b1a.png'
    ],
  };
  render(<Root repository={repository} />);
  expect(await screen.findByRole('tree', { name: 'My Repo' })).toBeInTheDocument();
  expect(await getNamedTreeItem('a.md')).toBeInTheDocument();
  expect(await getNamedTreeItem('b')).toBeInTheDocument();
  expect(await getNamedTreeItem('b1.js')).toBeInTheDocument();
  expect(await getNamedTreeItem('b2')).toBeInTheDocument();
  expect(await getNamedTreeItem('b2a.html')).toBeInTheDocument();
  expect(await getNamedTreeItem('b2b')).toBeInTheDocument();
  expect(await getNamedTreeItem('b2b1')).toBeInTheDocument();
  expect(await getNamedTreeItem('b2b1a.png')).toBeInTheDocument();
});