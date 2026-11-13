# CÚ NHÍ – Kho trò chơi giáo dục số

## 1. Chạy chương trình
- Giải nén toàn bộ thư mục.
- Mở `index.html` bằng Chrome hoặc Edge.
- Có thể kết nối máy tính với TV qua HDMI rồi nhấn **Toàn màn hình**.
- Phím tắt `F` bật/tắt toàn màn hình; phím `Esc` thoát toàn màn hình theo cơ chế trình duyệt.
- Nếu trình duyệt chặn fullscreen khi mở file trực tiếp, bấm nút Toàn màn hình sau khi trang đã tải.

## 2. Cấu trúc thư mục
```
CuNhi_KhoTroChoi/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── data.js
│   └── games/
│       └── games.js
├── assets/
│   ├── images/
│   └── audio/
└── games/
    └── external/
```

## 3. Thêm một trò chơi mới vào chủ đề
Mở `js/data.js`, thêm một đối tượng vào mảng `games`:
```js
{
  id: "be-tim-do-vat",
  topic: "nhanbiet",
  title: "Bé tìm đồ vật",
  desc: "Tìm đồ vật theo yêu cầu của cô.",
  icon: "🧸",
  skills: ["Quan sát", "Chú ý"],
  age: "3–6 tuổi",
  type: "quiz",
  data: [
    { pic: "🧸", question: "Đâu là đồ chơi?", options: ["🧸 Gấu bông", "🥬 Rau"], answer: 0 }
  ]
}
```
`topic` phải trùng với `id` của một chủ đề trong `topics`. `id` trò chơi phải duy nhất.

## 4. Thêm chủ đề mới
Trong `topics` của `js/data.js`, thêm:
```js
{id:"am-nhac", title:"Âm nhạc", desc:"Trò chơi âm nhạc cho bé.", icon:"🎵", color:"#8e7dff"}
```
Sau đó thêm các trò chơi có `topic:"am-nhac"`.

## 5. Các loại trò chơi hiện có
- `quiz`: câu hỏi và lựa chọn đáp án.
- `pairs`: ghép hai nhóm hình có quan hệ.
- `memory`: lật thẻ tìm cặp giống nhau.
- `count`: đếm số lượng.
- `compare`: so sánh nhóm nhiều hơn.
- `sequence`: ghi nhớ và chọn lại thứ tự.
- `paint`: tô màu tranh.
- `oddone`: tìm hình khác nhóm.
- `sort`: phân loại nhiều lựa chọn.
- `find`: tìm hình theo yêu cầu.
- `letterorder`: xếp chữ thành từ.
- `numberorder`: xếp số theo thứ tự.
- `findcount`: chọn nhóm có số lượng đúng.
- `remember`: ghi nhớ hình vừa xem.
- `missing`: tìm hình biến mất.
- `pattern`: tiếp tục quy luật.
- `external`: nhúng trò chơi HTML có sẵn.

## 6. Ghép trò chơi HTML đã có
1. Sao chép trò chơi cũ vào `games/external/`, ví dụ `game-ghep-hinh.html`.
2. Thêm dữ liệu trong `js/data.js`:
```js
{
  id: "ghep-hinh-cu",
  topic: "ghep",
  title: "Trò chơi ghép hình cũ",
  desc: "Mô tả trò chơi.",
  icon: "🧩",
  skills: ["Quan sát"],
  type: "external",
  src: "games/external/game-ghep-hinh.html"
}
```
Trò chơi được hiển thị trong khung nội dung. Nên thiết kế game HTML cũ theo tỉ lệ linh hoạt, có nút chơi lại và tự thích ứng với màn hình TV.

## 7. Tài nguyên
- Ảnh: lưu trong `assets/images/`.
- Âm thanh: lưu trong `assets/audio/`.
- Khi dùng tài nguyên trong game, tham chiếu đường dẫn tương đối từ `index.html`, ví dụ `assets/images/con-meo.png`.
- Không nên nhúng ảnh dung lượng lớn dưới dạng base64 trong `data.js`.

## 8. Lưu ý
- Bản hiện tại chạy tĩnh, không cần tài khoản, máy chủ hay cơ sở dữ liệu.
- Nút toàn màn hình dùng Fullscreen API của trình duyệt; một số trình duyệt yêu cầu thao tác bấm trực tiếp của người dùng.
- Đây là nền tảng khung để tiếp tục phát triển; các trò chơi HTML bên ngoài cần được kiểm thử riêng khi tích hợp.

## 9. Danh mục bản mở rộng
Bản mở rộng hiện có 7 chủ đề và 35 trò chơi mẫu. Nội dung có thể bổ sung tiếp trong `js/data.js`; bộ máy loại trò chơi mới được đăng ký trong `js/games/games.js`.
