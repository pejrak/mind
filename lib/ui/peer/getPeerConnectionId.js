export const getPeerConnectionId = (email) => `mind-${email.replace(/[^a-z0-9]/gi, '0')}`
