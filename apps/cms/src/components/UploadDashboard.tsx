
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Authenticator, Provider, useW3 } from "@w3ui/react";
import StorachaAuth from "./StorachaAuth";
import StorachaProvider from "./StorachaProvider";
import { useEffect } from "react";
import { Delegation, extract } from "@web3-storage/w3up-client/delegation";




export const useDelegateAccount = () => {

    // todo consider query

    useEffect(() => {
        (async () => {
            fetch('/httpcat/api/auth')
                .then(response => response.arrayBuffer())
                .then(async arrayBuffer => {
                    const delegation = await extract(new Uint8Array(arrayBuffer))
                    console.log(delegation)
                    if (!delegation.ok) {
                        throw new Error('Failed to extract delegation', { cause: delegation.error })
                    }
                })



        })();
    }, [])
    // request api



}


export const UploadControls = () => {
    const [{ spaces, client, accounts }] = useW3();

    useDelegateAccount();

    return (
        <div>
            <div className="flex flex-col gap-2">
                <div className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Space Info</CardTitle>
                            <CardDescription>
                                <div>
                                    Space name:
                                </div>

                                <div className="font-bold">
                                    {spaces?.[0]?.meta()?.name}
                                </div>
                                <div>
                                    Space id:
                                </div>
                                <div className="font-bold">
                                    {spaces?.[0]?.did()}
                                </div>
                            </CardDescription>
                        </CardHeader>
                    </Card>


                </div>
                <div className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                <div>

                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StorachaAuth />
                        </CardContent>
                    </Card>
                </div>
                <div>
                    Delegate
                </div>
            </div>
        </div>
    );
}

export const UploadDashboard = () => {
    return (
        <StorachaProvider>
            <UploadControls />
        </StorachaProvider>
    )
}