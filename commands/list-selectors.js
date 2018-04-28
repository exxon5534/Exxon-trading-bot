module.exports = function container (get, set, clear) {
  return function (program) {
    program
      .command('list-selectors')
      .description('list available selectors')
      .action(function (cmd) {

      })
  }
}
