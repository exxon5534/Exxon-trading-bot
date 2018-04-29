module.exports = {
  _ns: 'exxon',

  'exchanges.stub': require('./exchange'),
  'exchanges.list[]': '#exchanges.stub'
}
