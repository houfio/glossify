import { graphql } from '@glossify/schema';

export const FolderFragment = graphql(`
  fragment FolderFragment on Folder {
    id
    name
    leftFlag
    rightFlag
    words {
      id
    }
    children {
      id
    }
  }
`);

export const ParentFragment = graphql(`
  fragment ParentFragment on Folder {
    id
    name
    leftFlag
    rightFlag
    parent {
      id
    }
  }
`);

export const WordFragment = graphql(`
  fragment WordFragment on Word {
    id
    left
    right
    type
  }
`);
