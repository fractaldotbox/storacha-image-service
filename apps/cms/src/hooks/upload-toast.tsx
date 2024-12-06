import { toast } from "@/hooks/use-toast";

// TODO extension strategy pattern
// avoid if else
// avoid extra deps
// getGatewayUrlWithCid

export enum IpfsGateway {
    Lighthouse = "lighthouse",
    Akave = "akave",
    IpfsIo = "ipfsio",
}

export const getGatewayUrlWithCid = (
    cid: string,
    gateway: IpfsGateway = IpfsGateway.IpfsIo,
) => {

    if (gateway === IpfsGateway.IpfsIo) {
        return `https://ipfs.io/ipfs/${cid}`;
    }
};


export const createToast = ({
    cid,
    name,
    gateway = IpfsGateway.IpfsIo,
}: { cid: string; name: string; gateway?: IpfsGateway }) => {
    const url = getGatewayUrlWithCid(cid, gateway);

    toast({
        title: "File uploaded",
        description: (
            <div>
                File uploaded with {name} <br />
                CID:
                <a href={url} target="_blank">
                    {cid}
                </a>
            </div>
        ),
    });
};
