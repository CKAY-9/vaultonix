"use client";

import Link from "next/link";
import style from "./header.module.scss";
import { UserDTO } from "@/api/user/user.dto";
import UserChip from "../user-chip/user-chip";
import { useEffect, useState } from "react";

const Header = (props: { user: UserDTO | null }) => {
  const [is_mobile, setIsMobile] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document === undefined || typeof window === undefined) {
      return;
    }

    const mobile_header = document.getElementById("mobile-header");
    if (mobile_header !== null) {
      mobile_header.onclick = (ev: MouseEvent) => {
        if (!open) {
          setOpen(true);
        } else {
          closeMobile();
        }
      };
    }

    if (window.screen.width <= 800) {
      setIsMobile(true);
    }

    setInterval(() => {
      if (window.screen.width <= 800) {
        setIsMobile(true);
      }
    }, 1000 * 15);
  }, [setIsMobile, open]);

  const closeMobile = () => {
    if (typeof document === undefined || typeof window === undefined) {
      return;
    }

    const mobile_nav = document.getElementById("mobile-nav");
    if (mobile_nav !== null) {
      mobile_nav.style.top = "-100vh";
      mobile_nav.style.opacity = "0";
      mobile_nav.style.filter = "blur(10px)";
      setTimeout(() => {
        setOpen(false);
      }, 750);
    }
  };

  if (is_mobile) {
    return (
      <header id="mobile-header" className={style.header}>
        <section style={{ flexDirection: "row", gap: "1rem" }}>
          <span>| Vaultonix |</span>
        </section>
        {open && (
          <div id="mobile-nav" className={style.mobile_nav}>
            <button onClick={closeMobile}>Close</button>
            <Link href="/">Home</Link>
            <Link href="/news">News</Link>
            <Link href="/vaultonix">Vaultonix</Link>
            <Link
              href="/premium"
              className="rainbow"
              style={{ fontWeight: "700" }}
            >
              PREMIUM
            </Link>
            {props.user !== null && <Link href="/vaultonix/dashboard">Dashboard</Link>}
            <section>Vaultonix, made by CKAY9</section>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className={style.header}>
      <section>
        <Link href="/">Home</Link>
        <Link href="/news">News</Link>
        <Link href="/vaultonix">Vaultonix</Link>
        <Link href="/premium" className="rainbow" style={{ fontWeight: "700" }}>
          PREMIUM
        </Link>
        {props.user !== null && (
          <>
            <div
              style={{ width: "2px", height: "auto", background: "white" }}
            ></div>
            <Link href="/vaultonix/inventory">Inventory</Link>
            <Link href="/vaultonix/item-store">Item Store</Link>
            <Link href="/vaultonix/auction">Auction House</Link>
            <div
              style={{ width: "2px", height: "auto", background: "white" }}
            ></div>
            <Link href="/vaultonix/dashboard">Dashboard</Link>
          </>
        )}
      </section>
      <section>
        <UserChip user={props.user} personal={true} />
      </section>
    </header>
  );
};

export default Header;
