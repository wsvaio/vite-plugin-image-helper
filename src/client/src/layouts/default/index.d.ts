export type Payload = {
	params: { name: string };
	fileInfo: Record<any, any>;
	show: boolean;
};
export type Actions = {
	打开抽屉: { fileInfo: { path: string; name: string } };
};
