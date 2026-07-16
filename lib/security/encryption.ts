import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey() {
  const rawKey = process.env.APPLICATION_ENCRYPTION_KEY;

  if (!rawKey) {
    throw new Error("APPLICATION_ENCRYPTION_KEY 환경변수가 필요합니다.");
  }

  const key = Buffer.from(rawKey, "base64");

  if (key.length !== 32) {
    throw new Error(
      "APPLICATION_ENCRYPTION_KEY는 base64로 인코딩된 32바이트 키여야 합니다.",
    );
  }

  return key;
}

export function encryptSensitiveValue(value: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

export function maskAccount(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 4) {
    return "*".repeat(digits.length);
  }

  return `${digits.slice(0, 3)}${"*".repeat(
    Math.max(digits.length - 7, 4),
  )}${digits.slice(-4)}`;
}

export function maskCard(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);

  if (digits.length < 8) {
    return "**** **** **** ****";
  }

  return `${digits.slice(0, 4)} **** **** ${digits.slice(-4)}`;
}
