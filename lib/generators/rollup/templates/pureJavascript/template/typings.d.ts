
declare module 'rollup-plugin-clear';

declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}