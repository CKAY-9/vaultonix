"use client"

import { useEffect, useState } from "react";
import style from "./auto-roles.module.scss";
import { GuildRoleDTO } from "@/api/discord/discord.dto";
import { getGuildRolesFromVaultonix } from "@/api/discord/discord.api";

const AutoRolesModule = (props: {
  guild_id: string
}) => {
  const [auto_roles, setAutoRoles] = useState<GuildRoleDTO[]>([]);
  const [roles, setRoles] = useState<GuildRoleDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [show_roles, setShowRoles] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (typeof(window) === undefined) {
        return;
      }

      const r = await getGuildRolesFromVaultonix(props.guild_id);
      setRoles(r);
      setLoading(false);
    })();
  }, [props.guild_id]);

  if (loading) {
    return (<h3>Loading...</h3>)
  }

  return (
    <>
      <h3>Auto-Roles</h3>
      <span>Auto-assign roles to users when they join your server</span>
      <div className={style.roles}>
        {auto_roles.length <= 0 && <div className={style.role}>No Auto-Roles Assigned...</div>}
      </div>
      <div className={style.add_role}>
        <button onClick={() => setShowRoles(!show_roles)}>Add Role</button>
        {show_roles &&
          <div className={style.add_roles}>
            {roles.map((role, index) => {
              if (role.name === "@everyone") return;

              return (
                <button className={style.role} key={index}>
                  <div className={style.color} style={{"backgroundColor": `#${role.color || "ffffff"}`}}></div>
                  <span style={{"color": `#${role.color}`}}>{role.name}</span>
                </button>
              );
            })}
          </div>
        }
      </div>
    </>
  );
};

export default AutoRolesModule;
