import {fireEvent, render, screen} from '@testing-library/react';
import Node, {TreeNode} from '../node/node';
import {useReducer} from 'react';
import {treeReducer} from '../reducer/tree.reducer';
import {Dispatcher} from '../root/root';
import {FileIconsJs, WindowWithIcons} from '../leaf/file-icons-js';

beforeEach(() => {
  (window as WindowWithIcons).icons = {
    getClass: (() => Promise.resolve('icon js-icon medium-yellow')) as unknown as FileIconsJs['getClass'],
  }
})

it('renders a leaf', async () => {
  const node: TreeNode = {
    fileName: 'awesome-file.txt',
    filePath: 'awesome-file.txt',
    children: [],
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: false,
  };
  render(<Node {...node} />);
  const leaf = await screen.findByRole('treeitem');
  expect(leaf).toBeInTheDocument();
  expect(leaf.getAttribute('aria-expanded')).toBeNull();
  expect(leaf.getAttribute('aria-selected')).toEqual('false');
  expect(leaf.getAttribute('aria-level')).toEqual('1');
  expect(leaf.getAttribute('aria-setsize')).toEqual('1');
  expect(leaf.getAttribute('aria-posinset')).toEqual('1');
});

it('renders a node with children', async () => {
  const node: TreeNode = {
    fileName: 'parent',
    filePath: 'parent',
    children: [
      {
        fileName: 'me.md',
        filePath: 'parent/me.md',
        level: 2,
        groupSize: 2,
        groupPosition: 1,
        expanded: false,
      },
      {
        fileName: 'sibling.json',
        filePath: 'parent/sibling.json',
        level: 2,
        groupSize: 2,
        groupPosition: 2,
        expanded: false,
      }
    ],
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: false,
  };
  render(<Node {...node} />);
  const parent = await screen.findByRole('treeitem', {
    expanded: false,
    selected: false,
    name: 'parent'
  });
  expect(parent).toBeInTheDocument();
  expect(parent.getAttribute('aria-expanded')).toEqual('false');
  expect(parent.getAttribute('aria-selected')).toEqual('false');
  expect(parent.getAttribute('aria-level')).toEqual('1');
  expect(parent.getAttribute('aria-setsize')).toEqual('1');
  expect(parent.getAttribute('aria-posinset')).toEqual('1');

  const me = await screen.findByRole('treeitem', {
    expanded: false,
    selected: false,
    name: 'me.md'
  });
  expect(me).toBeInTheDocument();
  expect(me.getAttribute('aria-expanded')).toBeNull();
  expect(me.getAttribute('aria-selected')).toEqual('false');
  expect(me.getAttribute('aria-level')).toEqual('2');
  expect(me.getAttribute('aria-setsize')).toEqual('2');
  expect(me.getAttribute('aria-posinset')).toEqual('1');

  const sibling = await screen.findByRole('treeitem', {
    expanded: false,
    selected: false,
    name: 'sibling.json'
  });
  expect(sibling).toBeInTheDocument();
  expect(sibling.getAttribute('aria-expanded')).toBeNull();
  expect(sibling.getAttribute('aria-selected')).toEqual('false');
  expect(sibling.getAttribute('aria-level')).toEqual('2');
  expect(sibling.getAttribute('aria-setsize')).toEqual('2');
  expect(sibling.getAttribute('aria-posinset')).toEqual('2');
});

it('can expand and collapse subtrees', async () => {
  const tree: TreeNode = {
    fileName: 'top',
    filePath: 'top',
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: false,
    children: [
      {
        fileName: 'a',
        filePath: 'top/a',
        level: 2,
        groupSize: 3,
        groupPosition: 1,
        expanded: false,
        children: [
          {
            fileName: 'a1.txt',
            filePath: 'top/a/a1.txt',
            level: 3,
            groupSize: 1,
            groupPosition: 1,
            expanded: false,
          },
        ],
      },
      {
        fileName: 'b.txt',
        filePath: 'top/b.txt',
        level: 2,
        groupSize: 3,
        groupPosition: 2,
        expanded: false,
      },
      {
        fileName: 'c',
        filePath: 'top/c',
        level: 2,
        groupSize: 3,
        groupPosition: 3,
        expanded: false,
        children: [
          {
            fileName: 'c1',
            filePath: 'top/c/c1',
            level: 3,
            groupSize: 1,
            groupPosition: 1,
            expanded: false,
            children: [
              {
                fileName: 'c1a.txt',
                filePath: 'top/c/c1/c1a.txt',
                level: 4,
                groupSize: 1,
                groupPosition: 1,
                expanded: false,
              }
            ]
          }
        ],
      },
    ],
  };
  const Wrapper = () => {
    const [state, dispatch] = useReducer(treeReducer, tree);
    return <Dispatcher.Provider value={dispatch}><Node {...state} /></Dispatcher.Provider>
  };
  render(<Wrapper />);

  const getNamedTreeItem = (accessibleName: string): Promise<HTMLElement> => {
    return screen.findByRole('treeitem', { name: accessibleName });
  };

  const getExpanded = (): HTMLElement[] => {
    return screen.queryAllByRole('treeitem', {
      expanded: true,
    });
  };

  const expectExpanded = (...expanded: HTMLElement[]): void => {
    const expandedElements = getExpanded();
    expect(expandedElements).toHaveLength(expanded.length);
    expect(expandedElements).toEqual(expect.arrayContaining(expanded));
  };

  const [ top, a, a1, b, c, c1, c1a ] = await Promise.all([
    getNamedTreeItem('top'),
    getNamedTreeItem('a'),
    getNamedTreeItem('a1.txt'),
    getNamedTreeItem('b.txt'),
    getNamedTreeItem('c'),
    getNamedTreeItem('c1'),
    getNamedTreeItem('c1a.txt'),
  ]);
  expect(getExpanded()).toHaveLength(0); // nothing expanded

  fireEvent.click(top);
  expectExpanded(top);

  fireEvent.click(a);
  expectExpanded(top, a);

  fireEvent.click(a1);
  // clicked on a leaf node: nothing changes!
  expectExpanded(top, a);

  fireEvent.click(b);
  // clicked on a leaf node: nothing changes!
  expectExpanded(top, a);

  fireEvent.click(c);
  expectExpanded(top, a, c);

  fireEvent.click(c1);
  expectExpanded(top, a, c, c1);

  fireEvent.click(c1a);
  // clicked on a leaf node: nothing changes!
  expectExpanded(top, a, c, c1);

  // collapsing behaviour is more interesting: it collapses child sub-trees, too

  fireEvent.click(a);
  expectExpanded(top, c, c1);

  fireEvent.click(c1);
  expectExpanded(top, c);

  fireEvent.click(c1);
  expectExpanded(top, c, c1);

  fireEvent.click(c);
  expectExpanded(top);

  fireEvent.click(c);
  expectExpanded(top, c); // not c1, even though we didn't explicitly collapse it
});