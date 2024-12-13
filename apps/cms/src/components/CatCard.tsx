import { getIpfsGatewayUrl } from "@/lib/gateway";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CatCard = ({ id, imageSrc }: { id: string; imageSrc: string }) => {
	return (
		<a href={`/httpcat/${id}`}>
			<Card className="bg-white p-4 rounded shadow">
				<CardHeader>
					<CardTitle className="text-xl font-semibold mb-2">{id}</CardTitle>
				</CardHeader>
				<CardContent>
					<img
						src={getIpfsGatewayUrl(imageSrc)}
						alt={`HTTP Cat ${id}`}
						className="w-full h-auto rounded"
					/>
				</CardContent>
			</Card>
		</a>
	);
};
