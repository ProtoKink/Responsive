export class _String {
  static encode(string: string | object) {
    return LZString.compressToBase64(JSON.stringify(string));
  }

  static decode(string: string | undefined) {
    let d = LZString.decompressFromBase64(string as string);
    let data = {};

    try {
      let decoded = JSON.parse(d as string);
      data = decoded;
    } catch {}
    if (data) return data;
  }

  static shuffle(string: string[]) {
    let temp: string[] = JSON.parse(JSON.stringify(string));
    let ret: string[] = [];
    while (temp.length > 0) {
      let d = Math.floor(Math.random() * temp.length);
      ret.push(temp[d]);
      temp.splice(d, 1);
    }
    return ret;
  }
}
