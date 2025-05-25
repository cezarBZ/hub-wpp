export const checkIsPrivateMsg = (jid: string | undefined | null) => {
  return jid && jid.endsWith("@s.whatsapp.net");
};
