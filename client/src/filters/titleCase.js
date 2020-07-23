export default function(str) {
  const strToArray = str
    .split(' ')
    .map((st) => st.charAt(0).toUpperCase() + st.substring(1))
  return strToArray.join(' ')
}
