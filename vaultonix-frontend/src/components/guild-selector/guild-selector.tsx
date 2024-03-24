"use client"

import { useState } from "react";
import style from "./guild-selector.module.scss";

const GuildSelector = (props: {
    on_guild_select: any
}) => {
    const [selected_guild, setSelectedGuild] = useState<string>("");

    return (
        <div className={style.guild_selector}>
            <div id={style.current_guild}>
                {selected_guild.length <= 0 && <>
                    <div className={style.def_guild}></div>
                    <span>Select a guild...</span>
                </>}
            </div>
        </div>
    );
}

export default GuildSelector;