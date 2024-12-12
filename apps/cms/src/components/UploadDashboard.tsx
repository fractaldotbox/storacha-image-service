import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { IpfsGateway, uploadSuccessToast } from "@/hooks/upload-toast";
import { type DownloadProgress, uploadFiles } from "@repo/content";
import { Provider, useW3 } from "@w3ui/react";
import { extract } from "@web3-storage/w3up-client/delegation";
import type {
	Capabilities,
	Client,
	Delegation,
} from "@web3-storage/w3up-client/types";
import { useEffect, useState } from "react";
import { SpaceInfoCard } from "./SpaceInfoCard";
import StorachaAuth from "./StorachaAuth";
import StorachaProvider from "./StorachaProvider";
import {
	type UploadFilesParams,
	UploadForm,
	UploadFormType,
} from "./ui/UploadForm";
import { Toaster } from "./ui/toaster";

const requestDelegation = ({
	did,
}: {
	did: string;
}) => {
	const search = new URLSearchParams({
		did,
	});

	return fetch(`/httpcat/api/auth?${search.toString()}`)
		.then((response) => response.arrayBuffer())
		.then(async (arrayBuffer) => {
			const delegation = await extract(new Uint8Array(arrayBuffer));
			console.log(delegation.ok);
			if (!delegation.ok) {
				throw new Error("Failed to extract delegation", {
					cause: delegation.error,
				});
			}

			return delegation;
		});
};

export const useDelegateAccount = () => {
	const [{ client, accounts }] = useW3();

	const [delegation, setDelegation] = useState<Delegation<Capabilities> | null>(
		null,
	);

	/**
	 * Delegate to client/agent, not the account did
	 */

	useEffect(() => {
		(async () => {
			if (!client) {
				return;
			}
			const did = client.did();

			const delegation = await requestDelegation({ did });

			console.log(`delegation to ${did}`, delegation.ok.root.cid.toString());
			const space = await client.addSpace(delegation.ok);
			console.log("set space", space.name, space.did());
			await client.setCurrentSpace(space.did());

			setDelegation(delegation.ok);
		})();
	}, [client]);

	return {
		delegation,
	};
};

type UploadFormFields = { file: File; code: string; description: string };

const mapFieldsAsFiles = (fields: UploadFormFields) => {
	const { file, code, description } = fields;
	const imageFileName = `${code}.jpg`;
	const descriptionFileName = `${code}.md`;
	const metadataFileName = `metadata.json`;

	const imageFile = new File([file], imageFileName, {
		type: "image/jpg",
	});

	const descriptionFile = new File([description], descriptionFileName, {
		type: "text/plain",
	});

	const metadata = {
		id: code.toString(),
		imageSrc: `./${imageFileName}`,
		contentSrc: `./${descriptionFileName}`,
	};

	const metadataFile = new File([JSON.stringify(metadata)], metadataFileName, {
		type: "application/json",
	});

	return [imageFile, descriptionFile, metadataFile];
};

export const UploadControls = () => {
	const [{ spaces, client, accounts }] = useW3();

	const { delegation } = useDelegateAccount();

	const args = {
		isText: false,
		isShowProgress: true,
		uploadFiles: async ({
			file,
			code,
			description,
			uploadProgressCallback,
		}: UploadFilesParams<UploadFormFields>) => {
			if (!client) {
				return;
			}
			const config = {
				client: client as unknown as Client,
				spaceDid: spaces?.[0]?.did(),
			};

			const link = await uploadFiles(config, {
				files: mapFieldsAsFiles({ file, code, description }),
				uploadProgressCallback,
			});

			uploadSuccessToast({
				cid: link.toString(),
				name: code,
				gateway: IpfsGateway.IpfsIo,
			});
		},
	};

	const space = client?.currentSpace();

	return (
		<div>
			<div className="flex flex-col gap-2">
				<div className="w-full">
					<SpaceInfoCard name={space?.name} did={space?.did()} />
				</div>
				<div className="w-full">
					<Card>
						<CardHeader>
							<CardTitle>Account</CardTitle>
							<CardDescription>
								<div>
									{delegation && "✅Delegated"}
									{delegation?.root?.cid?.toString()}
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<StorachaAuth />
						</CardContent>
					</Card>
				</div>
				<div className="mb-20">
					<Card>
						<CardHeader>
							<CardTitle>Upload</CardTitle>
						</CardHeader>
						<CardContent>
							<UploadForm
								type={UploadFormType.MultifieldsAsDirectory}
								{...args}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export const UploadDashboard = () => {
	return (
		<StorachaProvider>
			<UploadControls />
			<Toaster />
		</StorachaProvider>
	);
};
