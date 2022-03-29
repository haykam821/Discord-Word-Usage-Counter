/**
 * Validates the identifier of a count.
 * @param id The count identifier to validate.
 * @returns Whether the count identifier is valid.
 */
export default function isIdentifier(id: string): boolean {
	return !!id.match(/^[\d_a-z-]+$/);
}
