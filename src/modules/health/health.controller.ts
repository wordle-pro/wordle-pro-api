
export const getHealthHandler = async () => {
  return { 
		commit: process.env.COMMIT_HASH || 'development',
		status: 'online'
	};
};