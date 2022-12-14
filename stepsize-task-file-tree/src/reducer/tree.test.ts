import {treeReducer} from './tree.reducer';
import {TreeNode} from '../tree-node';

it('returns state for unknown actions', () => {
  const state = {
    fileName: 'test.md',
    filePath: 'test.md',
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: false,
  };
  expect(treeReducer(state, {
    type: '?',
  })).toEqual(state);
})

it('sets expanded=true', () => {
  expect(treeReducer({
    fileName: 'test.md',
    filePath: 'test.md',
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: false,
  }, {
    type: 'EXPAND',
    payload: {
      filePath: 'test.md',
    }
  })).toEqual({
    fileName: 'test.md',
    filePath: 'test.md',
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: true,
  });
});

it ('expands the middle of the tree without affecting other branches or children', () => {
  expect(treeReducer({
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
            fileName: 'a1',
            filePath: 'top/a/a1',
            level: 3,
            groupSize: 1,
            groupPosition: 1,
            expanded: true,
          }
        ],
      },
      {
        fileName: 'b',
        filePath: 'top/b',
        level: 2,
        groupSize: 3,
        groupPosition: 2,
        expanded: false,
        children: [
          {
            fileName: 'b1',
            filePath: 'top/b/b1',
            level: 3,
            groupSize: 2,
            groupPosition: 1,
            expanded: false,
            children: [
              {
                fileName: 'b1a',
                filePath: 'top/b/b1/b1a',
                level: 4,
                groupSize: 1,
                groupPosition: 1,
                expanded: false,
              }
            ]
          },
          {
            fileName: 'b2',
            filePath: 'top/b/b2',
            level: 3,
            groupSize: 2,
            groupPosition: 2,
            expanded: false,
          }
        ]
      },
      {
        fileName: 'c',
        filePath: 'top/c',
        level: 2,
        groupSize: 3,
        groupPosition: 3,
        expanded: false,
      }
    ]
  }, {
    type: 'EXPAND',
    payload: {
      filePath: 'top/b/b1'
    }
  })).toEqual(expect.objectContaining({
    fileName: 'top',
    expanded: true,
    children: [
      expect.objectContaining({
        fileName: 'a',
        expanded: false, // unchanged
        children: [
          expect.objectContaining({
            fileName: 'a1',
            expanded: true, // unchanged
          }),
        ],
      }),
      expect.objectContaining({
        fileName: 'b',
        expanded: true,
        children: [
          expect.objectContaining({
            fileName: 'b1',
            expanded: true,
            children: [
              expect.objectContaining({
                fileName: 'b1a',
                expanded: false, // unchanged
              })
            ],
          }),
          expect.objectContaining({
            fileName: 'b2',
            expanded: false, // unchanged
          })
        ],
      }),
      expect.objectContaining({
        fileName: 'c',
        expanded: false, // unchanged
      })
    ],
  }));
});

it('sets expanded=false', () => {
  expect(treeReducer({
    fileName: 'test.md',
    filePath: 'test.md',
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: true,
  }, {
    type: 'COLLAPSE',
    payload: {
      filePath: 'test.md',
    }
  })).toEqual({
    fileName: 'test.md',
    filePath: 'test.md',
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: false,
  });
});

it ('collapses the middle of the tree without affecting other branches or ancestors', () => {
  expect(treeReducer({
    fileName: 'top',
    filePath: 'top',
    level: 1,
    groupSize: 1,
    groupPosition: 1,
    expanded: true,
    children: [
      {
        fileName: 'a',
        filePath: 'top/a',
        level: 2,
        groupSize: 3,
        groupPosition: 1,
        expanded: true,
        children: [
          {
            fileName: 'a1',
            filePath: 'top/a/a1',
            level: 3,
            groupSize: 1,
            groupPosition: 1,
            expanded: true,
          }
        ],
      },
      {
        fileName: 'b',
        filePath: 'top/b',
        level: 2,
        groupSize: 3,
        groupPosition: 2,
        expanded: true,
        children: [
          {
            fileName: 'b1',
            filePath: 'top/b/b1',
            level: 3,
            groupSize: 2,
            groupPosition: 1,
            expanded: true,
            children: [
              {
                fileName: 'b1a',
                filePath: 'top/b/b1/b1a',
                level: 4,
                groupSize: 1,
                groupPosition: 1,
                expanded: true,
              }
            ]
          },
          {
            fileName: 'b2',
            filePath: 'top/b/b2',
            level: 3,
            groupSize: 2,
            groupPosition: 2,
            expanded: true,
          }
        ]
      },
      {
        fileName: 'c',
        filePath: 'top/c',
        level: 2,
        groupSize: 3,
        groupPosition: 3,
        expanded: true,
      }
    ]
  }, {
    type: 'COLLAPSE',
    payload: {
      filePath: 'top/b'
    }
  })).toEqual(expect.objectContaining({
    fileName: 'top',
    expanded: true, // unchanged
    children: [
      expect.objectContaining({
        fileName: 'a',
        expanded: true, // unchanged
      }),
      expect.objectContaining({
        fileName: 'b',
        expanded: false,
        children: [
          expect.objectContaining({
            fileName: 'b1',
            expanded: false,
            children: [
              expect.objectContaining({
                fileName: 'b1a',
                expanded: false,
              })
            ],
          }),
          expect.objectContaining({
            fileName: 'b2',
            expanded: false,
          })
        ],
      }),
      expect.objectContaining({
        fileName: 'c',
        expanded: true, // unchanged
      })
    ],
  }))
});

it('turns a Repository into a Tree', () => {
  expect(treeReducer({
    fileName: '',
    filePath: '',
    level: -1,
    groupSize: -1,
    groupPosition: -1,
    expanded: false,
  }, {
    type: 'USE_REPO',
    payload: {
      name: 'My Repo',
      filepaths: [
        'a.md',
        'b/b1.js',
        'b/b2/b2a.html',
        'b/b2/b2b/b2b1/a.md'
      ],
    },
  })).toEqual(<TreeNode> {
    fileName: '',
    filePath: '',
    level: -1,
    groupSize: -1,
    groupPosition: -1,
    expanded: false,
    children: [
      {
        fileName: 'a.md',
        filePath: 'a.md',
        level: 1,
        groupSize: 2,
        groupPosition: 1,
        expanded: false,
      },
      {
        fileName: 'b',
        filePath: 'b',
        level: 1,
        groupSize: 2,
        groupPosition: 2,
        expanded: false,
        children: [
          {
            fileName: 'b1.js',
            filePath: 'b/b1.js',
            level: 2,
            groupSize: 2,
            groupPosition: 1,
            expanded: false,
          },
          {
            fileName: 'b2',
            filePath: 'b/b2',
            level: 2,
            groupSize: 2,
            groupPosition: 2,
            expanded: false,
            children: [
              {
                fileName: 'b2a.html',
                filePath: 'b/b2/b2a.html',
                level: 3,
                groupSize: 2,
                groupPosition: 1,
                expanded: false,
              },
              {
                fileName: 'b2b',
                filePath: 'b/b2/b2b',
                level: 3,
                groupSize: 2,
                groupPosition: 2,
                expanded: false,
                children: [
                  {
                    fileName: 'b2b1',
                    filePath: 'b/b2/b2b/b2b1',
                    level: 4,
                    groupSize: 1,
                    groupPosition: 1,
                    expanded: false,
                    children: [
                      {
                        fileName: 'a.md',
                        filePath: 'b/b2/b2b/b2b1/a.md',
                        level: 5,
                        groupSize: 1,
                        groupPosition: 1,
                        expanded: false,
                      }
                    ],
                  }
                ],
              }
            ],
          }
        ],
      },
    ],
  })
});