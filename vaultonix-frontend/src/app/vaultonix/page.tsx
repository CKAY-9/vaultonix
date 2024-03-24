import { Metadata } from "next";
import VaultonixClient from "./client";

export const generateMetadata = (): Metadata => {
	return {
		"title": "App - Vaultonix"
	}
}

const VaultonixIndex = () => {
	return (
		<>
			<VaultonixClient />
		</>
	);
}

export default VaultonixIndex;