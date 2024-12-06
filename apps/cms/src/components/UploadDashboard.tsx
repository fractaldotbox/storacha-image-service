
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Authenticator, Client, Provider, useW3 } from "@w3ui/react";
import StorachaAuth from "./StorachaAuth";
import StorachaProvider from "./StorachaProvider";
import { useEffect, useState } from "react";
import { Delegation, extract, isDelegation } from "@web3-storage/w3up-client/delegation";
import { UploadForm } from "./ui/geist/UploadForm";


const requestDelegation = ({ client }: {
    client: Client
}) => {

    return fetch('/httpcat/api/auth')
        .then(response => response.arrayBuffer())
        .then(async arrayBuffer => {
            const delegation = await extract(new Uint8Array(arrayBuffer))
            console.log(delegation.ok)
            if (!delegation.ok) {
                throw new Error('Failed to extract delegation', { cause: delegation.error })
            }


            return delegation;
        })
}


export const useDelegateAccount = () => {

    const [{ client, accounts }] = useW3();

    const [isDelegated, setIsDelegated] = useState(false);

    useEffect(() => {
        (async () => {

            if (!client) {
                return;
            }

            const delegation = await requestDelegation({ client });

            const space = await client.addSpace(delegation.ok)
            client.setCurrentSpace(space.did())

            setIsDelegated(true);

        })();
    }, [client, isDelegated]);

    return {
        isDelegated
    }


}


export const UploadControls = () => {
    const [{ spaces, client, accounts }] = useW3();

    const { isDelegated } = useDelegateAccount();


    const args = {
        isText: false,
        uploadFile: async ({ file, uploadProgressCallback }: FileParams<File>) => {
            const { uploadFile } = await initStorachaClient({
                keyString: STORACHA_KEY,
                proofString: STORACHA_PROOF!,
            });

            const link = await uploadFile({ file, uploadProgressCallback });

            createToast({ cid: link.toString(), name: "" });
        },
    }
    console.log('isDelegated', isDelegated)
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
                                    isDelegated:
                                    {isDelegated && (
                                        "delegated"
                                    )}
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
                <div>
                    <UploadForm />
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