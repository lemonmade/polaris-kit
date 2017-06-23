import * as path from 'path';
import {Workspace} from '../../../workspace';
import {ifElse} from '../../../utilities';

export default function entry({env, project, paths, config}: Workspace) {
  const entryConfig = config.for('entry');

  let entries = entryConfig
    ? entryConfig.entries
    : ifElse(project.isNode, path.join(paths.root, env.target), paths.app) as Entry;

  if (env.isServer) {
    entries = prependToEntries(entries, 'source-map-support/register');
  }

  if (env.isClient) {
    entries = prependToEntries(entries, 'regenerator-runtime/runtime');
  }

  if (project.usesPolaris) {
    if (env.isDevelopmentClient) {
      entries = prependToEntries(entries, '@shopify/polaris/styles/components.scss');
    }

    if (env.isClient) {
      entries = prependToEntries(entries, '@shopify/polaris/styles/global.scss');
    }
  }

  return entries;
}

export type EntryList = string | string[];
export type EntryObject = {[key: string]: EntryList};
export type Entry = EntryList | EntryObject;

export function prependToEntries(entry: Entry, entryModule: string): Entry {
  if (typeof entry === 'string' || Array.isArray(entry)) {
    return addModuleToEntryList(entryModule, entry);
  } else {
    return Object.keys(entry).reduce((allEntries: EntryObject, key) => ({
      ...allEntries,
      [key]: addModuleToEntryList(entryModule, entry[key]),
    }), {});
  }
}

function addModuleToEntryList(moduleToAdd: string, entry: EntryList): EntryList {
  if (typeof entry === 'string') {
    return [moduleToAdd, entry];
  } else {
    return entry.includes(moduleToAdd)
      ? entry
      : [moduleToAdd, ...entry];
  }
}
