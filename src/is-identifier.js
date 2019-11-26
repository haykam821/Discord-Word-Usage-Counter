function isIdentifier(id) {
	return !!id.match(/^[a-z0-9_-]+$/);
}
module.exports = isIdentifier;