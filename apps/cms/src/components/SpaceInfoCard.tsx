import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const SpaceInfoCard = ({ name, did }: { name?: string, did?: string }) => {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Space Info</CardTitle>
                <CardDescription>
                    <div>Space name:</div>
                    <div className="font-bold">{name}</div>
                    <div>Space id:</div>
                    <div className="font-bold">{did}</div>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}