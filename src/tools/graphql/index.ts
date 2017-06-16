import {mkdirp, writeFile} from 'fs-extra';
import fetch = require('isomorphic-fetch');
import {printSchema, buildClientSchema} from 'graphql';

import Tasks from '../../tasks';
import {Workspace} from '../../workspace';
import {graphQLSchemaPath} from '../utilities';

const TASK = Symbol('GraphQLBuild');

export default async function buildGraphQL(workspace: Workspace, tasks: Tasks) {
  if (
    !workspace.project.usesGraphQL ||
    tasks.hasPerformed(TASK)
  ) { return; }

  tasks.perform(TASK);

  const graphQLPlugin = workspace.configFor('graphql');
  if (graphQLPlugin == null) {
    // TODO: link to docs
    throw new Error('You must provide a GraphQL plugin in your Polaris config.');
  }

  const response = await fetch(graphQLPlugin.endpoint)
  const schema = JSON.parse(await response.text());
  const {build: buildDir} = workspace.paths;

  await mkdirp(buildDir);
  await Promise.all([
    // This JSON blob represents our entire schema. It is used by our
    // tools for linting GraphQL documents and fixtures, as well as for
    // generating the type definitions from GraphQL documents.
    writeFile(graphQLSchemaPath(workspace), JSON.stringify(schema, null, 2)),

    // The .graphql file (referred to as a GraphQL IDL) is a human-readable
    // representation of the schema. It is used to provide autocompletion and
    // as a target for "go to definition" in GraphQL files.
    writeFile(graphQLSchemaPath(workspace, true), printSchema(buildClientSchema(schema.data))),
  ]);
}
