import BasicGenerator from '../../Generator.js';


class Generator extends BasicGenerator {

  constructor(opts) {
    super(opts);
    this.githubRepo = 'https://github.com/zhangjichengcc/app-cli_rollup.git';
  }
  
  /**
   * @description: 生成问答
   * @return {*}
   */  
  async prompting() {
    const prompts = [
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
        name: 'isTypeScript',
        type: 'list',
        message: 'Select the development language',
        choices: [
          {
            name: 'TypeScript',
            value: true,
          },
          {
            name: 'JavaScript',
            value: false,
          },
        ],
        default: true,
      },
    ];
    const props = await this.prompt(prompts);
    this.prompts = props;
  }

  // lang: ts || js
  // isUIFiles(file, lang) {
  //   const uiFile = lang === 'ts' ? 'ui/index.tsx' : 'ui/index.jsx';
  //   return file === uiFile;
  // }

  // writing() {
  //   this.writeFiles({
  //     context: this.prompts,
  //     filterFiles: f => {
  //       const { isTypeScript = true, withUmiUI } = this.prompts;
  //       if (isTypeScript) {
  //         if (f.endsWith('.js') || f.endsWith('.jsx')) return false;
  //         // filter ui files
  //         if (!withUmiUI && this.isUIFiles(f, 'ts')) return false;
  //       } else {
  //         if (this.isTsFile(f)) return false;
  //         // filter ui files
  //         if (!withUmiUI && this.isUIFiles(f)) return false;
  //       }
  //       return true;
  //     },
  //   });
  // }
}

export default Generator;