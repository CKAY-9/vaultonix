"use client";

import Image from "next/image";
import style from "./premium.module.scss";
import Link from "next/link";

const PremiumClient = () => {
  return (
    <>
      <main className={style.container}>
        <div className={style.premium}>
          <Image
            src="/Premium.png"
            alt="Premium"
            sizes="100%"
            width={0}
            height={0}
            className={style.image}
          />
          <h1>
            VAULTONIX{" "}
            <span
              className="rainbow"
              style={{ fontWeight: "900", fontSize: "3rem" }}
            >
              PREMIUM
            </span>
          </h1>
          <span>
            Vaultoinx Premium offers quality-of-life enhancements and features.
          </span>
          <div className={style.features}>
            <h4>FEATURES</h4>
            <span>Access to all Modules</span>
            <span>Experimental Features</span>
            <span>Support Priority</span>
            <span>Weekly Loot Drops</span>
          </div>
          <div className={style.price}>$10</div>
          <span style={{ opacity: 0.5 }}>One-Time Payment</span>
          <Link href="/" style={{ textAlign: "center", marginTop: "1rem" }}>
            Home
          </Link>
        </div>
      </main>
    </>
  );
};

export default PremiumClient;
