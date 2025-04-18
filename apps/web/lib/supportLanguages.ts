export const supportLanguages: [string, string][] = [
  ['en', 'English'],
  ['zh-CN', '简体中文'],
  ['ja', '日本語'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['ru', 'Русский'],
  ['ko', '한국어'],
  ['es', 'Español'],
  ['it', 'Italiano'],
  ['pt', 'Português'],
  ['nl', 'Nederlands'],
  ['pl', 'Polski'],
  ['ar', 'العربية'],
  ['af', 'Afrikaans'],
  ['am', 'አማርኛ'],
  ['az', 'Azərbaycan'],
  ['be', 'Беларуская'],
  ['bg', 'Български'],
  ['bn', 'বাংলা'],
  ['bs', 'Bosanski'],
  ['ca', 'Català'],
  ['ceb', 'Cebuano'],
  ['co', 'Corsu'],
  ['cs', 'Čeština'],
  ['cy', 'Cymraeg'],
  ['da', 'Dansk'],
  ['el', 'Ελληνικά'],
  ['eo', 'Esperanto'],
  ['et', 'Eesti'],
  ['eu', 'Euskara'],
  ['fa', 'فارسی'],
  ['fi', 'Suomi'],
  ['fj', 'Fijian'],
  ['fy', 'Frysk'],
  ['ga', 'Gaeilge'],
  ['gd', 'Gàidhlig'],
  ['gl', 'Galego'],
  ['gu', 'ગુજરાતી'],
  ['ha', 'Hausa'],
  ['haw', 'Hawaiʻi'],
  ['he', 'עברית'],
  ['hi', 'हिन्दी'],
  ['hr', 'Hrvatski'],
  ['ht', 'Kreyòl Ayisyen'],
  ['hu', 'Magyar'],
  ['hy', 'Հայերեն'],
  ['id', 'Bahasa Indonesia'],
  ['ig', 'Igbo'],
  ['is', 'Íslenska'],
  ['jw', 'Jawa'],
  ['ka', 'ქართული'],
  ['kk', 'Қазақ'],
  ['mn', 'Монгол хэл'],
  ['tr', 'Türkçe'],
  ['ug', 'ئۇيغۇر تىلى'],
  ['uk', 'Українська'],
  ['ur', 'اردو'],
  ['vi', 'Tiếng Việt'],
  ['zh-TW', '繁體中文'],
]

export const langMap: Map<string, string> = new Map(supportLanguages)

export const langMapReverse = new Map(
  supportLanguages.map(([standardLang, lang]) => [lang, standardLang]),
)

export const langs = supportLanguages.map(([lang]) => lang)
