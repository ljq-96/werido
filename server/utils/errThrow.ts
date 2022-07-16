export default function (flag: any, code: number, msg: string) {
  if (!!flag) throw new Error('123')
}
