interface VerifyOptions {
  expectedVersion: string;
  packages: readonly string[];
  maxAttempts?: number;
  retryDelayMs?: number;
}

interface RegistryMetadata {
  version: string;
}

interface PackageResult {
  packageName: string;
  version?: string;
  error?: Error;
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

async function getLatestVersion(packageName: string): Promise<string> {
  const npmURL = `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`;
  const response = await fetch(npmURL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const metadata = (await response.json()) as RegistryMetadata;
  return metadata.version;
}

export async function verifyPublishedVersions({
  expectedVersion,
  packages,
  maxAttempts = 5,
  retryDelayMs = 3_000,
}: VerifyOptions): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Checking published versions (${attempt}/${maxAttempts})...`);

    const results: PackageResult[] = await Promise.all(
      packages.map(async (packageName) => {
        let version = "";
        let error: Error | undefined = undefined;

        try {
          version = await getLatestVersion(packageName);
        } catch (error) {
          error = error as Error;
        }

        return { packageName, version, error };
      }),
    );

    const unpublished = results.filter((r) => r.version !== expectedVersion);

    if (unpublished.length === 0) {
      console.log(`✓ All packages published as ${expectedVersion}`);
      return;
    }

    for (const result of unpublished) {
      const errorMsg = result.error
        ? `✗ ${result.packageName}: ${result.error.message}`
        : `✗ ${result.packageName}: latest=${result.version} expected=${expectedVersion}`;
      console.log(errorMsg);
    }

    if (attempt < maxAttempts) await sleep(retryDelayMs);
  }

  throw `Timed out waiting for all packages to publish version ${expectedVersion}.`;
}
