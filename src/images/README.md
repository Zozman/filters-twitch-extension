# Images

## Filters

Filters image purchased from [The Noun Project](https://thenounproject.com/icon/video-effect-3554427/).

## Demos

`mp4` files were converted to `webp` using the following `ffmpeg` command based on [this guide](https://gist.github.com/witmin/1edf926c2886d5c8d9b264d70baf7379):

```
ffmpeg -i input_filename.mp4 -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 1920:1080 output_filename.webp
```