import {Repository} from '../repository';
import {TreeNode} from '../tree-node';

export interface Action {
  type: string;
  payload?: unknown;
}

export interface ExpandAction extends Action {
  type: 'EXPAND';
  payload: Pick<TreeNode, 'filePath'>;
}

export interface CollapseAction extends Action {
  type: 'COLLAPSE';
  payload: Pick<TreeNode, 'filePath'>;
}

export interface UseRepositoryAction extends Action {
  type: 'USE_REPO';
  payload: Repository;
}