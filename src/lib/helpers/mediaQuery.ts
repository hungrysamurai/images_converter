export const mediaQuery = (rule: string, props: string) => {
 return `
 @media (${rule}){
  ${props}
 }
 `
}