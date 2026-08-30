export default function Link(props) {
  return props.href
    ? <a href={props.href} className={props.className}>{props.children}</a>
    : props.children;
}
