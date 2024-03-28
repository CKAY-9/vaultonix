"use client";

import { GuildRoleDTO } from "@/api/discord/discord.dto";
import style from "./role-preview.module.scss";

const RolePreview = (props: { role: GuildRoleDTO }) => {
  return (
    <div className={style.role}>
      <div
        className={style.color}
        style={{
          backgroundColor: `#${props.role.color || "ffffff"}`,
          boxShadow: "var(--shdw1)",
        }}
      ></div>
      <span>{props.role.name}</span>
    </div>
  );
};

export default RolePreview;
