const languageMap = {
    'Chinese': 'zh-CN',
    'English': 'en-US',
    'Japanese': 'ja-JP',
    'Korean': 'ko-KR',
    'Spanish': 'es-ES',
    'Franch': 'fr-FR',
    'German': 'de-DE'
}

const getLanguageCode = (languageName) => {
    return languageMap[languageName] || 'en';
}

export { getLanguageCode };