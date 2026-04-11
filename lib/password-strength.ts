/**
 * Validação de força de senha — sem dependências externas.
 *
 * Regras (alinhadas com NIST SP 800-63B + recomendação CERT.br):
 * - Mínimo 12 caracteres
 * - Obrigatório: pelo menos uma letra maiúscula, uma minúscula, um número
 * - Recomendado: símbolo
 * - Bloqueio: senhas comuns conhecidas
 * - Bloqueio: sequências triviais (123456, qwerty, etc.)
 * - Bloqueio: caracteres repetidos (>3 iguais consecutivos)
 */

const COMMON_PASSWORDS = new Set([
  '123456789012', '123456789123', 'qwertyuiop12', 'password1234',
  'senha1234567', 'advogado1234', 'oab123456789', 'teste1234567',
  'admin1234567', 'jusflow12345', 'raiseadv1234', '111111111111',
  'aaaaaaaaaaaa', 'abcdefghijkl', 'asdfghjklzxc', 'qwertyuiopas',
]);

const SEQUENCES = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiopasdfghjklzxcvbnm'];

export interface PasswordStrengthResult {
  valid: boolean;
  score: 0 | 1 | 2 | 3 | 4; // 0 = muito fraca, 4 = muito forte
  errors: string[];
  warnings: string[];
}

export function checkPasswordStrength(password: string, userInputs: string[] = []): PasswordStrengthResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Mínimo
  if (password.length < 12) {
    errors.push('Senha deve ter pelo menos 12 caracteres');
  }

  // Caracteres obrigatórios
  if (!/[a-z]/.test(password)) errors.push('Inclua pelo menos uma letra minúscula');
  if (!/[A-Z]/.test(password)) errors.push('Inclua pelo menos uma letra maiúscula');
  if (!/[0-9]/.test(password)) errors.push('Inclua pelo menos um número');

  // Símbolo (warning, não erro)
  if (!/[^a-zA-Z0-9]/.test(password)) {
    warnings.push('Recomendado: inclua um símbolo (ex: !@#$%)');
  }

  // Repetição
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Evite caracteres repetidos (mais de 3 iguais seguidos)');
  }

  // Senhas comuns
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push('Senha muito comum — escolha algo único');
  }

  // Sequências
  const lower = password.toLowerCase();
  for (const seq of SEQUENCES) {
    for (let i = 0; i <= seq.length - 5; i++) {
      const sub = seq.slice(i, i + 5);
      if (lower.includes(sub)) {
        warnings.push('Evite sequências previsíveis (123456, abcdef, qwerty)');
        break;
      }
    }
  }

  // Email/nome do usuário na senha
  for (const input of userInputs) {
    if (input && input.length >= 4 && lower.includes(input.toLowerCase())) {
      errors.push('Senha não pode conter seu email ou nome');
      break;
    }
  }

  // Score
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (errors.length === 0) {
    score = 2;
    if (password.length >= 14) score = 3;
    if (password.length >= 16 && /[^a-zA-Z0-9]/.test(password) && warnings.length === 0) score = 4;
    if (password.length < 12) score = 1;
  }

  return { valid: errors.length === 0, score, errors, warnings };
}
