/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Color: any;
};

export type CreateFolderInput = {
  leftFlag: Scalars['String'];
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['ID']>;
  rightFlag: Scalars['String'];
};

export type CreateTagInput = {
  color: Scalars['Color'];
  tag: Scalars['String'];
};

export type CreateWordInput = {
  folderId: Scalars['ID'];
  left: Scalars['String'];
  right: Scalars['String'];
  tagIds: Array<Scalars['ID']>;
  type: WordType;
};

export type Folder = {
  __typename?: 'Folder';
  children: Array<Folder>;
  id: Scalars['ID'];
  leftFlag: Scalars['String'];
  name: Scalars['String'];
  parent?: Maybe<Folder>;
  rightFlag: Scalars['String'];
  user: User;
  words: Array<Word>;
};

export type LoginData = {
  __typename?: 'LoginData';
  token: Scalars['String'];
  user: User;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFolder: Folder;
  createTag: Tag;
  createWord: Word;
  login: LoginData;
  register?: Maybe<User>;
};


export type MutationCreateFolderArgs = {
  input: CreateFolderInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateWordArgs = {
  input: CreateWordInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type Query = {
  __typename?: 'Query';
  folder: Folder;
  me: User;
  tag: Tag;
  user: User;
  word: Word;
};


export type QueryFolderArgs = {
  id: Scalars['ID'];
};


export type QueryTagArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryWordArgs = {
  id: Scalars['ID'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  color: Scalars['Color'];
  id: Scalars['ID'];
  tag: Scalars['String'];
  words: Array<Word>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  folders: Array<Folder>;
  id: Scalars['ID'];
  tags: Array<Tag>;
  username: Scalars['String'];
};

export type Word = {
  __typename?: 'Word';
  folder: Folder;
  id: Scalars['ID'];
  left: Scalars['String'];
  right: Scalars['String'];
  tags: Array<Tag>;
  type: WordType;
};

export enum WordType {
  Adjective = 'ADJECTIVE',
  Adverb = 'ADVERB',
  Noun = 'NOUN',
  Verb = 'VERB'
}

export type FolderFragmentFragment = { __typename?: 'Folder', id: string, name: string, leftFlag: string, rightFlag: string, words: Array<{ __typename?: 'Word', id: string }>, children: Array<{ __typename?: 'Folder', id: string }> } & { ' $fragmentName'?: 'FolderFragmentFragment' };

export type ParentFragmentFragment = { __typename?: 'Folder', id: string, name: string, leftFlag: string, rightFlag: string, parent?: { __typename?: 'Folder', id: string } | null } & { ' $fragmentName'?: 'ParentFragmentFragment' };

export type WordFragmentFragment = { __typename?: 'Word', id: string, left: string, right: string, type: WordType } & { ' $fragmentName'?: 'WordFragmentFragment' };

export type LoginMutationMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutationMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginData', token: string } };

export type ProfileQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQueryQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string } };

export type FoldersQueryQueryVariables = Exact<{
  id: Scalars['ID'];
  root: Scalars['Boolean'];
}>;


export type FoldersQueryQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string, folders: Array<(
      { __typename?: 'Folder', id: string }
      & { ' $fragmentRefs'?: { 'FolderFragmentFragment': FolderFragmentFragment } }
    )> }, folder?: (
    { __typename?: 'Folder', id: string, children: Array<(
      { __typename?: 'Folder', id: string }
      & { ' $fragmentRefs'?: { 'FolderFragmentFragment': FolderFragmentFragment } }
    )>, words: Array<(
      { __typename?: 'Word', id: string }
      & { ' $fragmentRefs'?: { 'WordFragmentFragment': WordFragmentFragment } }
    )> }
    & { ' $fragmentRefs'?: { 'ParentFragmentFragment': ParentFragmentFragment } }
  ) };

export type CreateFolderMutationMutationVariables = Exact<{
  input: CreateFolderInput;
}>;


export type CreateFolderMutationMutation = { __typename?: 'Mutation', createFolder: { __typename?: 'Folder', id: string } };

export type CreateWordMutationMutationVariables = Exact<{
  input: CreateWordInput;
}>;


export type CreateWordMutationMutation = { __typename?: 'Mutation', createWord: { __typename?: 'Word', id: string } };

export const FolderFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FolderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"leftFlag"}},{"kind":"Field","name":{"kind":"Name","value":"rightFlag"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<FolderFragmentFragment, unknown>;
export const ParentFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"leftFlag"}},{"kind":"Field","name":{"kind":"Name","value":"rightFlag"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ParentFragmentFragment, unknown>;
export const WordFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"left"}},{"kind":"Field","name":{"kind":"Name","value":"right"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<WordFragmentFragment, unknown>;
export const LoginMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginMutationMutation, LoginMutationMutationVariables>;
export const ProfileQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<ProfileQueryQuery, ProfileQueryQueryVariables>;
export const FoldersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FoldersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"root"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"root"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FolderFragment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"folder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"skip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"root"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FolderFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFragment"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParentFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FolderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"leftFlag"}},{"kind":"Field","name":{"kind":"Name","value":"rightFlag"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"left"}},{"kind":"Field","name":{"kind":"Name","value":"right"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"leftFlag"}},{"kind":"Field","name":{"kind":"Name","value":"rightFlag"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<FoldersQueryQuery, FoldersQueryQueryVariables>;
export const CreateFolderMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFolderMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateFolderMutationMutation, CreateFolderMutationMutationVariables>;
export const CreateWordMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWordMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateWordMutationMutation, CreateWordMutationMutationVariables>;