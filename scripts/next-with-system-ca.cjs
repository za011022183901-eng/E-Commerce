const { spawn, spawnSync } = require("node:child_process");
const { mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");

const nextArguments = ["node_modules/next/dist/bin/next", ...process.argv.slice(2)];

function runNext(extraCaPath) {
  return spawn(process.execPath, nextArguments, {
    stdio: "inherit",
    env: {
      ...process.env,
      ...(extraCaPath ? { NODE_EXTRA_CA_CERTS: extraCaPath } : {}),
    },
  });
}

if (process.platform !== "win32") {
  const child = runNext();
  child.on("error", (error) => {
    console.error("Unable to start Next.js:", error.message);
    process.exitCode = 1;
  });
  child.on("exit", (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
} else {
  const powershell = spawnSync(
    "powershell.exe",
    [
      "-NoLogo",
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "$ErrorActionPreference='Stop'; foreach ($location in @([System.Security.Cryptography.X509Certificates.StoreLocation]::CurrentUser, [System.Security.Cryptography.X509Certificates.StoreLocation]::LocalMachine)) { $store = [System.Security.Cryptography.X509Certificates.X509Store]::new('Root', $location); $store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadOnly); foreach ($certificate in $store.Certificates) { '-----BEGIN CERTIFICATE-----'; [Convert]::ToBase64String($certificate.RawData, [Base64FormattingOptions]::InsertLineBreaks); '-----END CERTIFICATE-----' }; $store.Close() }",
    ],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, windowsHide: true },
  );

  if (powershell.error || powershell.status !== 0 || !powershell.stdout.includes("BEGIN CERTIFICATE")) {
    console.error("Unable to read the Windows trusted certificate store.");
    process.exitCode = 1;
  } else {
    const tempDirectory = mkdtempSync(path.join(tmpdir(), "shop-mart-ca-"));
    const caPath = path.join(tempDirectory, "windows-roots.pem");
    writeFileSync(caPath, powershell.stdout, { mode: 0o600 });

    const child = runNext(caPath);
    const cleanup = () => rmSync(tempDirectory, { recursive: true, force: true });
    let cleaned = false;
    const cleanOnce = () => {
      if (!cleaned) {
        cleaned = true;
        cleanup();
      }
    };

    child.on("error", (error) => {
      console.error("Unable to start Next.js:", error.message);
      cleanOnce();
      process.exitCode = 1;
    });
    child.on("exit", (code, signal) => {
      cleanOnce();
      process.exitCode = code ?? (signal ? 1 : 0);
    });
    process.on("SIGINT", () => child.kill("SIGINT"));
    process.on("SIGTERM", () => child.kill("SIGTERM"));
  }
}
