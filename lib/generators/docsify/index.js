import BasicGenerator from '../../Generator.js';
import path from 'node:path';
import chalk from "chalk";
import logSymbols from "log-symbols";
import ora from 'ora';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Generator extends BasicGenerator {

  constructor(opts) {
    super(opts);
    this.sourcePath = `${__dirname}/template`;
  }

  async beforeFinished() {
    const spinner = ora("dependency installing...");
    spinner.start();
    try {
      await this.execSync('npm i docsify-cli -g', { cwd: this.targetPath });
      spinner.succeed("dependency installed");
    } catch(err) {
      spinner.warn(chalk.yellow('docsify-cli install failed'));
      console.log(logSymbols.info, chalk.blue(`please run 'npm i docsify-cli -g' to install`));
    }
  }
   
  async prompting() {
    /**
     * @type {import('inquirer').QuestionCollection}
     */
    const prompts = [
      {
        name: 'name',
        message: `What's your doc's name?`,
        default: this.targetPath,
      },
      {
        name: 'description',
        message: `What's your doc's description?`,
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
    ];
    return this.prompt(prompts).then(props => {
      const { name, description, mail, author, version, ...others } = props;
      this.prompts = others;
      this.package = {
        name,
        description,
        mail,
        author,
        version
      }
    })
  }
}

export default Generator;