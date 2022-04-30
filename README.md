![フィールド画像](/docs/image/sample-view.png)

microCMS の[外部データ連携（iframe フィールド）](https://document.microcms.io/manual/iframe-field)用に作成した「**住所入力フィールド**」です。<br />
[注意事項](#注意事項)をお読みの上ご利用ください。

DEMO: [https://tsuki-lab.github.io/microcms-iframe-address/](https://tsuki-lab.github.io/microcms-iframe-address/)

# 機能仕様

- **住所検索機能**<br />
[zipcloud｜郵便番号検索API](http://zipcloud.ibsnet.co.jp/) を用いて入力された郵便番号を元に住所を検索・自動入力します。

- **入力値のフィードバック**<br />
インラインフレームフィールドから入力フィールドに入力した値は、常にmicroCMSにフィードバックされます。<br />
入力した内容はmicroCMS管理画面にて「下書き保存」または、「公開」を押下することでコンテンツとして保存されます。

## レスポンス
```json
  {
    "zip": "郵便番号",
    "address1": "住所1",
    "address2": "住所2"
  }
```

# 設定方法

## 1. API スキーマ設定

[API スキーマ設定](https://document.microcms.io/manual/api-model-settings)を元に設定を進めます。
入力フォームの種類に**インラインフレーム**を選択します。

## 2. インラインフレーム設定

インラインフレーム詳細設定画面、**iframe URL**に [https://tsuki-lab.github.io/microcms-iframe-address/](https://tsuki-lab.github.io/microcms-iframe-address/) を入力します。

API の設定を保存することで利用可能になります。

![インラインフレーム設定画面](/docs/image/inline-frame-setting.png)

# 注意事項

※ この URL の入力フォームは予告なく内容が更新される場合がありますので、ご注意ください。<br />
※ このソースコードはオープンソースにて公開しています。自由にカスタマイズの上、任意のサービスにデプロイしてご利用いただくことができます。<br />
※ この入力フィールドを利用して発生した不具合については、自己責任にてお願いいたします。

# 問い合わせ先

[@hanetsuki_dev｜Twitter](https://twitter.com/hanetsuki_dev)