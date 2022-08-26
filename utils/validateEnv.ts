const validateEnv = (description: string, envVariable?: string) => {
  if (!envVariable) {
    console.error(`The Environment Variable ${description} does not exist`);
    process.exit(1);
  } else {
    return envVariable;
  }
};

export default validateEnv;
