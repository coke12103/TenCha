# TenCha
2009年のTwitterへの夢と軽量クライアントの夢でできたMisskeyクライアント

## 特徴
### いにしえより続くGUI
より多くの情報が表示でき、コンパクトで、それでいて軽い。
### 最高に謎な謎機能
ランダム公開範囲や投稿する度に変わるプレースホルダーなど様々な謎機能を搭載。Misskey v12から削除されてしまったランダム絵文字(通称フグパンチ)も装備。
### 強力なNG機能
特定のドメインからの投稿を表示しなくなるNGドメイン、単語や正規表現で指定したワードを含む投稿を表示しなくなるNGワード、ユーザーをIDの完全一致また正規表現で指定し表示しなくなるNGユーザー、指定した単語を特定の単語に置換する置換ミュートを搭載。
### タブを自由に定義
カスタムタブを利用すれば、特定の内容のみを抽出したタイムラインをいくつでも定義することができます。
### 様々な環境に対応
Misskey v11、Misskey v12だけではなくMisskey v10(m544)に対応。

## 要件
これらはソースコードを動かす場合のみに必要でバイナリ版では不要です。
### Node.js
`v12.13.0`で開発しているのでそれ以降推奨。
### Npm
### CMake
3.1以上
### Make, GCC v7

## 動かし方
1. `npm i`
2. `npm start`

## ビルド方法
1. `npm i`
2. `npm run build`
3. `npx nodegui-packer --init TenCha`
4. `npx nodegui-packer --pack ./dist`

## 初期化
- `config.json`
  - ログインすると生成されるログイン情報
- `tabs.json`
  - 現在のタブ情報
- `tmp/`
  - 絵文字キャッシュ
- `settings.json`
  - 設定ファイル
- `domain_blocks.json`
  - ミュートするドメインの一覧
- `word_blocks.json`
  - ミュートする単語の一覧
- `user_id_blocks.json`
  - ミュートするユーザーの一覧
- `replace_blocks.json`
  - 置換ミュートの設定
- `user_contents/`
  - 閲覧した添付ファイルのキャッシュ
- `content_settings.json`
  - 各種添付ファイルの種類ごとに呼び出されるアプリケーションの設定

上記ファイルをすべて削除してください

## 設定
- `use_emojis`
  - 不安定な絵文字の実装を使うか
- `use_desktop_notification`
  - デスクトップ通知を利用するか
- `post_cache_limit`
  - 投稿キャッシュの上限
- `post_cache_clear_count`
  - キャッシュ開放処理1回につき何件処理するか
- `font`
  - フォント変更機能。フォント名を指定する。

## 連絡先
- Twitter: [coke12103](https://twitter.com/@coke12103)
- Misskey: [c0_ke@misskey.dev](https://misskey.dev/@c0_ke)
