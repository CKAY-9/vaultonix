"use client";

import {
  getLevelRewards,
  updateLevelRewards,
} from "@/api/vaultonix/vaultonix.api";
import { LevelDTO, LevelRewardsDTO } from "@/api/vaultonix/vaultonix.dto";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./level-rewards.module.scss";
import { GuildRoleDTO } from "@/api/discord/discord.dto";
import { getGuildRolesFromVaultonix } from "@/api/discord/discord.api";
import RolePreview from "@/components/role-preview/role-preview";

const Reward = (props: {
  level: LevelDTO;
  roles: GuildRoleDTO[];
  index: number;
  on_change: any;
  on_delete: any;
}) => {
  const [selected_roles, setSelectedRoles] = useState<number[]>([]);
  const [level, setLevel] = useState<number>(props.level.level);
  const [credits, setCredits] = useState<number>(props.level.credits);

  useEffect(() => {
    if (props.roles !== undefined && props.level.selected_roles !== undefined) {
      for (let i = 0; i < props.roles.length; i++) {
        if (props.level.selected_roles.includes(props.roles[i].id)) {
          setSelectedRoles((old) => [...old, i]);
        }
      }
    }

    (async () => {
      const role_ids: string[] = [];
      for (let i = 0; i < selected_roles.length; i++) {
        role_ids.push(props.roles[selected_roles[i]].id);
      }

      props.on_change(
        {
          selected_roles: role_ids,
          credits: Number.parseInt(credits.toString()),
          level: Number.parseInt(level.toString()),
        },
        props.index
      );
    })();
  }, [credits, level, selected_roles, props]);

  return (
    <>
      <div className={style.reward}>
        <h4>Reward #{props.index + 1}</h4>
        <section>
          <label>Level Required</label>
          <input
            type="number"
            placeholder="Level Required"
            defaultValue={props.level.level}
            onChange={(e: BaseSyntheticEvent) => setLevel(e.target.value)}
          />
        </section>
        <section>
          <label>Credits Reward</label>
          <input
            type="number"
            placeholder="Credits Reward"
            defaultValue={props.level.credits}
            onChange={(e: BaseSyntheticEvent) => setCredits(e.target.value)}
          />
        </section>
        <section>
          <label>Roles</label>
          <div className={style.roles}>
            {props.roles.map((role, index) => {
              return (
                <button
                  style={{
                    padding: "0",
                    opacity: selected_roles.includes(index) ? "1" : "0.5",
                  }}
                  key={index}
                  onClick={() => {
                    if (selected_roles.includes(index)) {
                      setSelectedRoles((old) =>
                        old.filter((entry) => entry !== index)
                      );
                      return;
                    }
                    setSelectedRoles((old) => [...old, index]);
                  }}
                >
                  <RolePreview role={role} />
                </button>
              );
            })}
          </div>
        </section>
        <section>
          <button onClick={() => props.on_delete(props.index)}>Delete</button>
        </section>
      </div>
    </>
  );
};

const LevelRewardsModule = (props: { guild_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [level_data, setLevelData] = useState<LevelRewardsDTO | null>(null);
  const [levels, setLevels] = useState<LevelDTO[]>([]);
  const [roles, setRoles] = useState<GuildRoleDTO[]>([]);

  const onChange = (level: LevelDTO, index: number) => {
    levels[index] = level;
    setLevels(levels);
  };

  const onDelete = (index: number) => {
    setLevels(levels.filter((val, i) => i !== index));
  };

  useEffect(() => {
    (async () => {
      if (typeof document === undefined || typeof window === undefined) return;

      const ld = await getLevelRewards(props.guild_id);
      if (ld === null) return;

      const rs = await getGuildRolesFromVaultonix(props.guild_id);
      setRoles(rs);

      const level_json: LevelDTO[] =
        JSON.parse(ld.level_json) || [];
      setLevelData(ld);
      setLevels(level_json || []);
      setLoading(false);
    })();
  }, [props.guild_id]);

  if (loading || level_data === null) {
    return <h3>Loading...</h3>;
  }

  const addToRewards = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setLevels((old) => [
      ...old,
      {
        level: 0,
        credits: 0,
        selected_roles: [],
      },
    ]);
  };

  const update = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (level_data === null) return;

    const update = await updateLevelRewards(props.guild_id, {
      enabled: true,
      level_json: JSON.stringify(levels),
      id: level_data.id,
      guild_id: level_data.guild_id,
    });
  };

  return (
    <>
      <h3>Level Rewards</h3>
      <span>Reward users for reaching certain levels</span>
      {levels.length <= 0 ? (
        <span>There are no level rewards set up...</span>
      ) : (
        <div className={style.rewards}>
          {levels.map((level, index) => {
            return (
              <Reward
                on_change={onChange}
                on_delete={onDelete}
                level={level}
                key={index}
                index={index}
                roles={roles}
              />
            );
          })}
        </div>
      )}
      <button onClick={addToRewards}>Add Level Reward</button>
      <button onClick={update}>Update</button>
    </>
  );
};

export default LevelRewardsModule;
