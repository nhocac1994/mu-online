# Hướng dẫn tự đẩy code lên GitHub

## Bước 1: Mở Terminal

- **VS Code / Cursor:** `Terminal` → `New Terminal` (hoặc `` Ctrl+` `` / `` Cmd+` ``).
- Hoặc mở **Terminal** (macOS) / **Command Prompt** hoặc **PowerShell** (Windows), rồi `cd` vào đúng thư mục project.

## Bước 2: Vào đúng thư mục project

```bash
cd "/Users/quyennguyen/Downloads/web-dangkypk muonline/mu-online-react 2"
```

(Nếu bạn đặt project ở chỗ khác, hãy đổi đường dẫn cho đúng.)

## Bước 3: Xem file đã thay đổi

```bash
git status
```

- Cột **modified** (màu đỏ) = file đã sửa chưa add.
- **Untracked** = file mới, chưa được git theo dõi.

## Bước 4: Add file muốn đẩy

- Add **tất cả** file đã sửa:
  ```bash
  git add .
  ```
- Hoặc add **từng file**:
  ```bash
  git add src/components/Header.tsx
  ```

## Bước 5: Commit (ghi lại lần thay đổi)

```bash
git commit -m "Mô tả ngắn thay đổi của bạn"
```

Ví dụ:
```bash
git commit -m "Ẩn nền đen header trên mobile"
```

## Bước 6: Đẩy lên GitHub

```bash
git push origin main
```

- Lần đầu có thể bị hỏi đăng nhập GitHub (username + password hoặc token).
- Nếu dùng **Personal Access Token**: dùng token thay cho mật khẩu.

---

## Tóm tắt 3 lệnh thường dùng

Sau khi sửa code, chạy lần lượt:

```bash
git add .
git commit -m "Mô tả thay đổi"
git push origin main
```

---

## Một số lỗi thường gặp

### "Nothing to commit, working tree clean"
- Không có file nào thay đổi so với lần commit trước. Kiểm tra lại đã lưu file chưa, hoặc đã add đúng file chưa.

### "Permission denied" / "Authentication failed"
- Chưa đăng nhập GitHub. Trên máy mới có thể cần:
  - Cài và cấu hình [Git Credential Manager](https://github.com/GitCredentialManager/git-credential-manager), hoặc
  - Tạo [Personal Access Token](https://github.com/settings/tokens) và dùng token thay cho mật khẩu khi `git push`.

### "failed to push some refs" / "rejected"
- Trên GitHub đã có commit mới (ví dụ sửa trên web hoặc máy khác). Trước khi push, kéo code mới về rồi push lại:
  ```bash
  git pull origin main
  git push origin main
  ```

---

**Repo của bạn:** https://github.com/nhocac1994/mu-online  
**Nhánh mặc định:** `main`
