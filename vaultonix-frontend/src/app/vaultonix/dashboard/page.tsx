import { Metadata } from "next";
import DashboardClient from "./client";

export const generateMetadata = (): Metadata => {
	return {
		"title": "Dashboard - Vaultonix",
		"description": "Manage your servers that use Vaultonix."
	}
}

const DashboardPage = () => {	
	return (
		<>
			<DashboardClient />
		</>
	);
}

export default DashboardPage;