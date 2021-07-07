-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2021 at 07:06 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flyzone_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `quantity`, `createdAt`, `updatedAt`, `productId`, `userId`) VALUES
(1, 1, '2021-07-07 16:55:04', '2021-07-07 16:55:04', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `cat_name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `cat_name`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Womens', 1, '2021-07-07 16:45:58', '2021-07-07 16:45:58');

-- --------------------------------------------------------

--
-- Table structure for table `productlabels`
--

CREATE TABLE `productlabels` (
  `id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `productId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `productlabels`
--

INSERT INTO `productlabels` (`id`, `label`, `value`, `createdAt`, `updatedAt`, `productId`) VALUES
(1, 'Size', 'M', '2021-07-07 16:47:31', '2021-07-07 16:47:31', 1),
(2, 'Color', 'Mix', '2021-07-07 16:47:37', '2021-07-07 16:47:37', 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `mrp` double NOT NULL,
  `mainImage` varchar(255) NOT NULL,
  `smallFront` varchar(255) NOT NULL,
  `smallBack` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `stock` int(11) NOT NULL,
  `salePrice` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `subCategoryId` int(11) DEFAULT NULL,
  `sellerId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title`, `mrp`, `mainImage`, `smallFront`, `smallBack`, `description`, `stock`, `salePrice`, `createdAt`, `updatedAt`, `categoryId`, `subCategoryId`, `sellerId`) VALUES
(1, 'Casual Jacket', 1599, 'images\\606ef60c-7d39-4cfb-a7d6-5cbf1db1c3dc-item_lg_1.jpg', 'images\\88d67871-4332-4e93-a64d-ea7110f95d5d-product_6.jpg', 'images\\30f38a9d-9da2-4ebc-86e2-369336b0d0b9-product_back_6.jpg', '<p><em><strong>Urbano Fashion</strong> is a young and bold fashion brand, which brings to you the latest trends in men&#39;s fashion. We aspire to epitomize and bring the right balance between style and comfort in our products. In today&#39;s fast paced world, our endeavor is to innovate and differentiate our product line to cater to the trend-setting generation. Keeping our customer&#39;s happiness as our primary goal, we are ever striving to launch unique styles and adding value to India&#39;s fashion conscious wardrobes. Select from our wide fashionable range of Jeans, T-Shirts, Shirts, Trousers, Chinos, Sweatshirts, Jackets and more, and be rest assured to have a smile on your face, look good and feel good.</em></p>\r\n', 10, 999, '2021-07-07 16:46:49', '2021-07-07 16:46:49', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sellers`
--

CREATE TABLE `sellers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `shopName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `shopLogo` varchar(255) NOT NULL,
  `docs` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sellers`
--

INSERT INTO `sellers` (`id`, `name`, `shopName`, `email`, `mobile`, `password`, `shopLogo`, `docs`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Fly-Zone', 'Fly-Zone', 'flyzone@gmail.com', '9097862014', '12345678', 'sellerDocs\\7e2efb69-8181-41ac-b382-c1d74002e4ff-item_lg_1.jpg', 'sellerDocs\\68ec3c60-7ac9-47e7-964a-96c445f5eda2-item_lg_1.jpg', 1, '2021-07-07 16:45:09', '2021-07-07 16:45:23');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(32) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('ausrlL7TurkI0LksIRvQQdJs15P6NH29', '2021-07-08 17:06:01', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAdminLoggedIn\":true,\"expires\":\"2021-07-08T16:48:10.254Z\",\"isSellerLoggedIn\":true,\"sellerData\":{\"id\":1,\"name\":\"Fly-Zone\",\"shopName\":\"Fly-Zone\",\"email\":\"flyzone@gmail.com\",\"mobile\":\"9097862014\",\"password\":\"12345678\",\"shopLogo\":\"sellerDocs\\\\7e2efb69-8181-41ac-b382-c1d74002e4ff-item_lg_1.jpg\",\"docs\":\"sellerDocs\\\\68ec3c60-7ac9-47e7-964a-96c445f5eda2-item_lg_1.jpg\",\"status\":1,\"createdAt\":\"2021-07-07T16:45:09.000Z\",\"updatedAt\":\"2021-07-07T16:45:23.000Z\"},\"url\":\"http://localhost:3000/product-details/1\",\"userData\":{\"id\":1,\"mobile\":\"9097862014\",\"status\":1,\"updatedAt\":\"2021-07-07T16:48:10.248Z\",\"createdAt\":\"2021-07-07T16:48:10.248Z\"},\"isUserLoggedIn\":true}', '2021-07-07 16:45:18', '2021-07-07 17:06:01');

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `sub_cat_name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`id`, `sub_cat_name`, `status`, `createdAt`, `updatedAt`, `categoryId`) VALUES
(1, 'Shirts', 1, '2021-07-07 16:46:05', '2021-07-07 16:46:05', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `mobile`, `name`, `email`, `status`, `createdAt`, `updatedAt`) VALUES
(1, '9097862014', NULL, NULL, 1, '2021-07-07 16:48:10', '2021-07-07 16:48:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `productlabels`
--
ALTER TABLE `productlabels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `subCategoryId` (`subCategoryId`),
  ADD KEY `sellerId` (`sellerId`);

--
-- Indexes for table `sellers`
--
ALTER TABLE `sellers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `productlabels`
--
ALTER TABLE `productlabels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sellers`
--
ALTER TABLE `sellers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productlabels`
--
ALTER TABLE `productlabels`
  ADD CONSTRAINT `productlabels_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`subCategoryId`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`sellerId`) REFERENCES `sellers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
