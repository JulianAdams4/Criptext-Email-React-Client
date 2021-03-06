export const CustomError = params => {
  const customError = new Error();
  customError.name = params.name || 'Error';
  customError.message =
    params.message || params.description || 'Error creating user';
  return customError;
};
