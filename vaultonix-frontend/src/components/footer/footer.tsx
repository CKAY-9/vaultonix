import Link from "next/link";
import style from "./footer.module.scss";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <section>
        <h1>Vaultonix</h1>
        <span>Made with ❤️ by <Link href="https://github.com/CKAY-9">CKAY9</Link></span>
      </section>
      <nav>
        <section>
          <strong>General</strong>
          <Link href="/">Home</Link>
          <Link href="/news">News</Link>
          <Link href="/premium" className="rainbow" style={{"fontWeight": "700"}}>PREMIUM</Link>
        </section>
        <section>
          <strong>Vaultonix</strong>
          <Link href="/vaultonix">Vaultonix</Link>
          <Link href="/vaultonix/dashboard">Dashboard</Link>
          <Link href="/vaultonix/item-store">Item Store</Link>
          <Link href="/vaultonix/auction">Auction House</Link>
        </section>
        <section>
          <strong>User</strong>
          <Link href="/vaultonix/login">Login</Link>
          <Link href="/vaultonix/settings">Settings</Link>
        </section>
      </nav>
    </footer>
  )
}

export default Footer;