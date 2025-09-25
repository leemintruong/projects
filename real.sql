CREATE DATABASE real_estate;
use real_estate;

-- Drop tables if they exist (để tránh lỗi khi chạy lại nhiều lần)
-- DROP TABLE IF EXISTS property_views;
-- DROP TABLE IF EXISTS favorites;
-- DROP TABLE IF EXISTS property_images;
-- DROP TABLE IF EXISTS properties;
-- DROP TABLE IF EXISTS user_profiles;
-- DROP TABLE IF EXISTS wards;
-- DROP TABLE IF EXISTS districts;
-- DROP TABLE IF EXISTS provinces;

-- Drop tables if they exist (để tránh lỗi khi chạy lại nhiều lần)
DROP TABLE IF EXISTS ahp_results;
DROP TABLE IF EXISTS ahp_property_scores;
DROP TABLE IF EXISTS ahp_pairwise;
DROP TABLE IF EXISTS ahp_criteria;
DROP TABLE IF EXISTS property_views;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS wards;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS provinces;


-- ===============================
-- Bảng người dùng
-- ===============================
CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password VARCHAR(255) NOT NULL, 
    phone VARCHAR(20),
    role ENUM('admin','seller','buyer') DEFAULT 'buyer',
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===============================
-- Bảng Tỉnh/Thành phố
-- ===============================
CREATE TABLE provinces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50)
) ENGINE=InnoDB;

-- ===============================
-- Quận/Huyện
-- ===============================
CREATE TABLE districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    province_id INT,
    FOREIGN KEY (province_id) REFERENCES provinces(id)
) ENGINE=InnoDB;

-- ===============================
-- Phường/Xã
-- ===============================
CREATE TABLE wards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    district_id INT,
    FOREIGN KEY (district_id) REFERENCES districts(id)
) ENGINE=InnoDB;

-- ===============================
-- Bảng Properties
-- ===============================
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(100),
    status VARCHAR(100),
    listing_status VARCHAR(100),
    price BIGINT,
    area DECIMAL(10,2),
    bedrooms INT,
    bathrooms INT,
    floors INT,
    address TEXT,
    ward_id INT,
    district_id INT,
    province_id INT,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    owner_id INT,
    featured BOOLEAN DEFAULT FALSE,
    days_on_market INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES wards(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (owner_id) REFERENCES user_profiles(id)
) ENGINE=InnoDB;


-- =========================================================
-- Property Images
-- =========================================================
CREATE TABLE property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
) ENGINE=InnoDB;

-- =========================================================
-- Favorites
-- =========================================================
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    property_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
) ENGINE=InnoDB;

ALTER TABLE favorites
ADD CONSTRAINT unique_favorite UNIQUE (user_id, property_id);

-- =========================================================
-- Property Views
-- =========================================================
-- CREATE TABLE property_views (
--    id INT AUTO_INCREMENT PRIMARY KEY,
--    user_id INT,
--    property_id INT,
--    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--    FOREIGN KEY (user_id) REFERENCES user_profiles(id),
--    FOREIGN KEY (property_id) REFERENCES properties(id)
--) ENGINE=InnoDB;

-- ============================================
-- INSERT Provinces
-- ============================================
-- TRUNCATE provinces;
INSERT INTO provinces (name, code) VALUES
('Hà Nội', 'HN'),
('Hồ Chí Minh', 'HCM');

-- ============================================
-- INSERT Districts (~20)
-- ============================================
-- TRUNCATE TABLE districts;
INSERT INTO districts (name, code, province_id) VALUES
('Ba Đình', 'BD', 1),
('Hoàn Kiếm', 'HK', 1),
('Đống Đa', 'DD', 1),
('Cầu Giấy', 'CG', 1),
('Tây Hồ', 'TH', 1),
('Long Biên', 'LB', 1),
('Hai Ba Trưng', 'HBT', 1),
('Thanh Xuân', 'TX', 1),
('Gò Vấp', 'GV', 2),
('Bình Thạnh', 'BT', 2),
('Quận 1', 'Q1', 2),
('Quận 2', 'Q2', 2);


-- Wards cho Hà Nội (district_id từ 1 → 8)
-- TRUNCATE wards;
INSERT INTO wards (name, code, district_id) VALUES
-- Ba Đình (1)
('Phúc Xá', 'PX', 1),
('Trúc Bạch', 'TB', 1),
('Ngọc Hà', 'NH', 1),
('Điện Biên', 'DB', 1),
('Đội Cấn', 'DC', 1),

-- Hoàn Kiếm (2)
('Hàng Bạc', 'HB', 2),
('Hàng Đào', 'HD', 2),
('Hàng Gai', 'HG', 2),
('Hàng Buồm', 'HB2', 2),
('Cửa Đông', 'CD', 2),

-- Đống Đa (3)
('Văn Chương', 'VC', 3),
('Khâm Thiên', 'KT', 3),
('Quang Trung', 'QT', 3),
('Ô Chợ Dừa', 'OCD', 3),
('Thịnh Quang', 'TQ', 3),

-- Cầu Giấy (4)
('Dịch Vọng', 'DV', 4),
('Nghĩa Đô', 'ND', 4),
('Mai Dịch', 'MD', 4),
('Yên Hòa', 'YH', 4),
('Trung Hòa', 'TH2', 4),

-- Tây Hồ (5)
('Bưởi', 'B', 5),
('Quảng An', 'QA', 5),
('Tây Hồ', 'TH3', 5),
('Nhật Tân', 'NT', 5),

-- Long Biên (6)
('Phúc Lợi', 'PL', 6),
('Bồ Đề', 'BD2', 6),
('Gia Thụy', 'GT', 6),
('Cổ Linh', 'CL', 6),

-- Hai Bà Trưng (7)
('Tân Mai', 'TM', 7),
('Vĩnh Tuy', 'VT', 7),
('Bạch Mai', 'BM', 7),
('Thanh Nhàn', 'TN', 7),

-- Thanh Xuân (8)
('Hạ Đình', 'HD2', 8),
('Khương Trung', 'KT2', 8),
('Nhân Chính', 'NC', 8),
('Thanh Xuân Bắc', 'TXB', 8);

-- Gò Vấp (9)
INSERT INTO wards (name, code, district_id) VALUES
('1', 'GV1', 9),
('3', 'GV3', 9),
('4', 'GV4', 9),
('5', 'GV5', 9),
('6', 'GV6', 9);

-- Bình Thạnh (10)
INSERT INTO wards (name, code, district_id) VALUES
('1', 'BT1', 10),
('2', 'BT2', 10),
('3', 'BT3', 10),
('6', 'BT6', 10),
('13', 'BT13', 10);

-- Quận 1 (11)
INSERT INTO wards (name, code, district_id) VALUES
('Bến Nghé', 'Q1BN', 11),
('Bến Thành', 'Q1BT', 11),
('Cầu Ông Lãnh', 'Q1COL', 11),
('Cô Giang', 'Q1CG', 11),
('Cầu Kho', 'Q1CK', 11);

-- Quận 2 (12)
INSERT INTO wards (name, code, district_id) VALUES
('Thảo Điền', 'Q2TD', 12),
('An Phú', 'Q2AP', 12),
('Bình An', 'Q2BA', 12),
('Bình Trưng Đông', 'Q2BTE', 12),
('Bình Trưng Tây', 'Q2BTW', 12);

select * from wards;
select * from user_profiles;

INSERT INTO user_profiles (email, full_name, phone, role, avatar_url, bio, is_verified, is_active)
VALUES
('nguyenthucthuytien@example.com', 'Nguyễn Thúc Thuỷ Tiên','123', '0912345671', 'buyer', 'https://static-images.vnncdn.net/vps_images_publish/000001/000003/2025/9/19/hoa-hau-nguyen-thuc-thuy-tien-duoc-ap-dung-tinh-tiet-giam-nhe-2928.jpg?width=0&s=8ZxATXV8TcrdgsUt2vuoow', 'Yêu thích bất động sản và cà phê.', TRUE, TRUE),
('tranducbo@example.com', 'Trần Đức Bo','123', '0912345672', 'seller', 'https://doanhnhanonline.com.vn/wp-content/uploads/2023/12/6-25-1.jpg', 'Nhân viên môi giới bất động sản giàu kinh nghiệm.', TRUE, TRUE),
('sharkhung@example.com', 'Shark Hưng','123', '0912345673', 'seller', 'https://cdnphoto.dantri.com.vn/x25dtCCTRS8brow95BqevUiTv8k=/thumb_w/1020/2021/01/22/sharkhung-1611309008023.jpeg', 'Chủ sở hữu nhiều bất động sản.', FALSE, TRUE),
('sinhvien@example.com', 'Sinh Viên','123', '0912345674', 'buyer', 'https://file1.hutech.edu.vn/file/editor/homepage1/IMG_7472%287%29.jpg', 'Đang tìm nhà mới.', TRUE, TRUE),
('Sharklien@example.com', 'Shark Liên','123', '0912345676', 'seller', 'https://cdn-i2.congthuong.vn/stores/news_dataimages/2023/122023/11/15/a-nh-chup-ma-n-hi-nh-2023-12-11-luc-15311120231211153332.png?rt=20231211153333', 'Chủ sở hữu một số căn hộ.', TRUE, TRUE),
('codat@example.com', 'Cò Đất','123', '0912345677', 'buyer', 'https://saigonrealestate.vn/wp-content/uploads/2020/07/T%E1%BA%A1i-sao-l%E1%BA%A1i-g%E1%BB%8Di-l%C3%A0-c%C3%B2-%C4%91%E1%BA%A5t.jpg', 'Quan tâm đến bất động sản thành phố.', TRUE, TRUE),
('thienkhoigroup@example.com', 'Thiên Khôi Group','123', '0912345678', 'seller', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiBIFerLzgVqjWa8XfUfQ6wQMyAMfrUz3dcQ&s', 'Nhân viên môi giới top tại Hà Nội.', FALSE, TRUE),
('vochongaphu@example.com', 'Vợ Chồng A Phủ','123', '0912345679', 'buyer', 'https://hgth.1cdn.vn/thumbs/1000x0/2019/09/01/mtblzdm3mgmtyty1zs00zjgwltg0yzitmzrmntq0m2ezyjfm.jpg', 'Người mua nhà lần đầu.', TRUE, TRUE),
('jack97@example.com', 'Jack 97','123', '0912345680', 'seller', 'https://images2.thanhnien.vn/528068263637045248/2025/7/12/48427799012203294996640565770072566130465660n-17523009301901089058451.jpg', 'Chủ sở hữu biệt thự sang trọng.', TRUE, TRUE),
('thaihoa88@example.com', 'Thái Hoà 88','123', '0912345682', 'buyer', 'https://35express.org/wp-content/uploads/2025/05/thai-hoa-88-1.jpg.webp', 'Đang tìm căn hộ cho thuê.', TRUE, TRUE),
('buicongnam@example.com', 'Bùi Công Nam','123', '0912345686', 'buyer', 'https://iv1cdn.vnecdn.net/giaitri/images/web/2024/07/01/bui-cong-nam-toi-mo-nhat-so-voi-dan-anh-trai-1719824134.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=lONASF8yjDmz5MX1wLQVWw', 'Quan tâm nhà giá rẻ.', TRUE, TRUE),
('leanhnuoi@example.com', 'Lê Anh Nuôi','123', '0912345688', 'seller', 'https://cdnphoto.dantri.com.vn/Mr0k7MMRUuOQ-3rsjFDhQlb5GVI=/2023/07/24/le-anh-nuoi-tiktokdocx-edited-1690205669080.jpeg', 'Chuyên nhà cho gia đình.', TRUE, TRUE),
('phamtuan@example.com', 'Phạm Tuấn','123', '0912345689', 'buyer', 'https://nguoinoitieng.tv/images/nnt/100/0/bej1.jpg', 'Tìm bất động sản để đầu tư.', FALSE, TRUE),
('trandan@example.com', 'Trần Dần','123', '0912345690', 'seller', 'https://i.pravatar.cc/150?img=20', 'Chủ nhà và nhà đầu tư.', TRUE, TRUE);
-- admin
INSERT INTO user_profiles (email, full_name, phone, role, avatar_url, bio, is_verified, is_active)
VALUES
('admin@example.com', 'Phạm nhật Vượng','123', '0900000000', 'admin', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDxUPEBAVFhAVEBYVDxAVFRUVFRYQFRUWFhYVFRcYHSggGBolGxYVIjEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lHh8tLSsrKystLS0tLSstLSstLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS4rKzctLf/AABEIALEBHAMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAABAAIEBQYHAwj/xABKEAABAwIDBQUEBwQHBQkAAAABAAIDBBEFEiEGMUFRcRMiMmGBI5GhwQczQlJicrEUc4LRQ5Kys8Lw8TVTk9LhFSQlNERjdIPD/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAECAwQFBv/EACYRAQEAAgICAgIBBQEAAAAAAAABAhEDMRIhBEEyUXETFCKB8AX/2gAMAwEAAhEDEQA/AIM9SXGw3JvaEKUYA3RRZm3Xh+np8PLvUjzdJdWmBO9oFVmGyssFFpG9Vea3G+f410uh8KlAKNh/hUwL1Menj3s0pjl6FeblIjSr3pl4yhe9MohUkBQ64aKZdRK3cpy6J2qGb17rxaNV7hcF7dUQ6s6KHgR9oeqmVY0UPBB7U9Vv8f8AJnzfi3VN4V6rypfCvZd7kBBOQUAJJIoAgnIIGlBOKCkBBFJAE0pyBRDzKScQmoAgU5AoGFBOKCIccmnBdqjSxF5vwVPSSulfpuutTFZjF874xph8rxk12ZJAAF40JtKOqT6jMU+laM4PmrY3Venw45ZY+Vro2GHuhTQoGFHuhWIC9nHp5+XYJjl6FebkojzL0hcBqTYW1KZMsT9IuOOijbSRaySi7rbwy9vkfcmM3S9LfEdtoWuLIRnINi/7N/LmoFRtFORmdZt9wt/NRdgMADWdvMLv/o2m5DebgOa2cuCQTG7mjfyCt5TekzC62xtNjM7nXGU/hIP6hT6faSMnLI0sPE729ei1sez9ONzBc79Ao1dspTSRlhbYkaO4g8wqZ4Y5fS2O59qypIIuDpbQ+ShYMfanqqHB55qWqkw6oNwDeB53Zbbh15cLK+wjSY9Vlx4XHNbPLeFbmk8K914UfhUhdjlBBOQRIJJJIgkEUkDUkUEAKSSSkBApyaUDSmpxTUQCCKSBpQTkEQ4dhNOGi6tg7Mqc1YY1Gkr78V4M/Ldc2GNt1E6VtiveBxBHVR2SX1XtFvHVVyu8n0PxsPHj06Pg57g6K0aqjBT3B0Vs0r2MOnnZdnFebl6FNISiPKuZ4nI2pxGTS+U5G/wCx+N10bE6kRMz5XO7wAY3eSTwusVszgpFRNKSS0uOQnQnMS655Gx1SZa3peYW6v01+Hw+za1v2R/m6tY6d28HVYTE8VEb8krZi0bmxRyOHUkCyr6PH4w8Pppp23vminDxcDQ2a8cPJVlndbeN6jpuaQcF5vnfexCon7SPjjDiDc7geKFLtHUSjv0nc4PDlO99Uss7ij+kKnLXxVTB3gcp8xcaH4qbhh9sUNrphJTtcBp2jRY/icGp2HC0xSX3j/tjnPVbij8KkKNReFSV0OckEUkSakiggSSSSIBIpJFA1JFBAEiigpDSmlPKaUQagiggCSKCD53qcPqnHSnmt+6k/kvemw2pb/6eb/hSfyXZP+1jzRGLH7y5v7HH9q4ZzH6cyo6GoP8AQS/8N/8AJToaOa/1Mn9R38l0EYseaIxc/eVL/wCdjvfk68fnXGa08sEieGDMxw04ghWUVQwuLA4ZwLlh0NudjwUGTGBa5cqzFaxkrPHlkbrFKPEx/AjmOY4rrx4ZJrbmvLbd6ahJVWzWK/tUAefrGkslHDtG6G3kValY2arWe0SvbcBo3m4DuR/zpdUdHMIiGE3yixJ3k8SfNaCovbQAnk69j5ablhquQyPdbxZis8vTq4vc018rKeVt3OIPAhxFuiiw4XBLq3M9oNi92Xy3WHRZykY7MGzOszieY5L2xikrHEGjqMkVgXMABBIHHkNFEu2/jJ9tVj2DxyxMANgwWuDa1xvusozZCWN7nRVNQ1ziCLyOkZp/7btCD1v0TcMr8UZKxpjjMR0kuSe7z8virumxZ0RMT7Fo8P5UtivhZ62j4lhj+wY2SziJ2PeNQCG3J87X1XjQ/XlXDJ84Mm8N1t52IF/eqaj+vUY/nGPL+Nbeh8KkqNQeFSV2OIUkkkSCCKCBJJJIgigiggBQRKBQJJBFSGlApyaUQaUEUCgCCKCDiL9pzzXmNpz95YI1B5oGoKt5K+LoTdp3feTztISN65yKk816xVpunknxbaXHHEb1Bdjbr2zKuwihqKpxEMZcBoXbmjq46em9aij2B3OnqOrIx/jd/wAqmS3pHqdtP9E9UZDVC/dzxm3Jxa6/6LdVNXFHrJKxv5ntb+pWCoWRULHsgu0PIMhzEl5AsLk/KwVZU9lPI0yMub+Ik7gL2UXg3d2k5ddNziu0lPHC6SOVkhFw0McHDNb7RB0G5YR+IEFs40zNa4j84Dh+qhY8Tls0WYNwG5W1Fh5qsNjmjGZ8QdDOwby1ji5jgOYY5vp0WfNw6x9N+Dl/y9rCmEdYyz9w5Eg+8FRhh7YXWNTVNt4XBxeB6W+YVJhtW+B+huPgQtXTbQxOb7SMX46X+K48bp6UrzjlqXfU1gl5iSLLYcxY6e6ycKZzx7Z4MjdLtFha69KjG6drSWDXkFA2cxOnnmeZJ252usIfxD7x3G3Ly9FN3eorlnMe2np2GOLJwIBItrfr7lX0v16t5tQqmnHt1nx23P2w5PeNbWg8KlKLh/hUpei4iRQRUJBBFBAkkkkQCSSSAFBEoFAEkklISaU5NKBpQRQKINKCJQQfJaRQukoSFldYPh3szO6MP17rXC7QNRmLeOvPTTz0qGRlxDQNSQAPMmwWrocOq4HkxvbdrbdkdQ9rdLdVfCbquVX2z21F7QShreDCAGgeWUaAK/nqjzWQiq4ZyWmHs6galh0PUc1ZRTkt8xoV0Ssak1s2nqoM1QWAOa3MAe+B4sp4tHG3JCqkvZRTL7QN3Agm/QjT4ps0m4lUtdE2xBuL3HJXX0V1pbUSwE92SMPYPxMOU+pDh/VWSqCPebm3mrTYmfs8QgN9HPLD/G1zR8SFXP3FsfTe7TbKNkvLCLSby3c1/Po79fisSaVwNiLEGxB0IPIhdVxPGqakFqiQAk2DBq4nhp9nqbBZnFXNqi2RtM+N5AJdeN0hZbQvZcN05hxOm4hedy4Te49T4/nZ16/anosH/wC7z1L/AAwwucPz209wufcufYjhL6SQywk9iTdzfu+f5V1eux6BuH1NGIJIn9g/KXkOElyGl+YcTc8LaEcLLGQ1FmWIvpYDmORXV8fGeLj+VcvPVStmdo5MoaXXHI6rWUlRG54fex4jeuXUjTBLlOgJ0tu14DyWuw+q4ceC1vHjl7s9sPPKdV1XDJmub3XA/r7lNXLXYg6PK4GxEjLEbxdwHzXSqCpEsTJB9poJ68R77qmeHivjltIRTU5ZrEUEUECQSSQJJJJAECigUDUkkFIKBRQQNKaU8phRAFBEoIPkkJwTAnhQsmYM/LURutezwbdFuJ5g52Yacj14Kl2dw5gp/wBqNi90hY38AHzPPl1KmucQf1C3wmoxzu6kVkLZmg2tI3VrhvB8io9PVcHHvcU179MzCbje1VVTXg97cRe6tbpEi/ldfVQ6vcH/AHXA+m4/An3JUdQHNBB0K9WtzXB3cVIDmafNOozlljdci0rDcGxFnA6HgV4i+WxOoNj1Gl/mnOFgedlFI6/XYI18EtPx0fG478zXXBPuVRhshADT3Tezhwe9rrEkfYsbafILcQxh8bZObNejgsFUNH7bKADlcQHavBDQbGSwtmBuRb46rj5JO3r/AAcrd4/XaJt9RgYYJ2k9q+pHav8AwNeWZfy3y9bLLxvtrr6LbfSG3/wpthZt2jT94w36nf6rFRt0XRxdPO+Td8lLEI2yRZgBcOGV3HzH+q9aJxFl5yAkADqfT/VSYWi11s53vWy9zf8AaZ/baui7C1faUlvuSuaOh7/+Irj2K1hBYwHe+56N1+QWl2T2lfAGtjYXOe68g3NbGToXeZG4DXXkqZzc0tj6ddBTgUwHiN3BOBXO2OSQSQJJJJAkkEkCQKKRQMKCcU0qQkkEUAKaU4ppRBpQRKSD5EEg5qVhlO6eRsbOJ1eQcrQBckkf5vZaOOphj0ipIWnmWB597rqfRVEs1w4gRgDutAaM19N3Qq0x9ouRUdE+mZkZaZhFp4hoXak5mA6hw8uSJeA0HNmhvaOa1nRn/dzN4dVYFgazPa44qJiOKxsfZ8ZDXNA7TfmHJw+0PI+llvrTLe1XVuMTsw3cVQYw4B127nj4rRYnEA3Mw3iPhN7jpf8AmspV6vDeWqyzXxXODy5WAE7gtBDK0NvfXksrRSC9iVaOebZR71bGliXSzNdK8E7rOt1uP8KlPIKpbCOZjjuc0td18Qv7j71bseTw0Uyod4weoDqKCx1NPET/AFGrKTxe2zWvc2vY3L94hdc6s+CscCgJoaZ4On7Oy+v3WgfJRHtDg14G9ptoNWC+Z2/x6HXy3FcvK9T4N1ah7cyAYRI128yR5Bus7OMwHkN3RYemfoL7lstv6cPw1zh/R5XDdq3M0a28i0+9YejfoPRbcPTj+XNclWL2ZTfgRp6qNVVXZssN5NgFHr6vs3DiCD6Wt/NVlVVF4uOYv0W1rlkQ66rzztjAJ7p068+Q01Wpw0iJrWXvI8i567/h8liad5MznedrDebaegvdX2GVZEmYWc4D2jzqxjeLRzcVXGpyjsuzOOh+WnI0u5scl99gTa3LQi/lZaYOXGcMxepdI2SmYO6e7m0HK2m4Lp+BYqahlntDZmjvsBuLc2nkqZ4/cWwy+lznQzrySWbR650x0wCYossRJQTu2Ca6cDiofZGy8J6ZxCIWQqm80e3HNUcdE/mpbKdwU6FgZgmmYc1D7EppiKgTu1CXahQ8hREZUiUZgmmYKK5qaWoJRnTP2hRTbzXsIR5ppDgElOrClGSLrqf89EyGN25y9Gm4yg2WuEUqc2pf+z5omNcLkPa7f6KqrIxPEQ4WP6L2oHyQSEEXjdvtw817YiMguB3TuPD1V1GSocQfDnhOoLXWB3blVSysfKXMFhYXFyRfja/BWWJx+0DuBKooRlPQrDL9N8f2tqcC6uoIy6x4LOxzc1c4XiYYbFWxsVsTMRprR5wNWkOA82m9vgp0bJHBrhl7MgFtuR3IzTZmEi2oUTAaomExcWPLeNsu9u7dpp6K/wBq/Ts+z4zYVC25A7A7t9g8i3wUeBg7MXGmVucWbcW0YRf4qXsPIw0EIJ7wjcCP/scmAi5yEC0j8pOXR5ccxP4bLm5Y9H4d7Un0hNJw2UX1Ba42I3h+ug4XLveFgsMf3QuhbaNzYdM0Xt2WgvqMpBF/db+IeS5thlRkAuCRbfZacPTP5s9x44+faNH4L+pP/RV9TOGRHzPyup+Ni82durcoafI7/motPgkla4wRGzhFI+53Eiwa2/C5IF+qvldbrjxm/TPUUj730AJub8b67hv9Vew4uY7NZAHccpvr5kBZtsjmaagjQg6EEcCOBVzgdTVzO7KmjbmPiflubcySq41bKNTQbRVel2wMbwYL3WwwXF5w5ryyxHGxA8xrvCqcG2Xla3NUVD8zvFka1p6B2W4HSymR7K0DDnyFzt5fJJK8356ustvbK6dLw3FIaht43tLrXewOBc3hrbhfipa4vO5tBVNq4BkBPeewlzSTwkF/CfvC/nuXYKOqbLGyVvhewOb0cLrDPHTXHLaQkm3SuqrCkQhdC6A2QKV00uQIoJEoXQGyVkLoFyIAsTXNRLk0uQBsY4p5ITC5DMpHH8TZ2bRbeb26Df8AqFUQPsddwVvtA69QIxwjGnmST/JUT+64h17/AHbLeMqt6bE23ykgeZXljGMxQXbfM77TALjUcVUzskeLiMNH3nHL8SnPpGuiBlve2V0rCGjLwF3i5Pom6jUVeIY3BKw3iIcPDa3i4eiz0ak4vTRxy5IpC9haHXNrgm+htod3xXgGELDK29tpJHtHbivcEDgvGEclLhguddEhUqhqXDQHTkU7Bqotq3NB0kYR/E3UfDMnyNbG24Kq6Z2WQTEaB4J6X73wur9Kz277s60x4fC/nF3f4iT81IwuQuiBcbnM4WB+xmJyGw0JO7j+il7PUufDYG2uBA3JrzGnw/RRMNgMTXRkFpEhJ1OpLQQ4W+7e5WXI7viX3XhtNrRyC9/Zm511092v+Dqub7M1DiwNDQ4bjewXTsZjzwvbzaRudxG8dBdw6rg4qnQvcBwcRboVPFlpPzcdyLPEKnPI9zdAXnQfd3D4ALoH0a0IbSvqXAXe+wJ4Rxj/AJi73LmTpCbBovewFhqSdABzuu+bFbOllFDHUNtaO74SPtPJc4PHHxWt7+Sty304uKe3MMV2B/a66WrjEhpJHCRoiif3nOAz2dlNml13BwBuHaK+w50dIBT01ES+31LSGSutvOWbK+Q25XK7G0DcFltu6dksBaR7RpzROHia8agtI1BWX9S4T02nHjndVz2t2vhaPb00zbHVt48w6guH6qHWPwyVkczTOGytJbJG8xkEGxDuRB/RX+3Rgla10ob2gDBMRxdYZ724XuuSYdXmQSwk+F5mhHMNt2jRrp3Rm/hPNbzO/bC4SdNeyvEUrqWQmWF7CYZXWz6eJklrAm1jmAF7i911jYxpbh8AJvZrrH8HaOy/Cy+eJa50zwyLvSFwZC0b3SPAbYe8ar6Twml7GCOH/dxtYTzLQAT71GWWyY6TrpIJXVFhukghdAbppKRKBKBXSuhdK6BXQJSJTSUCJTSUiU26IElC6BKCDiG28r46xj2G2aIe9pcP0soEWNzvcA53lewv77L22mxenqgzIfaMcbebHDvD4NPoqJpcLHgtN3amvTRujB77iSeZN1Fc5sp7KRrjHwI+yeakYeRI3K51lbNw8ZbNcA3iVp2pvTneJUHYzGPNmsB3hyKdBHdWe0rGiUObqCMpPm3/AKH4KFAeSy17ab9PaLDdbtcRzBUsNDd2p5qM3MftJx0Gqt6Rt51Di42C9pqP2VuIFyvahht3j6BTqKA1JDIbOc9wYyxv3ibDdwuVMht1vY6tljoqZp8Jpoy2+6xYDby3qYXlz5Cfvi2/QZGa6b7+H0VnHQNhp2xtFxHEGtHPI0Afos3gU5lErjq7ty0jhnDWjJv3WF+qw5Ond8P8r/CdUt0NxwN9NwG/eeBs3p5Lgu0xBrJhcD2hBNtA4d0j3hd7lI4crg2HRrjfmb3XK8EwLt9onR5fZxTunk4iwIcwer3N9LqmN03+VN4xuPo02JbSMZU1eV1UR7Nm8Qg7usljqeG4cSej5wBYHfyVACHTvjB0Y1l/zG5t7re9EVLg0kD7eVvn3st/eqXK1hOOT1F9PWMiYXvIDWgkk8gLrn20WH1lTI6rdPJDB2Q7KKMMD2tBOZ5c4E5iCNBa1t/Fe+3OL9mIae9zJK3ML/Ya4EjodB6rWh7XxWdq21iPIixUyo8dOPYrgL4Yi0VMpa9vBzQ0tdxtk4grG4Tg8TZQ/LICw5swkGhbrp3OO71XRtq5nZhAwd2JrWX4nKAL/BQKLCSW5rEZna8NAt9WsfUZluFM8LYTrwzjlw7q7ls9O6Slie/x5AHcTmb3bnz0v6rDQ4cA8HgBv5lbvA22gFxxNuieOlcstrG6F026V1CBugShdC6AlyF0CULoDmQzIIXQEuTS5AlNLkBLk0uQuhdAcyGZNKF0Q+dxx6JkXg9UklfFGSfS8FpIvqvRFJa4ssmT2i+rb+9H9lyrKf5/JBJUva86So/EjJ4kkkEyT6p35Hf2SrL6HP8AaUXV39wUklF7TOnfqnc78pWHwHwz/v3/AKNRSWXJ07/g/lf4W58f8b/7sLMbD/7br/3dN/dpJLP6dPyep/37arCvr6r/AOR/+Ua9B9TH+8Z/bCSSzYfbBbaf+fp+o/vGro8P1J6JJKVcmQxT693X5BPj4JJLsx6cefaS/d6rVYd9U3p80klGSs7e5SSSVFjSkkkgBTUkkCQKSSBpTCkkgaUkkkAKCSSIf//Z', 'Quản lý toàn bộ người dùng và tài sản.', TRUE, TRUE);

select * from properties;
-- 20 
INSERT INTO properties (title, description, property_type, status, listing_status, price, area, bedrooms, bathrooms, floors, address, ward_id, district_id, province_id, latitude, longitude, owner_id, featured, days_on_market, views_count)
VALUES
('Căn hộ 2 phòng ngủ ở Hà Nội', 'Căn hộ hiện đại, ban công view thành phố.', 'Căn hộ', 'Bán', 'Đang rao', 2500000000, 75.50, 2, 1, 1, '123 Nhân Chính, Thanh Xuân', 35, 8, 1, 21.012345, 105.843678, 2, TRUE, 10, 120),
('Biệt thự sang trọng tại Hoàn Kiếm', 'Biệt thự rộng 5 phòng ngủ, có vườn và hồ bơi.', 'Biệt thự', 'Bán', 'Đang rao', 15000000000, 350.00, 5, 4, 2, '456 Hàng Bạc, Hoàn Kiếm', 6, 2, 1, 21.028765, 105.854321, 5, TRUE, 5, 85),
('Nhà phố 3 phòng ngủ Tây Hồ', 'Nhà sáng sủa, đầy đủ nội thất, gần Hồ Tây.', 'Nhà phố', 'Cho thuê', 'Đang rao', 30000000, 120.00, 3, 2, 2, '789 Quảng An, Tây Hồ', 22, 5, 1, 21.065432, 105.842100, 9, TRUE, 20, 60),
('Căn hộ studio giá rẻ', 'Phù hợp cho người độc thân.', 'Căn hộ', 'Cho thuê', 'Đang rao', 10000000, 35.00, 1, 1, 1, '12 Hàng Buồm, Hoàn Kiếm', 2, 2, 1, 21.028500, 105.847000, 12, FALSE, 15, 40),
('Nhà 4 phòng ngủ cho gia đình', 'Nhà thoải mái, sân vườn rộng.', 'Nhà phố', 'Bán', 'Đang rao', 5500000000, 200.00, 4, 3, 2, '34 Tân Mai, Hai Bà Trưng', 29, 7, 1, 21.015000, 105.850000, 14, TRUE, 8, 75),
('Biệt thự ven biển Đà Nẵng', 'Biệt thự sang trọng view biển, có hồ bơi.', 'Biệt thự', 'Bán', 'Đang rao', 12000000000, 400.00, 5, 5, 2, '99 Bồ Đề, Long Biên', 26, 6, 2, 16.070000, 108.230000, 3, TRUE, 12, 110),
('Căn hộ 1 phòng ngủ tiện nghi', 'Vị trí thuận tiện, giá hợp lý.', 'Căn hộ', 'Cho thuê', 'Đang rao', 8000000, 40.00, 1, 1, 1, '23 Hàng Gai, Hoàn Kiếm', 8, 2, 1, 21.030200, 105.845300, 5, FALSE, 18, 35),
('Nhà 2 phòng ngủ hiện đại', 'Khu dân cư yên tĩnh, có sân vườn.', 'Nhà phố', 'Bán', 'Đang rao', 3200000000, 90.00, 2, 2, 2, '67 Yên Hoà, Cầu Giấy', 19, 4, 1, 21.018500, 105.851200, 9, TRUE, 7, 55),
('Shophouse trung tâm thành phố', 'Vị trí kinh doanh sầm uất, đông người qua lại.', 'Thương mại', 'Cho thuê', 'Đang rao', 20000000, 60.00, 0, 1, 1, 'Hồ Trúc Bạch, Ba Đình', 2, 1, 1, 21.029500, 105.847800, 12, FALSE, 25, 22),
('Căn hộ 2 phòng ngủ gần trường học', 'Tiện ích đầy đủ, an ninh tốt.', 'Căn hộ', 'Bán', 'Đang rao', 1800000000, 55.00, 2, 1, 1, '45 Phúc Xá, Ba Đình', 1, 1, 1, 21.013000, 105.820000, 2, FALSE, 10, 30),
('Nhà phố 4 phòng ngủ', 'Nhà đẹp, khu dân trí cao.', 'Nhà phố', 'Bán', 'Đang rao', 4500000000, 180.00, 4, 3, 2, '12 Tây  Hồ, Tây Hồ', 23, 5, 1, 21.020000, 105.830000, 5, TRUE, 12, 50),
('Biệt thự 5 phòng ngủ', 'Sang trọng, có sân vườn và bể bơi.', 'Biệt thự', 'Bán', 'Đang rao', 9000000000, 300.00, 5, 4, 2, 'Khu liền kề Gia Thuỵ, Long BIên', 27, 6, 1, 21.030500, 105.840500, 9, TRUE, 15, 60),
('Nhà 3 phòng ngủ gần công viên', 'Khu yên tĩnh, gần tiện ích.', 'Nhà phố', 'Bán', 'Đang rao', 3200000000, 120.00, 3, 2, 2, '56 Hoàng Cầu, Đống Đa', 2, 2, 1, 21.045000, 105.865000, 12, FALSE, 12, 50),
('Căn hộ 1 phòng ngủ sang trọng', 'Nội thất hiện đại, an ninh tốt.', 'Căn hộ', 'Bán', 'Đang rao', 2500000000, 50.00, 1, 1, 1, '78 Cổ Linh, Long Biên', 28, 6, 1, 21.050000, 105.870000, 3, TRUE, 7, 45),
('Biệt thự ven sông', 'View sông, sân vườn rộng.', 'Biệt thự', 'Bán', 'Đang rao', 12000000000, 400.00, 5, 5, 2, '99 Khương Trung', 34, 8, 1, 21.060000, 105.880000, 5, TRUE, 5, 70),
('Nhà phố 2 phòng ngủ', 'Khu dân trí cao, gần chợ.', 'Nhà phố', 'Cho thuê', 'Đang rao', 15000000, 80.00, 2, 1, 1, '23 Bạch Mai', 31, 7, 1, 21.065000, 105.885000, 9, FALSE, 18, 30),
('Căn hộ 3 phòng ngủ', 'Tiện nghi đầy đủ, gần trường học.', 'Căn hộ', 'Bán', 'Đang rao', 3200000000, 90.00, 3, 2, 2, '67 Trung Hoà, Cầu Giấy', 20, 4, 1, 21.070000, 105.890000, 12, TRUE, 10, 55);

INSERT INTO properties (title, description, property_type, status, listing_status, price, area, bedrooms, bathrooms, floors, address, ward_id, district_id, province_id, latitude, longitude, owner_id, featured, days_on_market, views_count)
VALUES
('Căn hộ 2 phòng ngủ gần hồ Tây', 'Căn hộ rộng rãi, ban công thoáng mát, gần Hồ Tây.', 'Căn hộ', 'Bán', 'Đang rao', 2800000000, 80.00, 2, 2, 1, '21 Bưởi, Tây Hồ', 21, 5, 1, 21.065500, 105.842500, 3, TRUE, 9, 65),
('Nhà phố 3 tầng quận Ba Đình', 'Nhà phố hiện đại, nội thất cao cấp, gần trường học.', 'Nhà phố', 'Bán', 'Đang rao', 4200000000, 120.00, 3, 2, 3, '3 Ngọc Hà, Ba Đình', 3, 1, 1, 21.015500, 105.820500, 5, TRUE, 11, 70),
('Biệt thự 4 phòng ngủ Tây Hồ', 'Biệt thự sang trọng, sân vườn rộng, có hồ bơi.', 'Biệt thự', 'Bán', 'Đang rao', 10000000000, 350.00, 4, 4, 2, '22 Quảng An, Tây Hồ', 3, 3, 1, 21.070000, 105.840000, 3, TRUE, 6, 90),
('Căn hộ studio giá rẻ Cầu Giấy', 'Phù hợp cho sinh viên hoặc người đi làm.', 'Căn hộ', 'Cho thuê', 'Đang rao', 9000000, 35.00, 1, 1, 1, '16 Dịch Vọng, Cầu Giấy', 16, 4, 1, 21.070500, 105.890500, 2, FALSE, 20, 40),
('Nhà phố 2 phòng ngủ Đống Đa', 'Nhà mới xây, khu dân trí cao.', 'Nhà phố', 'Bán', 'Đang rao', 3200000000, 90.00, 2, 2, 2, '14 Ô Chợ Dừa, Đống Đa', 14, 3, 1, 21.045500, 105.865500, 14, TRUE, 8, 50),
('Căn hộ 3 phòng ngủ Long Biên', 'Tiện nghi đầy đủ, gần cầu Chương Dương.', 'Căn hộ', 'Bán', 'Đang rao', 3500000000, 95.00, 3, 2, 2, '26 Bồ Đề, Long Biên', 26, 6, 1, 21.050500, 105.872000, 3, TRUE, 10, 60),
('Biệt thự ven sông Hồng', 'View sông, sân vườn rộng, gần trung tâm.', 'Biệt thự', 'Bán', 'Đang rao', 13000000000, 420.00, 5, 5, 2, '22 Quảng An, Tây Hồ',22, 5, 1, 21.060500, 105.880500, 5, TRUE, 5, 75),
('Nhà phố 3 phòng ngủ Hai Bà Trưng', 'Nhà phố hiện đại, gần chợ và trường học.', 'Nhà phố', 'Bán', 'Đang rao', 4000000000, 130.00, 3, 2, 3, '32 Thanh Nhàn, Hai Bà Trưng', 32, 7, 1, 21.021000, 105.831000, 9, TRUE, 9, 55),
('Căn hộ 2 phòng ngủ Đống Đa', 'Căn hộ tiện nghi, an ninh tốt.', 'Căn hộ', 'Cho thuê', 'Đang rao', 12000000, 70.00, 2, 1, 1, '13 Quang Trung, Đống Đa', 13, 3, 1, 21.035500, 105.850500, 9, FALSE, 15, 35),
('Shophouse thương mại Hoàn Kiếm', 'Vị trí vàng, phù hợp kinh doanh.', 'Thương mại', 'Cho thuê', 'Đang rao', 45000000, 90.00, 0, 2, 2, '6 Hàng Bạc, Hoàn Kiếm', 6, 2, 1, 21.041000, 105.861000, 5, TRUE, 7, 50),
('Nhà phố 4 phòng ngủ Tây Hồ', 'Nhà sang trọng, gần Hồ Tây.', 'Nhà phố', 'Bán', 'Đang rao', 5500000000, 200.00, 4, 3, 2, '24 Nhật Tân, Tây Hồ', 24, 5, 1, 21.070500, 105.842500, 3, TRUE, 8, 65),
('Biệt thự 5 phòng ngủ Đống Đa', 'Sang trọng, bể bơi riêng, sân vườn rộng.', 'Biệt thự', 'Bán', 'Đang rao', 15000000000, 400.00, 5, 5, 2, '11 Văn Chương, Đống Đa', 11, 3, 1, 21.046000, 105.866000, 5, TRUE, 6, 80),
('Nhà phố 2 phòng ngủ Long Biên', 'Nhà đẹp, khu dân trí cao.', 'Nhà phố', 'Bán', 'Đang rao', 3200000000, 90.00, 2, 1, 2, '27 Gia Thụy, Long Biên', 27, 6, 1, 21.051000, 105.873000, 9, TRUE, 10, 50),
('Căn hộ 3 phòng ngủ Hoàn Kiếm', 'Tiện nghi đầy đủ, gần trường học và chợ.', 'Căn hộ', 'Bán', 'Đang rao', 3600000000, 95.00, 3, 2, 2, '7 Hàng Đào, Hoàn Kiếm', 7, 2, 1, 21.030500, 105.846000, 12, TRUE, 12, 65),
('Nhà phố 3 phòng ngủ Tây Hồ', 'Nhà đẹp, gần Hồ Tây, an ninh tốt.', 'Nhà phố', 'Bán', 'Đang rao', 4200000000, 130.00, 3, 2, 3, '23 Tây Hồ, Tây Hồ', 23, 5, 1, 21.071500, 105.843000, 2,TRUE, 7, 60),
('Căn hộ 2 phòng ngủ Đống Đa', 'Căn hộ hiện đại, đầy đủ tiện nghi.', 'Căn hộ', 'Cho thuê', 'Đang rao', 12500000, 70.00, 2, 1, 1, '11 Văn Chương, Đống Đa', 11, 3, 1, 21.036000, 105.851000, 3, FALSE, 18, 40);


-- 20
INSERT INTO properties (title, description, property_type, status, listing_status, price, area, bedrooms, bathrooms, floors, address, ward_id, district_id, province_id, latitude, longitude, owner_id, featured, days_on_market, views_count)
VALUES
('Căn hộ 2 phòng ngủ ở Hà Nội', 'Căn hộ hiện đại, ban công view thành phố.', 'Căn hộ', 'Bán', 'Đang rao', 2500000000, 75.50, 2, 1, 1, '35 Nhân Chính, Thanh Xuân', 35, 8, 1, 21.012345, 105.843678, 3, TRUE, 10, 120),
('Biệt thự sang trọng tại Hoàn Kiếm', 'Biệt thự rộng 5 phòng ngủ, có vườn và hồ bơi.', 'Biệt thự', 'Bán', 'Đang rao', 15000000000, 350.00, 5, 4, 2, '6 Hàng Bạc, Hoàn Kiếm', 6, 2, 1, 21.028765, 105.854321, 5, TRUE, 5, 85),
('Nhà phố 3 phòng ngủ Tây Hồ', 'Nhà sáng sủa, đầy đủ nội thất, gần Hồ Tây.', 'Nhà phố', 'Cho thuê', 'Đang rao', 30000000, 120.00, 3, 2, 2, '22 Quảng An, Tây Hồ', 22, 5, 1, 21.065432, 105.842100, 9, FALSE, 20, 60),
('Căn hộ studio giá rẻ', 'Phù hợp cho người độc thân.', 'Căn hộ', 'Cho thuê', 'Đang rao', 10000000, 35.00, 1, 1, 1, '9 Hàng Buồm, Hoàn Kiếm', 9, 2, 1, 21.028500, 105.847000, 12, FALSE, 15, 40),
('Nhà 4 phòng ngủ cho gia đình', 'Nhà thoải mái, sân vườn rộng.', 'Nhà phố', 'Bán', 'Đang rao', 5500000000, 200.00, 4, 3, 2, '31 Bạch Mai, Hai Bà Trưng',31 , 7, 1, 21.015000, 105.850000, 14, TRUE, 8, 75),
('Căn hộ 2 phòng ngủ ở Hà Nội', 'Căn hộ hiện đại, ban công view thành phố.', 'Căn hộ', 'Bán', 'Đang rao', 12000000000, 400.00, 5, 5, 2, '20 Trung Hòa, Cầu Giấy', 20, 5, 2, 16.070000, 108.230000, 3, TRUE, 12, 110),
('Căn hộ 1 phòng ngủ tiện nghi', 'Vị trí thuận tiện, giá hợp lý.', 'Căn hộ', 'Cho thuê', 'Đang rao', 8000000, 40.00, 1, 1, 1, '6 Hàng Bạc , Hoàn Kiếm', 6, 2, 1, 21.030200, 105.845300, 5, FALSE, 18, 35),
('Nhà 2 phòng ngủ hiện đại', 'Khu dân cư yên tĩnh, có sân vườn.', 'Nhà phố', 'Bán', 'Đang rao', 3200000000, 90.00, 2, 2, 2, '29 Tân Mai, Hai Bà Trưng', 29, 7, 1, 21.018500, 105.851200, 9, TRUE, 7, 55),
('Căn hộ 2 phòng ngủ gần trường học', 'Tiện ích đầy đủ, an ninh tốt.', 'Căn hộ', 'Bán', 'Đang rao', 1800000000, 55.00, 2, 1, 1, '5 Đội Cấn, Ba Đình', 5, 1, 1, 21.013000, 105.820000, 2, FALSE, 10, 30),
('Nhà phố 4 phòng ngủ', 'Nhà đẹp, khu dân trí cao.', 'Nhà phố', 'Bán', 'Đang rao', 4500000000, 180.00, 4, 3, 2, '31 Bạch Mai, Hai Bà Trưng', 31, 7, 1, 21.020000, 105.830000, 5, TRUE, 12, 50),
('Biệt thự 5 phòng ngủ', 'Sang trọng, có sân vườn và bể bơi.', 'Biệt thự', 'Bán', 'Đang rao', 9000000000, 300.00, 5, 4, 2, '8 Hàng Gai, Hoàn Kiếm', 8, 2, 1, 21.030500, 105.840500, 9, TRUE, 15, 60),
('Nhà 3 phòng ngủ gần công viên', 'Khu yên tĩnh, gần tiện ích.', 'Nhà phố', 'Bán', 'Đang rao', 3200000000, 120.00, 3, 2, 2, '13 Quang Trung, Đống Đa', 13, 3, 1, 21.045000, 105.865000, 12, FALSE, 12, 50),
('Căn hộ 1 phòng ngủ sang trọng', 'Nội thất hiện đại, an ninh tốt.', 'Căn hộ', 'Bán', 'Đang rao', 2500000000, 50.00, 1, 1, 1, '25 Phúc Lợi, Long Biên', 25, 6, 1, 21.050000, 105.870000, 3, TRUE, 7, 45),
('Biệt thự ven sông', 'View sông Hồng, sân vườn rộng.', 'Biệt thự', 'Bán', 'Đang rao', 12000000000, 400.00, 5, 5, 2, '24 Nhật Tân, Tây Hồ', 24, 5, 1, 21.060000, 105.880000, 5, TRUE, 5, 70),
('Căn hộ 3 phòng ngủ', 'Tiện nghi đầy đủ, gần trường học.', 'Căn hộ', 'Bán', 'Đang rao', 3200000000, 90.00, 3, 2, 2, '19 Yên Hòa, Cầu Giấy', 19, 4, 1, 21.070000, 105.890000, 12, TRUE, 10, 55);

-- 20 sì gòn
INSERT INTO properties 
(title, description, property_type, status, listing_status, price, area, bedrooms, bathrooms, floors, address, ward_id, district_id, province_id, latitude, longitude, owner_id, featured, days_on_market, views_count)
VALUES
('Căn hộ Phường 1, Gò Vấp', 'Căn hộ tiện nghi, thuận tiện đi lại.', 'Căn hộ', 'Cho thuê', 'Đang rao', 8000000, 60, 2, 1, 1, '12 Phường 1, Gò Vấp', 37, 9, 2, 10.8400, 106.6600, 2, FALSE, 12, 25),
('Nhà phố Phường 3, Gò Vấp', 'Nhà phố đẹp, khu dân trí cao.', 'Nhà phố', 'Bán', 'Đang rao', 9000000000, 100, 3, 2, 2, '34 Phường 3, Gò Vấp', 38, 9, 2, 10.8410, 106.6610, 2, TRUE, 10, 40),
('Nhà phố Phường 5, Gò Vấp', 'Nhà phố sang trọng, gần trung tâm.', 'Nhà phố', 'Bán', 'Đang rao', 9500000000, 105, 3, 2, 2, '78 Phường 5, Gò Vấp', 40, 9, 2, 10.8430, 106.6630, 7, TRUE, 8, 50),
('Căn hộ Phường 6, Gò Vấp', 'Căn hộ tiện nghi, an ninh tốt.', 'Căn hộ', 'Cho thuê', 'Đang rao', 8200000, 62, 2, 1, 1, '90 Phường 6, Gò Vấp', 41, 9, 2, 10.8440, 106.6640, 5, FALSE, 12, 35);

-- Bình Thạnh (district_id = 10)
INSERT INTO properties 
(title, description, property_type, status, listing_status, price, area, bedrooms, bathrooms, floors, address, ward_id, district_id, province_id, latitude, longitude, owner_id, featured, days_on_market, views_count)
VALUES
('Căn hộ Phường 1, Bình Thạnh', 'Căn hộ tiện nghi, thuận tiện đi lại.', 'Căn hộ', 'Cho thuê', 'Đang rao', 9000000, 60, 2, 1, 1, '12 Phường 1, Bình Thạnh', 42, 10, 2, 10.8000, 106.7100, 14, FALSE, 12, 25),
('Nhà phố Phường 2, Bình Thạnh', 'Nhà phố đẹp, khu dân trí cao.', 'Nhà phố', 'Bán', 'Đang rao', 10000000000, 95, 3, 2, 2, '34 Phường 2, Bình Thạnh', 43, 10, 2, 10.8010, 106.7110,  2, TRUE, 10, 40),
('Căn hộ Phường 3, Bình Thạnh', 'Căn hộ hiện đại, đầy đủ tiện nghi.', 'Căn hộ', 'Cho thuê', 'Đang rao', 8800000, 58, 2, 1, 1, '56 Phường 3, Bình Thạnh', 44, 10, 2, 10.8020, 106.7120, 9, FALSE, 15, 30),
('Nhà phố Phường 6, Bình Thạnh', 'Nhà phố sang trọng, gần trung tâm.', 'Nhà phố', 'Bán', 'Đang rao', 10500000000, 110, 3, 2, 2, '78 Phường 6, Bình Thạnh', 45, 10, 2, 10.8030, 106.7130, 7, TRUE, 8, 50);

-- Quận 1 (district_id = 11)
INSERT INTO properties 
(title, description, property_type, status, listing_status, price, area, bedrooms, bathrooms, floors, address, ward_id, district_id, province_id, latitude, longitude, owner_id, featured, days_on_market, views_count)
VALUES
('Căn hộ Bến Nghé, Quận 1', 'Căn hộ tiện nghi, gần trung tâm.', 'Căn hộ', 'Cho thuê', 'Đang rao', 15000000, 70, 2, 2, 1, '12 Bến Nghé, Quận 1', 47, 11, 2, 10.7750, 106.7000, 12, TRUE, 10, 30),
('Nhà phố Bến Thành, Quận 1', 'Nhà phố sang trọng, vị trí đắc địa.', 'Nhà phố', 'Bán', 'Đang rao', 12000000000, 120, 3, 2, 3, '34 Bến Thành, Quận 1', 48, 11, 2, 10.7760, 106.7010,  5, TRUE, 8, 50),
('Căn hộ Cầu Ông Lãnh, Quận 1', 'Căn hộ hiện đại, thuận tiện đi lại.', 'Căn hộ', 'Cho thuê', 'Đang rao', 14000000, 68, 2, 1, 1, '56 Cầu Ông Lãnh, Quận 1', 49, 11, 2, 10.7770, 106.7020, 3, FALSE, 12, 40),
('Nhà phố Cô Giang, Quận 1', 'Nhà phố đẹp, gần trung tâm.', 'Nhà phố', 'Bán', 'Đang rao', 13000000000, 100, 3, 2, 2, '78 Cô Giang, Quận 1', 50, 11, 2, 10.7780, 106.7030, 5, TRUE, 10, 45),

-- Quận 2 (district_id = 12)
INSERT INTO properties 
(title, description, property_type, status, listing_status, price, area, bedrooms, bathrooms, floors, address, ward_id, district_id, province_id, latitude, longitude, owner_id, featured, days_on_market, views_count)
VALUES
('Căn hộ Thảo Điền, Quận 2', 'Căn hộ tiện nghi, gần sông.', 'Căn hộ', 'Cho thuê', 'Đang rao', 18000000, 75, 2, 2, 1, '12 Thảo Điền, Quận 2', 52, 12, 2, 10.7900, 106.7200, 2, TRUE, 9, 35),
('Nhà phố An Phú, Quận 2', 'Nhà phố sang trọng, gần trung tâm.', 'Nhà phố', 'Bán', 'Đang rao', 15000000000, 130, 3, 2, 3, '34 An Phú, Quận 2', 53, 12, 2, 10.7910, 106.7210, 3, TRUE, 7, 55),
('Nhà phố Bình Trưng Đông, Quận 2', 'Nhà phố đẹp, gần trung tâm.', 'Nhà phố', 'Bán', 'Đang rao', 14000000000, 120, 3, 2, 2, '78 Bình Trưng Đông, Quận 2', 55, 12, 2, 10.7930, 106.7230, 14, TRUE, 8, 45),
('Căn hộ Bình Trưng Tây, Quận 2', 'Căn hộ tiện nghi, an ninh tốt.', 'Căn hộ', 'Cho thuê', 'Đang rao', 17500000, 72, 2, 1, 1, '90 Bình Trưng Tây, Quận 2', 56, 12, 2, 10.7940, 106.7240, 5, FALSE, 12, 35);


CREATE TABLE ahp_property_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    criteria_id INT NOT NULL,
    user_id INT NULL, -- optional nếu muốn đánh giá theo user
    score DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (criteria_id) REFERENCES ahp_criteria(id),
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);


-- ==============================
-- Bảng tiêu chí AHP
-- ==============================
CREATE TABLE ahp_criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==============================
-- Bảng đánh giá cặp tiêu chí
-- ==============================
CREATE TABLE ahp_pairwise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    criteria_id_1 INT NOT NULL,
    criteria_id_2 INT NOT NULL,
    score DECIMAL(5,2) NOT NULL, -- giá trị từ 1/9 đến 9
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_criteria1 FOREIGN KEY (criteria_id_1) REFERENCES ahp_criteria(id) ON DELETE CASCADE,
    CONSTRAINT fk_criteria2 FOREIGN KEY (criteria_id_2) REFERENCES ahp_criteria(id) ON DELETE CASCADE,
    CONSTRAINT uq_pair UNIQUE (criteria_id_1, criteria_id_2)
) ENGINE=InnoDB;

-- ==============================
-- Bảng điểm property theo tiêu chí
-- ==============================
DROP TABLE IF EXISTS ahp_property_scores;
CREATE TABLE ahp_property_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    criteria_id INT NOT NULL,
    user_id INT NULL, -- optional nếu muốn lưu đánh giá theo user
    score DECIMAL(10,2) NOT NULL, -- điểm đánh giá property theo tiêu chí
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_criteria FOREIGN KEY (criteria_id) REFERENCES ahp_criteria(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==============================
-- Bảng kết quả AHP
-- ==============================
select * from ahp_property_scores;

SELECT p.*, COALESCE(a.score,0) AS ahp_score
FROM properties p
LEFT JOIN ahp_property_scores a ON p.id = a.property_id
ORDER BY score DESC
LIMIT 10 OFFSET 0;


SELECT p.*, COALESCE(a.score,0) AS ahp_score
FROM properties p
LEFT JOIN (
    SELECT property_id, SUM(score) AS score
    FROM ahp_property_scores
    GROUP BY property_id
) a ON p.id = a.property_id
ORDER BY a.score DESC
LIMIT 10 OFFSET 0;


DROP TABLE IF EXISTS ahp_pairwise;
DROP TABLE IF EXISTS ahp_results;


INSERT INTO ahp_criteria (name, description) VALUES
('Giá', 'Mức giá của bất động sản'),
('Vị trí', 'Vị trí địa lý, tiện ích xung quanh'),
('Diện tích', 'Diện tích sử dụng của bất động sản'),
('Phòng ngủ', 'Số lượng phòng ngủ'),
('Phòng tắm', 'Số lượng phòng tắm'),
('Tầng', 'Tầng của bất động sản');

select * from ahp_property_scores;

-- So sánh tự thân
INSERT INTO ahp_pairwise (criteria_id_1, criteria_id_2, score) VALUES
(1,1,1),(2,2,1),(3,3,1),(4,4,1),(5,5,1),(6,6,1);

-- So sánh theo thứ tự i<j
INSERT INTO ahp_pairwise (criteria_id_1, criteria_id_2, score) VALUES
(1,2,3),(1,3,5),(1,4,7),(1,5,9),(1,6,5),
(2,3,3),(2,4,5),(2,5,7),(2,6,3),
(3,4,3),(3,5,5),(3,6,3),
(4,5,3),(4,6,5),
(5,6,3);

-- Cặp nghịch đảo i>j
INSERT INTO ahp_pairwise (criteria_id_1, criteria_id_2, score) VALUES
(2,1,0.333),(3,1,0.2),(4,1,0.143),(5,1,0.111),(6,1,0.2),
(3,2,0.333),(4,2,0.2),(5,2,0.143),(6,2,0.333),
(4,3,0.333),(5,3,0.2),(6,3,0.333),
(5,4,0.333),(6,4,0.2),
(6,5,0.333);

SELECT * FROM properties LIMIT 10;

truncate ahp_property_scores;
INSERT INTO ahp_property_scores (property_id, criteria_id, score) VALUES
-- Property 1
(1,1,9.92),(1,2,2.00),(1,3,1.76),(1,4,2.00),(1,5,0.00),(1,6,0.00),
-- Property 2
(2,1,0.00),(2,2,10.00),(2,3,9.05),(2,4,8.00),(2,5,8.00),(2,6,1.00),
-- Property 3
(3,1,9.99),(3,2,6.00),(3,3,3.05),(3,4,4.00),(3,5,2.00),(3,6,1.00),
-- Property 4
(4,1,9.99),(4,2,10.00),(4,3,0.00),(4,4,0.00),(4,5,0.00),(4,6,0.00),
-- Property 5
(5,1,8.92),(5,2,4.00),(5,3,5.29),(5,4,6.00),(5,5,4.00),(5,6,1.00);
INSERT INTO ahp_property_scores (property_id, criteria_id, score) VALUES

-- Property 6
(6,1,1.21),(6,2,8.00),(6,3,10.00),(6,4,8.00),(6,5,10.00),(6,6,1.00),
-- Property 7
(7,1,10.00),(7,2,10.00),(7,3,0.59),(7,4,0.00),(7,5,0.00),(7,6,0.00),
-- Property 8
(8,1,9.78),(8,2,6.00),(8,3,2.12),(8,4,2.00),(8,5,2.00),(8,6,1.00),
-- Property 9
(9,1,10.00),(9,2,10.00),(9,3,1.18),(9,4,2.00),(9,5,0.00),(9,6,0.00),
-- Property 10
(10,1,8.46),(10,2,4.00),(10,3,4.71),(10,4,6.00),(10,5,4.00),(10,6,1.00),
-- Property 11
(11,1,2.42),(11,2,8.00),(11,3,7.65),(11,4,8.00),(11,5,8.00),(11,6,1.00),
-- Property 12
(12,1,9.78),(12,2,10.00),(12,3,3.05),(12,4,4.00),(12,5,2.00),(12,6,1.00),
-- Property 13
(13,1,9.92),(13,2,8.00),(13,3,0.88),(13,4,0.00),(13,5,0.00),(13,6,0.00),
-- Property 14
(14,1,1.21),(14,2,6.00),(14,3,10.00),(14,4,8.00),(14,5,10.00),(14,6,1.00),
-- Property 15
(15,1,9.84),(15,2,4.00),(15,3,2.82),(15,4,2.00),(15,5,0.00),(15,6,0.00),
-- Property 16
(16,1,8.50),(16,2,10.00),(16,3,3.05),(16,4,4.00),(16,5,2.00),(16,6,3.00),
-- Property 17
(17,1,1.92),(17,2,6.00),(17,3,9.05),(17,4,6.00),(17,5,6.00),(17,6,1.00),
-- Property 18
(18,1,9.99),(18,2,0.00),(18,3,0.00),(18,4,0.00),(18,5,0.00),(18,6,0.00),
-- Property 19
(19,1,8.92),(19,2,6.00),(19,3,2.12),(19,4,2.00),(19,5,2.00),(19,6,1.00),
-- Property 20
(20,1,8.84),(20,2,8.00),(20,3,2.94),(20,4,4.00),(20,5,2.00),(20,6,1.00),
-- Property 21
(21,1,9.46),(21,2,6.00),(21,3,3.53),(21,4,4.00),(21,5,2.00),(21,6,1.00),
-- Property 22
(22,1,1.15),(22,2,8.00),(22,3,9.41),(22,4,8.00),(22,5,10.00),(22,6,1.00),
-- Property 23
(23,1,10.00),(23,2,10.00),(23,3,0.59),(23,4,0.00),(23,5,0.00),(23,6,0.00),
-- Property 24
(24,1,9.78),(24,2,6.00),(24,3,2.12),(24,4,2.00),(24,5,2.00),(24,6,1.00),
-- Property 25
(25,1,10.00),(25,2,10.00),(25,3,1.18),(25,4,2.00),(25,5,0.00),(25,6,0.00),
-- Property 26
(26,1,8.46),(26,2,4.00),(26,3,4.71),(26,4,6.00),(26,5,4.00),(26,6,1.00),
-- Property 27
(27,1,2.42),(27,2,8.00),(27,3,7.65),(27,4,8.00),(27,5,8.00),(27,6,1.00),
-- Property 28
(28,1,9.78),(28,2,10.00),(28,3,3.05),(28,4,4.00),(28,5,2.00),(28,6,1.00),
-- Property 29
(29,1,9.92),(29,2,8.00),(29,3,0.88),(29,4,0.00),(29,5,0.00),(29,6,0.00),
-- Property 30
(30,1,1.21),(30,2,6.00),(30,3,10.00),(30,4,8.00),(30,5,10.00),(30,6,1.00),
-- Property 31
(31,1,9.84),(31,2,4.00),(31,3,2.82),(31,4,2.00),(31,5,0.00),(31,6,0.00),
-- Property 32
(32,1,8.50),(32,2,10.00),(32,3,3.05),(32,4,4.00),(32,5,2.00),(32,6,3.00),
-- Property 33
(33,1,1.92),(33,2,6.00),(33,3,9.05),(33,4,6.00),(33,5,6.00),(33,6,1.00),
-- Property 34
(34,1,9.99),(34,2,0.00),(34,3,0.00),(34,4,0.00),(34,5,0.00),(34,6,0.00),
-- Property 35
(35,1,8.92),(35,2,6.00),(35,3,2.12),(35,4,2.00),(35,5,2.00),(35,6,1.00),
-- Property 36
(36,1,8.84),(36,2,8.00),(36,3,2.94),(36,4,4.00),(36,5,2.00),(36,6,1.00),
-- Property 37
(37,1,9.46),(37,2,6.00),(37,3,3.53),(37,4,4.00),(37,5,2.00),(37,6,1.00),
-- Property 38
(38,1,1.15),(38,2,8.00),(38,3,9.41),(38,4,8.00),(38,5,10.00),(38,6,1.00),
-- Property 39
(39,1,10.00),(39,2,10.00),(39,3,0.59),(39,4,0.00),(39,5,0.00),(39,6,0.00),
-- Property 40
(40,1,9.78),(40,2,6.00),(40,3,2.12),(40,4,2.00),(40,5,2.00),(40,6,1.00),
-- Property 41
(41,1,10.00),(41,2,10.00),(41,3,1.18),(41,4,2.00),(41,5,0.00),(41,6,0.00),
-- Property 42
(42,1,8.46),(42,2,4.00),(42,3,4.71),(42,4,6.00),(42,5,4.00),(42,6,1.00),
-- Property 43
(43,1,2.42),(43,2,8.00),(43,3,7.65),(43,4,8.00),(43,5,8.00),(43,6,1.00),
-- Property 44
(44,1,9.78),(44,2,10.00),(44,3,3.05),(44,4,4.00),(44,5,2.00),(44,6,1.00),
-- Property 45
(45,1,9.92),(45,2,8.00),(45,3,0.88),(45,4,0.00),(45,5,0.00),(45,6,0.00),
-- Property 46
(46,1,1.21),(46,2,6.00),(46,3,10.00),(46,4,8.00),(46,5,10.00),(46,6,1.00),
-- Property 47
(47,1,9.84),(47,2,4.00),(47,3,2.82),(47,4,2.00),(47,5,0.00),(47,6,0.00),
-- Property 48
(48,1,8.50),(48,2,10.00),(48,3,3.05),(48,4,4.00),(48,5,2.00),(48,6,3.00),
-- Property 49
(49,1,1.92),(49,2,6.00),(49,3,9.05),(49,4,6.00),(49,5,6.00),(49,6,1.00),
-- Property 50
(50,1,9.99),(50,2,0.00),(50,3,0.00),(50,4,0.00),(50,5,0.00),(50,6,0.00),
-- Property 51
(51,1,8.92),(51,2,6.00),(51,3,2.12),(51,4,2.00),(51,5,2.00),(51,6,1.00),
-- Property 52
(52,1,8.84),(52,2,8.00),(52,3,2.94),(52,4,4.00),(52,5,2.00),(52,6,1.00),
-- Property 53
(53,1,9.46),(53,2,6.00),(53,3,3.53),(53,4,4.00),(53,5,2.00),(53,6,1.00),
-- Property 54
(54,1,1.15),(54,2,8.00),(54,3,9.41),(54,4,8.00),(54,5,10.00),(54,6,1.00),
-- Property 55
(55,1,10.00),(55,2,10.00),(55,3,0.59),(55,4,0.00),(55,5,0.00),(55,6,0.00),
-- Property 56
(56,1,9.78),(56,2,6.00),(56,3,2.12),(56,4,2.00),(56,5,2.00),(56,6,1.00),
-- Property 57
(57,1,10.00),(57,2,10.00),(57,3,1.18),(57,4,2.00),(57,5,0.00),(57,6,0.00),
-- Property 58
(58,1,8.46),(58,2,4.00),(58,3,4.71),(58,4,6.00),(58,5,4.00),(58,6,1.00),
-- Property 59
(59,1,2.42),(59,2,8.00),(59,3,7.65),(59,4,8.00),(59,5,8.00),(59,6,1.00),
-- Property 60
(60,1,9.78),(60,2,10.00),(60,3,3.05),(60,4,4.00),(60,5,2.00),(60,6,1.00);





























SELECT 
    w.id AS ward_id,
    w.name AS ward_name,
    w.code AS ward_code,
    d.id AS district_id,
    d.name AS district_name,
    d.code AS district_code,
    d.province_id
FROM wards w
JOIN districts d ON w.district_id = d.id
ORDER BY d.id, w.id;


SELECT id,role FROM user_profiles;


-- ===============================
-- Bảng User Profiles
-- ===============================
CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('admin','seller','buyer') DEFAULT 'buyer',
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===============================
-- Bảng Provinces (Tỉnh/Thành phố)
-- ===============================
CREATE TABLE provinces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===============================
-- Bảng Districts (Quận/Huyện)
-- ===============================
CREATE TABLE districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    province_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ===============================
-- Bảng Wards (Phường/Xã)
-- ===============================
CREATE TABLE wards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    district_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ===============================
-- Bảng Properties
-- ===============================
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(100),
    status VARCHAR(100),
    listing_status VARCHAR(100),
    price BIGINT,
    area DECIMAL(10,2),
    bedrooms INT,
    bathrooms INT,
    floors INT,
    address TEXT,
    ward_id INT,
    district_id INT,
    province_id INT,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    owner_id INT,
    featured BOOLEAN DEFAULT FALSE,
    days_on_market INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES wards(id) ON DELETE SET NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL,
    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES user_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tạo index cho tìm kiếm nhanh
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_location ON properties(province_id, district_id, ward_id);

-- ===============================
-- Property Images
-- ===============================
CREATE TABLE property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===============================
-- Favorites
-- ===============================
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
        ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id)
        ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, property_id)
) ENGINE=InnoDB;

-- ===============================
-- Property Views
-- ===============================
CREATE TABLE property_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    property_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tạo index cho thống kê views
CREATE INDEX idx_property_views ON property_views(property_id);
