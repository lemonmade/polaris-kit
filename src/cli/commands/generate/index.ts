import * as chalk from 'chalk';
import {mkdirp, exists, readFile, writeFile} from 'fs-extra';
import {resolve} from 'path';
import loadWorkspace from '../../../workspace';

export const command = 'generate <component>';

export interface Argv {
  component: string,
}

export async function handler({component}: Argv) {
  const {project: {usesTypeScript}} = await loadWorkspace();
  const parts = component.split('/');
  const name = parts[parts.length - 1];
  let targetDir;

  // TODO
  const components = 'components';
  const sections = 'sections';

  if (parts.length === 1) {
    targetDir = resolve(components, parts[0]);
  } else {
    targetDir = resolve(sections, ...parts.slice(0, parts.length - 1), 'components', name);
  }

  await mkdirp(targetDir);

  await Promise.all([
    writeFileSyncWithCorrectIndentation(resolve(targetDir, `${name}.${usesTypeScript ? 'tsx' : 'js'}`), `
      import * as React from 'react';
      import {classNames} from '@shopify/react-utilities/styles';
      import * as styles from './${name}.scss';

      export interface Props {
        children?: React.ReactNode,
      }

      export default function ${name}({children}: Props) {
        const className = classNames(
          styles.${name},
        );
        return (
          <div className={className}>{children}</div>
        );
      }
    `),
    writeFileSyncWithCorrectIndentation(resolve(targetDir, `index.${usesTypeScript ? 'ts' : 'js'}`), `
      import ${name} from './${name}';

      export * from './${name}';
      export default ${name};
    `),
    writeFileSyncWithCorrectIndentation(resolve(targetDir, `${name}.scss`), `
      .${name} {

      }
    `),
    writeFileSyncWithCorrectIndentation(resolve(targetDir, 'README.md'), `
      ---
      name: ${name}
      tags:
        -
      category:
      ---

      # ${name}

      ${name} description

      _Not what you’re looking for?_

      Use this instead.

      ## Problem

      Problem description.

      ## Solution

      Solution description

      ## API
      | Prop  | Type   | Default | Required |
      | ---   | ---    | ---     | ---      |
      |       |        |         |          |

      ## Content guidelines

      ### Example type of content
      Guidelines for type of content

      ## Examples

      ### Basic example
      Basic example description

      Basic example code block
    `),
  ]);

  const indexFile = resolve(targetDir, '../index.ts');

  if (await exists(indexFile)) {
    await writeFileSyncWithCorrectIndentation(indexFile, `
      ${(await readFile(indexFile, 'utf8')).replace(/\s+$/, '\n')}
      export {default as ${name}} from './${name}';
      export {Props as ${name}Props} from './${name}';
    `);
  } else {
    await writeFileSyncWithCorrectIndentation(indexFile, `
      export {default as ${name}} from './${name}';
      export {Props as ${name}Props} from './${name}';
    `);
  }
}

async function writeFileSyncWithCorrectIndentation(file: string, content: string) {
  const trimmedContent = content.replace(/^\n+/, '');
  const indentation = (/^\s*/.exec(trimmedContent) || [''])[0].length;
  const finalContent = trimmedContent.replace(new RegExp(`^ {1,${indentation}}`, 'gm'), '');
  await writeFile(file, `${finalContent.replace(/\s*$/, '')}\n`);
  console.log(chalk.green('Wrote file: '), chalk.gray(file));
}
