import { Context, Schema } from 'koishi';
export declare const name = "fei-nin";
export interface Config {
    enableReplace: boolean;
    replace: Record<string, string>;
    enableShutUp: boolean;
    shutUp: Record<string, string>;
}
export declare const Config: Schema<Config>;
export declare let usage: string;
export declare function apply(ctx: Context, config: Config): void;
