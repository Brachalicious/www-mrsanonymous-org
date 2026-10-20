export function validGuidanceQuestion(text: string) {
  return text.trim().length >= 1 && text.trim().length <= 4000;
}
