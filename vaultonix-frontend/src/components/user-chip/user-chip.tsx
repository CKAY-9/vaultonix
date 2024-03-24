import { UserDTO } from "@/api/user/user.dto";
import style from "./user-chip.module.scss";
import Link from "next/link";
import Image from "next/image";

const UserChip = (props: {
	user: UserDTO | null | undefined,
	personal: boolean
}) => {
	if (props.user === null || props.user === undefined) {
		if (!props.personal) return (<></>);
		return (
			<div className={style.user_chip}>
				<Link href="/vaultonix/login">Login to Vaultonix</Link>
			</div>
		)
	}

	return (
		<Link href={`/vaultonix/user/${props.user.id}`} className={style.user_chip}>
			<Image
				src={props.user.avatar_url}
				alt="PFP"
				sizes="100%"
				width={0}
				height={0}
				className={style.pfp}
			/>
			<span>{props.user.username}</span>
		</Link>
	);
}

export default UserChip;