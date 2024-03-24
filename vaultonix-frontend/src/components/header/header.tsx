import Link from "next/link";
import style from "./header.module.scss";
import { UserDTO } from "@/api/user/user.dto";
import UserChip from "../user-chip/user-chip";

const Header = (props: {
    user: UserDTO | null
}) => {
    return (
        <header className={style.header}>
            <section>
                <Link href="/">Home</Link>
                <Link href="/news">News</Link>
                <Link href="/vaultonix">Vaultonix</Link>
                <div style={{"width": "2px", "height": "auto", "background": "white"}}></div>
                <Link href="/vaultonix/item-store">Item Store</Link>
                <Link href="/vaultonix/auction">Auction House</Link>
                <div style={{"width": "2px", "height": "auto", "background": "white"}}></div>
                <Link href="/vaultonix/dashboard">Dashboard</Link>
            </section>
            <section>
                <UserChip user={props.user} personal={true} />
            </section>
        </header>
    )
}

export default Header;