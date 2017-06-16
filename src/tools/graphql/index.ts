import {join} from 'path';
import {mkdirp, writeFile} from 'fs-extra';
import fetch = require('isomorphic-fetch');
import {printSchema, buildClientSchema} from 'graphql';
import {Workspace} from '../../workspace';

export default async function buildGraphQL(workspace: Workspace) {
  if (!workspace.project.usesGraphQL) { return; }

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
    writeFile(join(buildDir, 'schema.json'), JSON.stringify(schema, null, 2)),

    // The .graphql file (referred to as a GraphQL IDL) is a human-readable
    // representation of the schema. It is used to provide autocompletion and
    // as a target for "go to definition" in GraphQL files.
    writeFile(join(buildDir, 'schema.graphql'), printSchema(buildClientSchema(schema.data))),
  ]);
}
