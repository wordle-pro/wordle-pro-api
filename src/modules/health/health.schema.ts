import { Type, type Static } from '@sinclair/typebox';

export const HealthResponseSchema = Type.Object({
	commit: Type.String(),
	status: Type.Const('online')
});
