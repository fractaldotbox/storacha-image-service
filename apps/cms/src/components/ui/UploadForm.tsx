import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DownloadProgress } from "ky";
import React from "react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { FileInputField } from "./FileInputField";
import { Input } from "./input";

const lorem = `# Description

This HTTP \`666 Armageddon\` response status code indicates that the servers are occupied by cats`;

export type UploadFilesParams<T> = T & {
	uploadProgressCallback?: (data: DownloadProgress) => void;
};

export type UploadFormParams<T> = {
	isShowProgress?: boolean;
	uploadFiles: (params: UploadFilesParams<T>) => Promise<any>;
};

export enum UploadFormType {
	Text = "text",
	File = "file",
	FileMultiple = "file-multiple",
	FileDirectory = "file-directory",
	MultifieldsAsDirectory = "multifields-as-directory",
}

export const UPLOAD_FORM_BY_TYPE = {} as Record<
	UploadFormType,
	{
		schema: any;
		defaultValues: any;
		createFormFields: (form: any) => any;
	}
>;

UPLOAD_FORM_BY_TYPE[UploadFormType.MultifieldsAsDirectory] = {
	schema: z.object({
		file: z.custom<File>(),
		code: z.number(),
		description: z.string(),
	}),
	defaultValues: {
		file: undefined,
		code: 0,
		description: lorem,
	},
	createFormFields: (form: any) => (
		<>
			<FormField
				name="code"
				render={({ field }: { field: any }) => (
					<FormItem>
						<FormLabel>Code</FormLabel>
						<FormControl>
							<Input
								id="code"
								type="number"
								placeholder={666}
								{...field}
								{...form.register("code", {
									valueAsNumber: true,
								})}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="description"
				render={({ field }: { field: any }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Textarea
								id="description"
								{...field}
								className="h-[200px]"
								value={field?.value}
							/>
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="file"
				render={({ field }: { field: any }) => (
					<FormItem>
						<FormLabel>File</FormLabel>
						<FormControl>
							<FileInputField field={field} isMultipleFiles={false} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	),
};

export function UploadForm({
	type,
	isMultipleFiles = false,
	isShowProgress = true,
	uploadFiles,
}: {
	type: UploadFormType;
	isMultipleFiles?: boolean;
	isShowProgress?: boolean;
	uploadFiles: (params: UploadFilesParams<any>) => Promise<void>;
}) {
	const formArgs = UPLOAD_FORM_BY_TYPE[type];

	return (
		<UploadFormWithFields
			{...formArgs}
			isMultipleFiles={isMultipleFiles}
			isShowProgress={isShowProgress}
			uploadFiles={uploadFiles}
		/>
	);
}

/**
 * We want to create sample form that can be easily customized
 * Naturally schema and fields component are highly coupled
 *
 */

export type UploadFormWithFieldsProps<S extends ZodType<any, any, any>> = {
	schema: S;
	defaultValues: any;
	isMultipleFiles?: boolean;
	isShowProgress?: boolean;
	createFormFields: (form: any) => React.ReactNode;
	uploadFiles: (params: UploadFilesParams<S>) => Promise<void>;
};

export function UploadFormWithFields<S extends ZodType<any, any, any>>({
	schema,
	defaultValues,
	isShowProgress = true,
	uploadFiles,
	createFormFields,
}: UploadFormWithFieldsProps<S>) {
	const [progress, setProgress] = React.useState({
		transferredBytes: 0,
		totalBytes: 0,
		percent: 0,
	});

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	function onSubmit(data: z.infer<typeof schema>) {
		// TODO replace with valid hook
		if (!data?.file) {
			return;
		}
		setProgress({
			transferredBytes: 0,
			totalBytes: 0,
			percent: 0.001,
		});

		const uploadProgressCallback = (data: DownloadProgress) => {
			setProgress(data);
		};
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});

		uploadFiles({ ...data, uploadProgressCallback } as any);
	}

	return (
		<Form {...form}>
			<div className="h-[800px]">
				<div className="pb-10">
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-[600px] space-y-6"
					>
						{createFormFields(form)}
						<Button type="submit" variant="outline">
							Submit
						</Button>
					</form>
				</div>
				<div>
					{isShowProgress && progress.percent > 0 && (
						<div>
							<span>
								{progress.percent === 1 ? "✅ Uploaded" : "Uploading..."}
							</span>
							<Progress value={progress.percent * 100} />
						</div>
					)}
				</div>
			</div>
		</Form>
	);
}
