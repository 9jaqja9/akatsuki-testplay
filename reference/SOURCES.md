# 参考画面の元データ

- 戦闘絵の原本: `assets/battle-playable/stage.webp` (`battle/playable.html` / ユーザー提供 `akatsuki_visual_battle_playable.html` から抽出)。
- 比較用テンプレート: `assets/battle-v9/stage.png` (`battle/effect-target-v9.html` から参照)。
- 今回の参考絵: `assets/battle-reference/stage.png`。上記原本から作った参考絵を画像編集し、背景を伊賀の山中に変更。味方を左から「あやめ・家康・半蔵」、敵を「忍び3人、左馬之助、その後方の雪姫」に配置しています。原本そのものではありません。個別キャラのスプライトには分離していません。
- あやめの巨大手裏剣「飛燕」: 既存の武器カード `assets/004_c60caa07d.png` の、中央の環と四枚の湾曲した刃・黒金の装飾をデザイン参照。
- 家康: 既存の `assets/011_bb37a6d74.webp` の顔、緑と金の装束をデザイン参照。
- 左馬之助・雪姫・忍びのデザイン参照: `assets/012_f81fdb814.webp`、`016_e2b459444.webp`、`006_39739c7e4.png`。
- 斬撃・雷撃: `battle/effect-target-v9.html` のCanvas実装を `battle-effects.js` に再利用。命中位置と表示ラベルのみ変更し、ダメージ数値は表示しません。雷・粒子テクスチャは `assets/battle-v9/` の原物を参照します。
- 会話欄の顔画像: 既存 `assets/` の半蔵・あやめ・左馬之助・雪姫を参照。

会話5行は配置・演出確認用。本編の本文や戦闘接続は変更していません。
