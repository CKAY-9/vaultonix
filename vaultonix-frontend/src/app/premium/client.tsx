"use client"

import Image from "next/image";
import style from "./premium.module.scss";
import Link from "next/link";

const PremiumClient = () => {
  return (
    <>
      <Image
        src="/Logo.png"
        alt="Logo"
        sizes="100%"
        width={0}
        height={0}
        style={{
          "position": "absolute", 
          "top": "15vh", 
          "left": "10vw", 
          "width": "15rem", 
          "height": "auto", 
          "transform": "rotate(15deg)"
        }}
      />
      <Image
        src="/Logo.png"
        alt="Logo"
        sizes="100%"
        width={0}
        height={0}
        style={{
          "position": "absolute", 
          "top": "5vh", 
          "left": "80vw", 
          "width": "15rem", 
          "height": "auto", 
          "transform": "rotate(-5deg)"
        }}
      />
      <Image
        src="/Logo.png"
        alt="Logo"
        sizes="100%"
        width={0}
        height={0}
        style={{
          "position": "absolute", 
          "top": "55vh", 
          "left": "80vw", 
          "width": "15rem", 
          "height": "auto", 
          "transform": "rotate(30deg)"
        }}
      />
      <Image
        src="/Logo.png"
        alt="Logo"
        sizes="100%"
        width={0}
        height={0}
        style={{
          "position": "absolute", 
          "top": "60vh", 
          "left": "15vw", 
          "width": "15rem", 
          "height": "auto", 
          "transform": "rotate(-10deg)"
        }}
      />
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
          <h1>VAULTONIX <span className="rainbow" style={{"fontWeight": "900", "fontSize": "3rem"}}>PREMIUM</span></h1>
          <span>Vaultoinx Premium offers quality-of-life enhancements and features.</span>
          <div className={style.features}>
            <h4>FEATURES</h4>
            <span>Access to all Modules</span>
            <span>Experimental Features</span>
            <span>Support Priority</span>
            <span>Weekly Loot Drops</span>
          </div>
          <div className={style.price}>$10</div>
          <span style={{"opacity": 0.5}}>One-Time Payment</span>
        </div>
        <Link href="/" style={{"textAlign": "center", "marginTop": "1rem"}}>Home</Link>
      </main>
    </>
  );
}

export default PremiumClient;