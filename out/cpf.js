"use strict";
/**
 * CPF matching and validation logic.
 *
 * Replace the regex and/or validateCpf() with your own implementations
 * if needed — the extension code just calls these two exports.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPF_PATTERN = void 0;
exports.validateCpf = validateCpf;
/**
 * Matches CPF candidates in several common formats:
 *   111.222.333-44   (canonical)
 *   111.222.333/44   (slash variant)
 *   111222333-44     (partial punctuation)
 *   11122233344      (bare digits, only when 11 digits exactly)
 *
 * Tweak this to taste — it's intentionally greedy so validation
 * can reject false positives downstream.
 */
exports.CPF_PATTERN = /\b(\d{3}\.?\d{3}\.?\d{3}[-\/]?\d{2})\b/g;
/**
 * Validates a CPF string using the standard mod-11 check-digit algorithm.
 * Accepts any format — strips non-digits internally.
 */
function validateCpf(raw) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 11) {
        return false;
    }
    // Reject known-invalid sequences (all same digit)
    if (/^(\d)\1{10}$/.test(digits)) {
        return false;
    }
    // First check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(digits[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10) {
        remainder = 0;
    }
    if (remainder !== parseInt(digits[9])) {
        return false;
    }
    // Second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(digits[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10) {
        remainder = 0;
    }
    if (remainder !== parseInt(digits[10])) {
        return false;
    }
    return true;
}
//# sourceMappingURL=cpf.js.map