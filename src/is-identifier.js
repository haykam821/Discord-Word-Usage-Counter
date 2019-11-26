/**
 * Validates the identifier of a count.
 * @param {string} id The count identifier to validate.
 * @returns {boolean} Whether the count identifier is valid.
 */
function isIdentifier(id) {
	return !!id.match(/^[a-z0-9_-]+$/);
}
module.exports = isIdentifier;