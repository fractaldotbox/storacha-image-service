import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const ServiceCard = ({
	title,
	description,
	slug,
}: {
	title: string;
	description: string;
	slug: string;
}) => {
	return (
		<div id="container">
			<a href={`/${slug}`} target="_blank">
				<Card className="bg-white p-4 rounded shadow">
					<CardHeader>
						<CardTitle className="text-xl font-semibold mb-2">
							{title}
						</CardTitle>
					</CardHeader>
					<CardContent>{description}</CardContent>
				</Card>
			</a>
		</div>
	);
};

export default ServiceCard;
