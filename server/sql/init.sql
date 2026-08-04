CREATE DATABASE IF NOT EXISTS `vue_library_course`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `vue_library_course`;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL UNIQUE,
  password VARCHAR(64) NOT NULL,
  name VARCHAR(64) NOT NULL,
  role VARCHAR(32) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(128) NOT NULL,
  major VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id INT PRIMARY KEY,
  borrowed_count INT NOT NULL,
  overdue_count INT NOT NULL,
  returned_count INT NOT NULL,
  CONSTRAINT fk_user_stats_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INT PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  author VARCHAR(128) NOT NULL,
  category_id INT NOT NULL,
  cover VARCHAR(255) NOT NULL,
  stock INT NOT NULL,
  total_stock INT NOT NULL,
  status VARCHAR(32) NOT NULL,
  description TEXT NOT NULL,
  isbn VARCHAR(32) NOT NULL,
  publisher VARCHAR(128) NOT NULL,
  publish_date VARCHAR(32) NOT NULL,
  shelf_location VARCHAR(64) NOT NULL,
  CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS borrow_records (
  id INT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE NULL,
  status VARCHAR(32) NOT NULL,
  CONSTRAINT fk_records_book FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT fk_records_user FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (id, student_id, password, name, role, phone, email, major) VALUES
  (1, '20230001', 'demo123456', '张晓晨', '学生', '13800000001', 'zhangxiaocheng@example.com', '软件工程')
ON DUPLICATE KEY UPDATE student_id = VALUES(student_id);

INSERT INTO user_stats (user_id, borrowed_count, overdue_count, returned_count) VALUES
  (1, 2, 0, 8)
ON DUPLICATE KEY UPDATE borrowed_count = VALUES(borrowed_count);

INSERT INTO categories (id, name, sort_order, status) VALUES
  (1, '文学', 2, 'enabled'),
  (2, '教材', 4, 'enabled'),
  (3, '技术', 1, 'enabled'),
  (4, '历史', 3, 'disabled')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO books (id, title, author, category_id, cover, stock, total_stock, status, description, isbn, publisher, publish_date, shelf_location) VALUES
  (1, '活着', '余华', 1, '', 2, 2, 'available', '适合作为文学类图书展示数据。', '9787300000011', '作家出版社', '2012-01', 'A-01-03'),
  (2, '计算机网络', '谢希仁', 2, '', 0, 4, 'unavailable', '用于演示库存不足与不可借状态。', '9787300000012', '电子工业出版社', '2023-05', 'B-02-11'),
  (3, '数据库系统概论', '王珊', 2, '', 5, 6, 'available', '用于图书详情、搜索与借阅流程。', '9787300000013', '高等教育出版社', '2024-03', 'B-03-14'),
  (4, 'JavaScript 权威指南', 'David Flanagan', 3, '', 3, 3, 'available', '用于借阅与归还流程测试。', '9787300000014', '机械工业出版社', '2022-10', 'C-02-07'),
  (5, '追风筝的人', '卡勒德·胡赛尼', 1, '', 1, 2, 'available', '用于文学类图书卡片与详情页展示。', '9787300000015', '上海人民出版社', '2020-08', 'A-02-10')
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO borrow_records (id, book_id, user_id, borrow_date, due_date, return_date, status) VALUES
  (1001, 4, 1, '2026-06-28', '2026-07-03', NULL, 'due'),
  (1002, 1, 1, '2026-06-29', '2026-07-04', NULL, 'borrowed'),
  (1003, 3, 1, '2026-06-20', '2026-06-30', '2026-06-29', 'returned')
ON DUPLICATE KEY UPDATE status = VALUES(status);
