interface EnvVariables {
  VITE_WS_URL: string;
  VITE_API_URL: string;
  VITE_DEBUG_MODE: string;
}

const env: EnvVariables = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE,
  VITE_WS_URL: import.meta.env.VITE_WS_URL,
};

export default env;
