import { Context, Schema } from 'koishi'

export const name = 'fei-nin'

export interface Config {
    enableReplace: boolean,
    replace: Record<string, string>,
    enableShutUp: boolean,
    shutUp: Record<string, string>,

}

export const Config: Schema<Config> = Schema.object({
    enableReplace: Schema.boolean().role('switch').description('是否开启替换').default(true),
    replace: Schema.dict(String).role('table').description('替换词列表').default({'你':'您','您们':'您几位'}),
    enableShutUp: Schema.boolean().role('switch').description('开启后，在bot提及对应关键词时完全替换回复内容').default(false),
    shutUp: Schema.dict(String).role('table').description('屏蔽词列表').default({'瑟瑟':'不可以瑟瑟！'}),
})

export let usage:string = `把bot输出的你改成您<hr>
声明：<br>
回复的替换可能会给你的部分插件带来非预期的效果<br>
由于before-send事件无法判断来源的指令<br>
因此无法根据你的插件/指令分别选择是否开启

请酌情选择是否开启本插件<hr>
关键词的替换将按照顺序依次进行<br>
附加的屏蔽功能将在bot提及关键词时完全替换回复内容`;

export function apply(ctx: Context, config: Config) {
    const exmapleKey = Object.keys(config.replace)[0] ?? '...';
    const exmapleValue = config.replace[exmapleKey] ?? '...';
    ctx.on('ready', ()=> {
      usage = `把bot输出的${exmapleKey}改成${exmapleValue}` +
      replace(`<hr>声明：<br>
回复的替换可能会给你的部分插件带来非预期的效果<br>
由于before-send事件无法判断来源的指令<br>
因此无法根据你的插件/指令分别选择是否开启

请酌情选择是否开启本插件<hr>
关键词的替换将按照顺序依次进行<br>
附加的屏蔽功能将在bot提及关键词时完全替换回复内容`)
    })

    function replace(msg: string): string{
        for(let key in config.replace){
            msg = msg.replace(new RegExp(key,'g'),config.replace[key])
        }
        return msg;
    }

    function shutUp(msg: string): string{
        for(let key in config.shutUp){
            if(new RegExp(key).test(msg)){
                msg = config.shutUp[key];
            }
        }
        return msg;
    }

    ctx.before('send', (session) => {
        if(config.enableReplace){
            session.content = replace(session.content);
        }
        if(config.enableShutUp){
            session.content = shutUp(session.content);
        }
    })
}
