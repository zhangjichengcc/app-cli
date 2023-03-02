import BasicGenerator from '../../Generator.js';
import path from 'node:path';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Generator extends BasicGenerator {

  constructor(opts) {
    super(opts);
    this.sourcePath = `${__dirname}/template`;
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