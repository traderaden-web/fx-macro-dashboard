export default function Link({ href, children, ...rest }) {
  return <a href={href} {...rest}>{children}</a>;
}
