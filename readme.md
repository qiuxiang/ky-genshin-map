# 空荧酒馆原神地图

超级丝滑的原神地图，数据来源：[空荧酒馆](https://yuanshen.site/docs/)。

在线链接：

- https://qiuxiang.github.io/ky-genshin-map/ (github pages)
- https://ky-genshin-map-1253179036.cos-website.ap-nanjing.myqcloud.com (腾讯云 COS)

![图片](https://github.com/qiuxiang/ky-genshin-map/assets/1709072/2ea4b8e7-1978-4b95-a353-cc712a01b21e)

### 移动端适配

在手机浏览器也能保证流畅体验。

https://github.com/qiuxiang/ky-genshin-map/assets/1709072/193c2ed9-2cce-44d5-9fbe-5979c6a9a0f1

## 构建

```bash
# 初始化
pnpm run init

# 开发
pnpm run dev

# 编译
pnpm run build
```

## TODO

- [x] 和原神内置的分层地图一样，对同层的点位特别标记
- [ ] 完善各地区/子地区地名显示
- [x] 存档数据导入/导出
