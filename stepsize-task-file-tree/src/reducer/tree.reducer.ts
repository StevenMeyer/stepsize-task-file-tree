import {TreeNode} from '../node/node';
import {Action, CollapseAction, ExpandAction} from './actions';

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

    default:
      return state;
  }
}