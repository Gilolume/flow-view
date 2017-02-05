/**
 * Generate random string [a-z].
 *
 * @param {Number} length of desired result
 * @returns {Function} generateString
 */

function randomString (length) {
  return function generateString () {
    var result = ''

    while (result.length < length) {
      result += String.fromCharCode(97 + Math.floor(Math.random() * 26))
    }

    return result
  }
}

module.exports = randomString
