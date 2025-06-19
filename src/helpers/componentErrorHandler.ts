import {InlineError} from '@types/generalType';

const errors: any = [];
export const setInlineError = (error: InlineError) => {
  if (error.type) {
    errors.push(error);
    return errors;
  }
};

export const getInlineError = (type: string) => {
  const res: InlineError[] = errors;
  return {
    hasError: res.filter(el => el.type === type)[0] ? true : false,
    message: res.filter(el => el.type === type)[0]?.message,
  };
};
