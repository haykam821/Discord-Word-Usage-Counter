/**
 * Validates the identifier of a count.
 * @param {string} id The count identifier to validate.
 * @returns {boolean} Whether the count identifier is valid.
 */
function isIdentifier(id) {
	return !!id.match(/^[\d_a-z-]+$/);
}
module.exports = isIdentifier;
