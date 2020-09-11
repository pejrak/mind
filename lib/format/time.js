module.exports = (time = Date.now()) => new Date(time).toLocaleString('en-US', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})