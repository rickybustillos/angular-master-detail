export function isInvalid(input: any): string {
  if (input.invalid && input.touched){
    return 'is-invalid';
  } else {
    return '';
  }
}
export function isValid(input: any): string {
  if (input.valid && input.touched){
    return 'is-valid';
  } else {
    return '';
  }
}