// Formats date to string in format: "YYYY-MM-DD HH:MM:SS"
export const formatTime = date => date.toISOString().slice(0, 19).replace('T', ' ')
