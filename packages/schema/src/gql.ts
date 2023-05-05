/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment FolderFragment on Folder {\n    id\n    name\n    leftFlag\n    rightFlag\n    words {\n      id\n    }\n    children {\n      id\n    }\n  }\n": types.FolderFragmentFragmentDoc,
    "\n  fragment ParentFragment on Folder {\n    id\n    name\n    leftFlag\n    rightFlag\n    parent {\n      id\n    }\n  }\n": types.ParentFragmentFragmentDoc,
    "\n  fragment WordFragment on Word {\n    id\n    left\n    right\n    type\n  }\n": types.WordFragmentFragmentDoc,
    "\n  mutation LoginMutation($input: LoginInput!) {\n    login(input: $input) {\n      token\n    }\n  }\n": types.LoginMutationDocument,
    "\n  query ProfileQuery {\n    me {\n      id\n      email\n    }\n  }\n": types.ProfileQueryDocument,
    "\n  query FoldersQuery($id: ID!, $root: Boolean!) {\n    me @include(if: $root) {\n      id\n      username\n      folders {\n        id\n        ...FolderFragment\n      }\n    }\n    folder(id: $id) @skip(if: $root) {\n      id\n      children {\n        id\n        ...FolderFragment\n      }\n      words {\n        id\n        ...WordFragment\n      }\n      ...ParentFragment\n    }\n  }\n": types.FoldersQueryDocument,
    "\n  mutation CreateFolderMutation($input: CreateFolderInput!) {\n    createFolder(input: $input) {\n      id\n    }\n  }\n": types.CreateFolderMutationDocument,
    "\n  mutation CreateWordMutation($input: CreateWordInput!) {\n    createWord(input: $input) {\n      id\n    }\n  }\n": types.CreateWordMutationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FolderFragment on Folder {\n    id\n    name\n    leftFlag\n    rightFlag\n    words {\n      id\n    }\n    children {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment FolderFragment on Folder {\n    id\n    name\n    leftFlag\n    rightFlag\n    words {\n      id\n    }\n    children {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ParentFragment on Folder {\n    id\n    name\n    leftFlag\n    rightFlag\n    parent {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment ParentFragment on Folder {\n    id\n    name\n    leftFlag\n    rightFlag\n    parent {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment WordFragment on Word {\n    id\n    left\n    right\n    type\n  }\n"): (typeof documents)["\n  fragment WordFragment on Word {\n    id\n    left\n    right\n    type\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginMutation($input: LoginInput!) {\n    login(input: $input) {\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation LoginMutation($input: LoginInput!) {\n    login(input: $input) {\n      token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProfileQuery {\n    me {\n      id\n      email\n    }\n  }\n"): (typeof documents)["\n  query ProfileQuery {\n    me {\n      id\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FoldersQuery($id: ID!, $root: Boolean!) {\n    me @include(if: $root) {\n      id\n      username\n      folders {\n        id\n        ...FolderFragment\n      }\n    }\n    folder(id: $id) @skip(if: $root) {\n      id\n      children {\n        id\n        ...FolderFragment\n      }\n      words {\n        id\n        ...WordFragment\n      }\n      ...ParentFragment\n    }\n  }\n"): (typeof documents)["\n  query FoldersQuery($id: ID!, $root: Boolean!) {\n    me @include(if: $root) {\n      id\n      username\n      folders {\n        id\n        ...FolderFragment\n      }\n    }\n    folder(id: $id) @skip(if: $root) {\n      id\n      children {\n        id\n        ...FolderFragment\n      }\n      words {\n        id\n        ...WordFragment\n      }\n      ...ParentFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateFolderMutation($input: CreateFolderInput!) {\n    createFolder(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateFolderMutation($input: CreateFolderInput!) {\n    createFolder(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateWordMutation($input: CreateWordInput!) {\n    createWord(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWordMutation($input: CreateWordInput!) {\n    createWord(input: $input) {\n      id\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;