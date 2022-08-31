export interface TreeNode {
  fileName: string;
  filePath: string;
  children?: TreeNode[];
  /** Which level in the tree from the top is this node?. It won't affect the render order. */
  level: number;
  /** How many nodes are at this `level` in the tree? */
  groupSize: number;
  /** Which position in the group is this particular node? It won't affect the render order. */
  groupPosition: number;
  /** Is this node's subtree expanded? */
  expanded: boolean;
}