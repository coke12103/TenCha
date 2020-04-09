# TenCha
2009年のTwitterへの夢と軽量クライアントの夢でできたMisskeyクライアント

# 特徴
## いにしえより続くGUI
より多くの情報が表示でき、コンパクトで、それでいて軽い。
## 最高に謎な謎機能
ランダム公開範囲や投稿する度に変わるプレースホルダーなど様々な謎機能を搭載。
## 様々な環境に対応
Misskey v11、Misskey v12だけではなくMisskey v10(m544)に対応。

# 要件
これらはソースコードを動かす場合のみに必要でバイナリ版では不要です。
## Node.js
`v12.13.0`で開発しているのでそれ以降推奨。
## npm
## CMake
3.1以上
## Make, GCC v7

# 動かし方
1. `npm i`
2. `npm start`

# ビルド方法
1. `npm i`
2. `npx nodegui-packer --init TenCha`
3. `npx nodegui-packer --pack ./dist`

# 初期化
ログインすると生成される`config.json`を削除してください

# 連絡先
- Twitter: coke12103
- Misskey: c0_ke@misskey.dev
