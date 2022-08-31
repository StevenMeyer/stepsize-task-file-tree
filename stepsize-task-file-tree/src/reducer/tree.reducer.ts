import {Action, CollapseAction, ExpandAction, UseRepositoryAction} from './actions';
import {TreeNode} from '../tree-node';
import {Repository} from '../repository';

/**
 * Convert a Repository into a path map object.
 *
 * A Repository will have paths like
 * [
 *   'a/b/c1.js',
 *   'a/b/c2.js',
 *   'a/d.css',
 *   'e/f.html',
 *   'g.ts'
 * ]
 * this function turns it into an object ready for creating a tree like
 * {
 *   a: {
 *     b: {
 *       'c1.js': {},
 *       'c2.js': {},
 *     },
 *     'd.css': {},
 *   },
 *   e: {
 *     'f.html': {}
 *   },
 *   'g.ts': {}
 * }
 */
function repositoryToPathMap(repository: Repository): Record<string, any> {
  return repository.filepaths.reduce((accumulator, filepath) => {
    const parts = filepath.split('/');
    parts.reduce((acc, part) => {
      acc[part] = acc[part] || {};
      return acc[part];
    }, accumulator as Record<string, any>);
    return accumulator;
  }, {} as Record<string, any>);
}

/**
 * Convert a path map object into a sorted Tree.
 */
function pathMapToTreeNodes(pathMap: Record<string, any>): TreeNode[] {
  const factory = (map: Record<string, any>, pathToHere: string, level: number): (fileName: string, index: number, keys: string[]) => TreeNode => {
    return ((fileName, index, keys) => {
      const filePath = `${pathToHere}${fileName}`;
      const childKeys = Object.keys(map[fileName]);
      return {
        fileName,
        filePath,
        level,
        groupSize: keys.length,
        groupPosition: index + 1,
        expanded: false,
        children: childKeys.length > 0 ? childKeys.sort().map(factory(map[fileName], `${filePath}/`, level + 1)) : undefined,
      }
    });
  };
  return Object.keys(pathMap).sort().map(factory(pathMap, '', 1));
}

export const rootNode: Readonly<TreeNode> = {
  fileName: '',
  filePath: '',
  level: -1,
  groupSize: -1,
  groupPosition: -1,
  expanded: false,
};

export function treeReducer(state: TreeNode, { type, payload }: Action): TreeNode {
  switch (type) {
    case 'EXPAND':
      const eaNodeIsAncestor = (payload as ExpandAction['payload']).filePath.startsWith(state.filePath);
      return {
        ...state,
        children: eaNodeIsAncestor ? state.children?.map((child) => {
          return treeReducer(child, { type, payload });
        }) : state.children,
        expanded: state.expanded || eaNodeIsAncestor,
      };

    case 'COLLAPSE':
      const nodeIsDescendent = state.filePath.startsWith((payload as CollapseAction['payload']).filePath);
      const caNodeIsAncestor = (payload as CollapseAction['payload']).filePath.startsWith(state.filePath);
      return {
        ...state,
        children: nodeIsDescendent || caNodeIsAncestor ? state.children?.map((child) => {
          return treeReducer(child, { type, payload });
        }) : state.children,
        expanded: nodeIsDescendent ? false : state.expanded,
      };

    case 'USE_REPO':
      const pathMap = repositoryToPathMap(payload as UseRepositoryAction['payload']);
      const children = pathMapToTreeNodes(pathMap);
      return {
        ...rootNode,
        children,
      };

    default:
      return state;
  }
}