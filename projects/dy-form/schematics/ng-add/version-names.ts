
export const sofaVersion = loadPackageVersionGracefully('@supine/sofa');

export const requiredAngularVersionRange = '0.0.0-NG';


function loadPackageVersionGracefully(packageName: string): string | null {
  try {
    return require(`${packageName}/package.json`).version;
  } catch {
    return null;
  }
}
