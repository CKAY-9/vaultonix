import Link from "next/link";
import style from "./footer.module.scss";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <section>
        <h1>Vaultonix</h1>
        <span>
          Made with ❤️ by <Link href="https://github.com/CKAY-9">CKAY9</Link>
        </span>
        <section
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <Link href="https://github.com/CKAY-9/vaultonix">
            <Image
              src="/github-mark-white.svg"
              alt="GitHub"
              sizes="100%"
              width={0}
              height={0}
              className={style.external}
            />
          </Link>
          <Link href="https://discord.gg/MF7cYzYZYQ">
            <Image
              src="/discord-mark-white.svg"
              alt="Discord"
              sizes="100%"
              width={0}
              height={0}
              className={style.external}
            />
          </Link>
        </section>
      </section>
      <nav>
        <section>
          <strong>General</strong>
          <Link href="/">Home</Link>
          <Link href="/news">News</Link>
          <Link
            href="/premium"
            className="rainbow"
            style={{ fontWeight: "700" }}
          >
            PREMIUM
          </Link>
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
  );
};

export default Footer;
