import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { createMigrationSchematicRule, NullableDevkitMigration, TargetVersion } from '@angular/cdk/schematics';
import { ClassNamesMigration } from './upgrade-rules/class-names';
import { ruleUpgradeData } from './upgrade-data';

const migrations: NullableDevkitMigration[] = [
  ClassNamesMigration
];
/** Entry point for the migration schematics with target of @supine/dy-form-zorro v10 */
export function updateToV10(): Rule {
  return createMigrationSchematicRule(TargetVersion.V10, migrations, ruleUpgradeData, postUpdate);
}

/** Post-update schematic to be called when update is finished. */
export function postUpdate(context: SchematicContext, targetVersion: TargetVersion,
                           hasFailures: boolean): void {

  context.logger.info('');
  context.logger.info(`  ✓  Updated @supine/dy-form-zorro to ${targetVersion}`);
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
      'output above and fix these issues manually.');
  }

}
