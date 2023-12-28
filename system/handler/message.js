/* 
* Create By Arifzyn. 
* github : https://github.com/ArifzynXD
* WhatsApp : wa.me/6288213503541
* No Hapus, Walupun Copas Yang Penting Jadi Puh
*/
import('../index.js');
import config from '../../config.js';

import fs from 'fs';
import path from 'path';
import util from 'util';
import moment from 'moment-timezone';
import chalk from "chalk";
import Database from '../lib/localdb.js';
import Function from '../lib/function.js';
import { fileURLToPath } from "url";
import { createRequire } from "module";

const dbPath = "system/temp/database.json"
const database = new Database(dbPath)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

database.connect().catch(() => database.connect());
setInterval(async () => {
	fs.writeFileSync(dbPath, JSON.stringify(global.db, null, 3));
}, 3 * 1000);

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in config.APIs ? config.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: config.APIKeys[name in config.APIs ? config.APIs[name] : name] } : {}) })) : '')
global.Func = Function
global.config = config
global.__dirname = __dirname
global.require = require

export const Message = async (conn, m, store) => {
	try {
		if (!m) return;
		m.exp = 0
		if (!config.options.public && !m.isOwner) return
        if (m.from && global.db.chats[m.from]?.mute && !m.isOwner) return
        if (m.isBaileys) return
        m.exp += Math.ceil(Math.random() * 10)
        
		const prefix = (m.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_|~!?@#%^&.©^]/gi.test(m.body) ? m.body.match(/^[°•π÷×¶∆£¢€¥®™+✓_|~!?@#%^&.©^]/gi)[0]: "");
		const cmd = (m.cmd = m.body && m.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase());
		const plugin = (m.command = plugins.get(cmd) || plugins.find((v) => v?.default.command && v.default.command.includes(cmd)));
		const quoted = m.quoted ? m.quoted : m;
		const today = moment.tz("Asia/Jakarta").format("dddd, DD MMMM YYYY");
  
		global.store = store 
		
		let user 
		if (m) {
			await (await import("../lib/database.js")).idb(m);
      if (config.options.autoread) {
      await conn.readMessages([m.key]).catch(() => { })
      }
    
			console.log(`📨 Message Info`);
			console.log(chalk.black(chalk.bgWhite(!m.cmd ? "" : "-")), 
			chalk.black(chalk.bgGreen(today) + "\n"),

chalk.black(chalk.bgYellow("[CMD]:")),			chalk.black(chalk.bgBlue(m.body || m.mtype)) +
			"\n" +
			chalk.cyan("- From : "),
			chalk.cyan(m.pushName),
			chalk.cyan("- In : "),
      chalk.cyan(m.from),
      chalk.cyan("- Message ID : "),
      chalk.cyan(m.key.id),
			chalk.blue(m.isGroup ? m.pushName : "Private Chat", m.from),
          );
          if (m.sender && (user = db.users[m.sender])) {
				user.exp += m.exp
			}
		}
		
        if (m.isGroup) {
        	if (global.db.chats[m.from].banned && !m.isOwner) return
    	}
    
		if (plugin) {
			if (!prefix && plugin.default.noPrefix) {
				if (plugin.default.owner && !m.isOwner) {
					return m.reply(config.msg.owner);
                }
                if (plugin.default.group && !m.isGroup) {
                	return msg.reply(config.msg.group);
                }
                if (plugin.default.private && m.isGroup) {
                	return m.reply(config.msg.private);
                }
                if (plugin.default.botAdmin && !m.isBotAdmin) {
                	return m.reply(config.msg.botAdmin);
                }
                if (plugin.default.admin && !m.isAdmin) {
                	return m.reply(config.msg.admin);
                } 
                if (plugin.default.bot && m.fromMe) {
                	return m.reply(config.msg.bot);
                }
                if (plugin.default.premium && !m.isPremium) {
                	return m.reply(config.msg.premium);
                }
                if (plugin.default.use && !m.text) {
                	return m.reply(plugin.default.use.replace(/%prefix/gi, prefix).replace(/%command/gi, plugin.default.name).replace(/%text/gi, m.text));
                }
                
                plugin.default.run(m, { conn, command: cmd, quoted, prefix, plugins })
                ?.then((a) => a)
				?.catch((err) => {
					let text = util.format(err);
					m.reply(`*Error Plugins*\n\n*- Name :* ${cmd}\n*- Sender :* ${m.sender.split`@`[0]} (@${m.sender.split`@`[0]})\n*- Time :* ${moment(m.timestamp * 1000).tz("Asia/Jakarta",)}\n*- Log :*\n\n${text}`, { mentions: [m.sender] });
                });
            }
    
			if (!!prefix && m.body.startsWith(prefix)) {
				if (plugin.default.owner && !m.isOwner) {
					return m.reply(config.msg.owner);
                }
                if (plugin.default.group && !m.isGroup) {
                	return m.reply(config.msg.group);
                }
                if (plugin.default.private && m.isGroup) {
                	return m.reply(config.msg.private);
                }
                if (plugin.default.admin && !m.isAdmin) {
                	return m.reply(config.msg.admin);
                } 
                if (plugin.default.botAdmin && !m.isBotAdmin) {
                	return m.reply(config.msg.botAdmin);
                }
                if (plugin.default.bot && m.fromMe) {
                	return m.reply(config.msg.bot);
                }
                if (plugin.default.premium && !m.isPremium) {
                	return m.reply(config.msg.premium);
                }
                if (plugin.default.use && !m.text) {
                	return m.reply(plugin.default.use.replace(/%prefix/gi, prefix).replace(/%command/gi, plugin.default.name).replace(/%text/gi, m.text));
                }
                
				plugin.default.run(m, { conn, command: cmd, quoted, prefix, plugins })
				?.then((a) => a)
				?.catch((err) => {
					let text = util.format(err);
					m.reply(`*Error Plugins*\n\n*- Name :* ${cmd}\n*- Sender :* ${m.sender.split`@`[0]} (@${m.sender.split`@`[0]})\n*- Time :* ${moment(m.timestamp * 1000).tz("Asia/Jakarta",)}\n*- Log :*\n\n${text}`, { mentions: [m.sender] });
                });
			}
		}
		
		if (!plugin) {
			const dir = "plugins/_function";
			const files = fs.readdirSync(dir).filter((file) => file.endsWith(".js"));
			if (files.length === 0) return;
			for (const file of files) {
				const load = await import(`../../${dir}/${file}`)
				load.default(m, {
					conn,
					quoted,
					prefix,
					plugins,
					command: cmd,
                });
			}
        }
	} catch (e) {
		console.error(e);
    }
};

export const readCommands = async (pathname = "plugins") => {
  try {
    const dir = "plugins";
    const dirs = fs.readdirSync(dir);
    dirs
      .filter((a) => a !== "_function")
      .map(async (res) => {
        let files = fs
          .readdirSync(`${dir}/${res}`)
          .filter((file) => file.endsWith(".js"));
        for (const file of files) {
          const names = `${pathname}/${res}/${file}`	
          const plugin = await import(
            `../../${pathname}/${res}/${file}?update=${Date.now()}`
          );
          if (!plugin.default?.tags) return;
          plugins.set(names, plugin);
        }
      });
  } catch (e) {
    console.error(e);
  }
};


config.reloadFile(import.meta.url)