import classes from '../style.module.css'

export function ttt(text: string) {
  return text.split(' ').map(text => classes[text]).join(' ');
}
