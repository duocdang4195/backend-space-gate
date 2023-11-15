export enum ENVIRONMENT {
  DEV = 'dev',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export const IS_DEV = process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION;
