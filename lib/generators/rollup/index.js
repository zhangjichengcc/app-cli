import BasicGenerator from '../../Generator.js';
import fs from 'node:fs';
import ora from 'ora';
import logSymbols from 'log-symbols';
import chalk from "chalk";
import path from 'node:path';
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Generator extends BasicGenerator {

  constructor(opts) {
    super(opts);
    this.sourcePath = `${__dirname}/templates`;
  }

  async beforeFinished() {
    const spinner = ora("dependency installing...");
    spinner.start();
    try {
      const stdoutList = await this.execSync('pnpm install', { cwd: this.targetPath });
      spinner.succeed("dependency installed");
      stdoutList.forEach(stdout => console.log(chalk.gray(stdout)));
    } catch(err) {
      spinner.warn(chalk.yellow('dependency install failed'));
      console.log(logSymbols.info, chalk.blue(`please run 'pnpm install' to install`));
    }
  }
   
  async prompting() {

    const templates = fs
      .readdirSync(this.sourcePath)
      .filter((f) => !f.startsWith('.'))
      .map((f) => {
        return {
          name: `${f.padEnd(15)} - ${chalk.gray(require(`./templates/${f}/meta.json`).description)}`,
          value: f,
          short: f,
        };
      });

    /**
     * @type {import('inquirer').QuestionCollection}
     */
    const prompts = [
      {
        name: 'template',
        message: `Select the template you use`,
        type: 'list',
        choices: templates
      },
      {
        name: 'name',
        message: `What's your plugin's name?`,
        default: this.targetPath,
      },
      {
        name: 'description',
        message: `What's your plugin used for?`,
      },
      {
        name: 'mail',
        message: `What's your email?`,
      },
      {
        name: 'author',
        message: `What's your name?`,
      },
      {
        name: 'version',
        message: `Please enter the version number`,
        default: 'v0.0.1',
      }
      // {
      //   name: 'isTypeScript',
      //   type: 'list',
      //   message: 'Select the development language',
      //   choices: [
      //     {
      //       name: 'TypeScript',
      //       value: true,
      //     },
      //     {
      //       name: 'JavaScript',
      //       value: false,
      //     },
      //   ],
      //   default: true,
      // },
    ];
    return this.prompt(prompts).then(props => {
      const { name, template, description, mail, author, version, ...others } = props;
      this.prompts = others;
      this.package = {
        name,
        template,
        description,
        mail,
        author,
        version
      }
      this.sourcePath = `${this.sourcePath}/${template}/template`;
    })
  }
}

export default Generator;