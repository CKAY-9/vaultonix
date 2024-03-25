"use client"

import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./auto-roles.module.scss";
import { GuildRoleDTO, GuildSettingsDTO } from "@/api/discord/discord.dto";
import { getGuildRolesFromVaultonix } from "@/api/discord/discord.api";
import { updateAutoRolesForGuild } from "@/api/vaultonix/vaultonix.api";

const AutoRolesModule = (props: {
  guild_id: string,
  guild_config: GuildSettingsDTO
}) => {
  const [auto_roles, setAutoRoles] = useState<GuildRoleDTO[]>([]);
  const [roles, setRoles] = useState<GuildRoleDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [show_roles, setShowRoles] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (typeof(window) === undefined || props.guild_config.join_roles === undefined) {
        return;
      }

      const r = await getGuildRolesFromVaultonix(props.guild_id);

      setRoles(r);
      setAutoRoles(r.filter((role) => props.guild_config.join_roles.includes(role.id)));
      setLoading(false);
    })();
  }, [props.guild_id, props.guild_config]);

  useEffect(() => {
    (async () => {
      const role_ids = [];
      for (let i = 0; i < auto_roles.length; i++) {
        const ar = auto_roles[i];
        role_ids.push(ar.id);
      }
      const u = await updateAutoRolesForGuild(props.guild_id, role_ids);
    })();
	}, [auto_roles, props.guild_id]);

  if (loading) {
    return (<h3>Loading...</h3>)
  }

  return (
    <>
      <h3>Auto-Roles</h3>
      <span>Auto-assign roles to users when they join your server (moving roles will automatically update them)</span>
      <label>Auto Roles</label>
      <div className={style.roles}>
        {auto_roles.length <= 0 && <div className={style.role}>No Auto-Roles Assigned...</div>}
        {auto_roles.map((role, index) => {
          return (
            <button key={index} className={style.role} onClick={() => {
              setRoles((old) => [...old, role]);
              setAutoRoles((roles) => roles.filter((r) => r.id !== role.id));
            }}>
              <div className={style.color} style={{"backgroundColor": `#${role.color || "ffffff"}`, "boxShadow": "var(--shdw1)"}}></div>
              <span>{role.name}</span>
            </button>
          )
        })}
      </div>
      <div className={style.add_role}>
        <button onClick={() => setShowRoles(!show_roles)}>{show_roles ? "Hide" : "Show"} Roles</button>
        {show_roles &&
          <div className={style.add_roles}>
            <label>Guild Roles</label>
            {roles.length <= 1 && <span>There are no roles to add...</span>}
            {roles.map((role, index) => {
              if (role.name === "@everyone") return;

              return (
                <button onClick={() => {
                  setAutoRoles((old) => [...old, role]);
                  setRoles((roles) => roles.filter((r) => r.id !== role.id));
                }} className={style.role} key={index}>
                  <div className={style.color} style={{"backgroundColor": `#${role.color || "ffffff"}`, "boxShadow": "var(--shdw1)"}}></div>
                  <span>{role.name}</span>
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
