export function handleCredsUpdate(saveCreds: () => Promise<void>, _creds: any) {
  saveCreds();
}
