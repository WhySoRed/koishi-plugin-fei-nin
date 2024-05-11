"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.usage = exports.Config = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = 'fei-nin';
exports.Config = koishi_1.Schema.object({
    enableReplace: koishi_1.Schema.boolean().role('switch').description('是否开启替换').default(true),
    replace: koishi_1.Schema.dict(String).role('table').description('替换词列表').default({ '你': '您', '您们': '您几位' }),
    enableShutUp: koishi_1.Schema.boolean().role('switch').description('开启后，在bot提及对应关键词时完全替换回复内容').default(false),
    shutUp: koishi_1.Schema.dict(String).role('table').description('屏蔽词列表').default({ '瑟瑟': '不可以瑟瑟！' }),
});
exports.usage = `把bot输出的你改成您<hr>
声明：<br>
回复的替换可能会给你的部分插件带来非预期的效果<br>
由于before-send事件无法判断来源的指令<br>
因此无法根据你的插件/指令分别选择是否开启

请酌情选择是否开启本插件<hr>
关键词的替换将按照顺序依次进行<br>
附加的屏蔽功能将在bot提及关键词时完全替换回复内容`;
function apply(ctx, config) {
    const exmapleKey = Object.keys(config.replace)[0] ?? '...';
    const exmapleValue = config.replace[exmapleKey] ?? '...';
    ctx.on('ready', () => {
        exports.usage = `把bot输出的${exmapleKey}改成${exmapleValue}` +
            replace(`<hr>声明：<br>
回复的替换可能会给你的部分插件带来非预期的效果<br>
由于before-send事件无法判断来源的指令<br>
因此无法根据你的插件/指令分别选择是否开启

请酌情选择是否开启本插件<hr>
关键词的替换将按照顺序依次进行<br>
附加的屏蔽功能将在bot提及关键词时完全替换回复内容`);
    });
    function replace(msg) {
        for (let key in config.replace) {
            msg = msg.replace(new RegExp(key, 'g'), config.replace[key]);
        }
        return msg;
    }
    function shutUp(msg) {
        for (let key in config.shutUp) {
            if (new RegExp(key).test(msg)) {
                msg = config.shutUp[key];
            }
        }
        return msg;
    }
    ctx.before('send', (session) => {
        if (config.enableReplace) {
            session.content = replace(session.content);
        }
        if (config.enableShutUp) {
            session.content = shutUp(session.content);
        }
    });
}
exports.apply = apply;
