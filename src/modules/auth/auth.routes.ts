import { type FastifyInstance, type FastifyError } from 'fastify';
import {
	SignupBodySchema,
	SignupSuccessResponseSchema,
	ErrorResponseSchema,
	type SignupBodyInput,
} from './auth.schema';
import { signupHandler } from './auth.controller';

const authRoutes = async (fastify: FastifyInstance) => {
		
		fastify.setErrorHandler((error: FastifyError, request, reply) => {

		if (error.validation) {
			console.log('error.validation start');
			console.dir(error.validation);
			console.log('error.validation end');

			const firstErr = error.validation[0];
			const field = firstErr?.instancePath.replace('/', '') || firstErr?.params?.missingProperty;

			let customMessage = 'Invalid request payload';
			
			if (field === 'email') {
				customMessage = 'Invalid email address format';
			} else if (field === 'password') {
				customMessage = 'Password must meet requirements';
			} else if (field === 'username') {
				customMessage = 'Username must be 3-20 characters';
			}

			return reply.status(400).send({ error: customMessage });
		}

		// Pass through unhandled errors
		return reply.send(error);
	});

	fastify.post<{ Body: SignupBodyInput }>(
		'/signup',
		{
			schema: {
				body: SignupBodySchema,
				response: {
					201: SignupSuccessResponseSchema,
					400: ErrorResponseSchema,
					409: ErrorResponseSchema,
					500: ErrorResponseSchema,
				},
			},
		},
		signupHandler
	);
};

export default authRoutes;