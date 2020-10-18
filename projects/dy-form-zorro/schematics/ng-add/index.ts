import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
// import {sofaVersion} from './version-names';

// Just return the tree
export function ngAdd(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addPackageToPackageJson(tree, '@supine/dy-form', '^PACKAGE_VERSION');
    addPackageToPackageJson(tree, '@supine/dy-form-zorro', '^PACKAGE_VERSION');
    addPackageToPackageJson(tree, '@angular/cdk', '^10.0.0');
    addPackageToPackageJson(tree, 'date-fns', '^2.16.1');
    addPackageToPackageJson(tree, 'lodash', '^4.17.20');

    _context.addTask(new NodePackageInstallTask());
    return tree;
  };
}

function sortObjectByKeys(obj: any): object {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key) => (result[key] = obj[key]) && result, {});
}

export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  if (host.exists('package.json')) {
    // @ts-ignore
    const sourceText = host.read('package.json').toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}
