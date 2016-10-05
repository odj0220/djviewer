# Dj Viewer

Image 파일을 HTML 상에서 실행하는 뷰어 입니다.

## Installation

```
bower install djviewer --save
```

### djViewer.init()

djViewer 를 사용할 수 있는 형태로 실행하는 명령어 입니다.

```js
djViewer.init();
```

### djViewer.list

djViewer 목록에 이미지를 추가합니다. Array 형태로 추가하며 고유코드, 이미지경로, 썸네일경로를 이용하여 등록합니다.

```js
djViewer.list = [
    {code: '0fIACXzBA2j2eaj7GKJ4', src: 'image/0fIACXzBA2j2eaj7GKJ4.jpg', thumb: 'image/thumb/0fIACXzBA2j2eaj7GKJ4.jpg'},
    {code: '0Q314Hk08RPPhYcWeXvW', src: 'image/0Q314Hk08RPPhYcWeXvW.jpg', thumb: 'image/thumb/0Q314Hk08RPPhYcWeXvW.jpg'},
    {code: '0V8pgGAsMWfcSHGSyLfx', src: 'image/0V8pgGAsMWfcSHGSyLfx.jpg', thumb: 'image/thumb/0V8pgGAsMWfcSHGSyLfx.jpg'},
    {code: '1Dy5J8bYNKvYwKu7OwJN', src: 'image/1Dy5J8bYNKvYwKu7OwJN.jpg', thumb: 'image/thumb/1Dy5J8bYNKvYwKu7OwJN.jpg'}
];
```

### djViewer.load()

djViewer 의 목록을 갱신 합니다. (목록을 추가했는데 나타나지 않거나 변경 내용이 적용되지 않을때 사용, HTML에 업데이트 되지만 display 되지 않음)

```js
djViewer.load();
```

### djViewer.view(code)

djViewer가 HTML상에 나타나도록 실행하는 명령어 입니다. list에 있는 code를 입력하여 해당 이미지를 실행 합니다.

```js
djViewer.view('0fIACXzBA2j2eaj7GKJ4');
```