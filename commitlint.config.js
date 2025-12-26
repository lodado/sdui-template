module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0], // 대문자/소문자 제한 제거
    'body-max-line-length': [0], // body 줄 길이 제한 제거
  },
}
