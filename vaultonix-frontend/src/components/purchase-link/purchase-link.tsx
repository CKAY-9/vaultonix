import Link from "next/link"

const PurchaseLink = (props: {
  link: string,
  price: number
}) => {
  return (
    <Link href={props.link} style={{"padding": "1rem", "color": "white !important", "background": "var(--primary-500)"}}>
      Purchase for ${props.price}
    </Link>
  );
}

export default PurchaseLink;