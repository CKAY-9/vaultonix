import { StoreEntryDTO } from "@/api/store/store.dto"
import style from "./item-preview.module.scss";
import Image from "next/image";
import Link from "next/link";

const ItemPreview = (props: {
  item: StoreEntryDTO
}) => {
  return (
    <Link href={`/vaultonix/item-store/${props.item.id}`} className={style.item}>
      <Image 
        src={props.item.thumbnail}
        alt="Thumbnail"
        sizes="100%"
        width={0}
        height={0}
        className={style.thumbnail}
      />
      <span className={style.name}>{props.item.name}</span>
      <span>{props.item.description.slice(0, 25)}...</span>
      <section style={{"display": "flex", "gap": "0.5rem"}}>
        {props.item.money_price >= 0 && <span>${props.item.money_price}</span>}
        {(props.item.credit_price >= 0 && props.item.money_price >= 0) && <div style={{"width": "2px", "height": "1rem", "backgroundColor": "white"}}></div>}
        {props.item.credit_price >= 0 && <span>{props.item.credit_price} Credits</span>}
      </section>
      <section style={{"display": "flex", "gap": "0.5rem"}}>
        <span>Stock: {props.item.stock === -1 ? "Infinite" : props.item.stock - props.item.sold}</span>
        <div style={{"width": "2px", "height": "1rem", "backgroundColor": "white"}}></div>
        <span>Sold: {props.item.sold}</span>
      </section>
    </Link>
  );
}

export default ItemPreview;