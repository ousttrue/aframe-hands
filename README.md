# aframe-hands

A-Frame Hand-Tracking practice.

## memo

html と javascript を直書きの方針。

- なるべく JSDoc を書いて tsserver の恩恵が受けられるようにする
- public を gh-pages に展開する

## TODO

- [ ] hand-tracking pinch
- [ ] anchor
- [ ] mr occlusion
- [ ] room scale bounds
- [ ] navigation link to copy of [aframe samples](https://github.com/aframevr/aframe/tree/master/examples/showcase)
- [ ] navigation link to copy of [immersive web samples](https://immersive-web.github.io/webxr-samples/)
- [ ] hover
- [ ] pinch
- [ ] constraint
- [ ] snap

### immersive navigation
- [Meta Quest Browserにnavigationが“標準実装”されたのでWebXRでVRモードのまま遷移できるようになりました](https://zenn.dev/ikkou/articles/fe5b177a53c078)

## https

https で host  する。

```
> mkcert LOCAL_IP
> http-server -c-1 . --ssl --key LOCAL_IP-key.pem --cert LOCAL_IP.pem
```

- https://github.com/FiloSottile/mkcert

