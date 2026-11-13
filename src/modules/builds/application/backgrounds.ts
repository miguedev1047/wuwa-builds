export const BACKGROUNDS = [
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Activity/Activity28/HonamiStory/T_HonamiStoryLevelSelectBg3.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Activity/Activity28/HonamiStory/T_HonamiStoryLevelSelectBg4.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Loading/T_Bgloading03502.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Loading/T_Bgloading03503.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Loading/T_BgloadingBingyuan02.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Loading/T_BgloadingBingyuan06.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Loading/T_BgloadingLianxita05.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Loading/T_BgloadingLianxita06.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Loading/T_Dungeon_Linaxita04_UI.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/Loading/T_Dungeon_Linaxita016_UI.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/T_ActivityMapThemeHallBg30.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/T_BgloadinHeihaian10.webp?raw=true",
  "https://github.com/alt3ri/WW_Asset_Webp/blob/main/UIResources/Common/Image/BgCg/T_BgloadinHeihaian1.webp?raw=true",
]

/** Index of a random background, used to seed new builds. */
export function randomBackgroundIndex(): number {
  return Math.floor(Math.random() * BACKGROUNDS.length)
}
