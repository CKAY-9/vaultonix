import { GuildDTO } from "@/api/discord/discord.dto";
import style from "./guild-preview.module.scss";
import Image from "next/image";
import { guildIconToURL } from "@/api/discord/discord.utils";

const GuildPreview = (props: { guild: GuildDTO }) => {
  return (
    <div className={style.guild_preview}>
      <Image
        src={guildIconToURL(props.guild.id, props.guild.icon)}
        alt="Icon"
        sizes="100%"
        width={0}
        height={0}
        className={style.icon}
      />
      <span className={style.name}>{props.guild.name}</span>
      <span style={{ opacity: "0.5" }}>
        {props.guild.approximate_member_count || 1} Member(s)
      </span>
    </div>
  );
};

export default GuildPreview;
