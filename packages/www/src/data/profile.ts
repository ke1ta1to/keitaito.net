export interface Profile {
  name: string;
  name_en: string;
  birthday: Date;
  location: string;
  school: string;
  x: string;
  github: string;
  zenn: string;
  qiita: string;
}

export const profile: Profile = {
  name: "伊藤啓太",
  name_en: "Keita Ito",
  birthday: new Date("2004-07-09"),
  location: "Tokyo, Japan",
  school: "電気通信大学\n情報理工学域 I類\nメディア情報学プログラム",
  x: "https://x.com/ke1ta1to",
  github: "https://github.com/ke1ta1to",
  zenn: "https://zenn.dev/kk79it",
  qiita: "https://qiita.com/ke1ta1to",
};
