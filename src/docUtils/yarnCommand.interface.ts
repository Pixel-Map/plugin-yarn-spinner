import { YarnParameterInterface } from './yarnParameter.interface';

export interface YarnCommandInterface {
  YarnName: string;
  DefinitionName: string;
  Documentation: string;
  Signature: string;
  Language: string;
  Parameters: YarnParameterInterface[];
}
