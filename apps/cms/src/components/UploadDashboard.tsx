
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Provider, useW3 } from "@w3ui/react";
import type {
    Capabilities,
    Client,
    Delegation,
} from "@web3-storage/w3up-client/types";
import StorachaAuth from "./StorachaAuth";
import StorachaProvider from "./StorachaProvider";
import { useEffect, useState } from "react";
import { extract } from "@web3-storage/w3up-client/delegation";
import { UploadForm, type FileParams } from "./ui/geist/UploadForm";
import { createToast } from "@/hooks/upload-toast";
import { uploadFiles, type DownloadProgress } from "@repo/content";


const requestDelegation = ({ did }: {
    did: string
}) => {
    const search = new URLSearchParams({
        did
    });

    return fetch(`/httpcat/api/auth?${search.toString()}`)
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

    const [delegation, setDelegation] = useState<Delegation<Capabilities> | null>(null);


    /**
     * Delegate to client/agent, not the account did
     */

    useEffect(() => {
        (async () => {
            if (!client) {
                return;
            }
            const did = client.did();
            // TODO delegate to account vs client 

            const delegation = await requestDelegation({ did });

            console.log(`delegation to ${did}`, delegation.ok.root.cid.toString())
            const space = await client.addSpace(delegation.ok)
            client.setCurrentSpace(space.did())

            setDelegation(delegation.ok);

        })();
    }, [client]);

    return {
        delegation
    }


}


export const UploadControls = () => {
    const [{ spaces, client, accounts }] = useW3();

    const { delegation } = useDelegateAccount();


    const args = {
        isText: false,
        isShowProgress: true,
        uploadFile: async ({ file, uploadProgressCallback }: FileParams<File>) => {
            // uploadFiles()
            // createToast({ cid: link.toString(), name: "" });
            console.log('file', file)

            if (client) {
                const config = {
                    client: client as unknown as Client,
                    spaceDid: spaces?.[0]?.did()
                }
                return await uploadFiles(config, {
                    file, uploadProgressCallback
                })
            }

        },
    }
    console.log('isDelegated', delegation)
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
                                    {delegation && (
                                        "✅Delegated"
                                    )}
                                    {delegation?.root?.cid?.toString()}
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StorachaAuth />
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UploadForm {...args} />
                        </CardContent>
                    </Card>

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